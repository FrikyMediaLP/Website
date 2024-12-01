import { Inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
// @ts-ignore
import { randomBytes } from 'crypto';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError, of, switchMap, take } from 'rxjs';
import { WINDOW } from '../window.providers';

interface obj {
  [key: string]: null
}

export interface USER {
  aud: string,
  email: string,
  email_verified: boolean,
  exp: number,
  iat: number,
  iss: string,
  nonce: string,
  picture: string,
  preferred_username: string,
  sub: string
}

const STORAGE_KEY_NONCE = 'ttvnonce';
const STORAGE_KEY_STATE = 'ttvstate';
const STORAGE_KEY_TOKEN = 'ttvuser';
const STORAGE_KEY_ORIGIN = 'ttvorigin';

const LOGIN_SERVER = environment.LOGIN_SERVER || '';

@Injectable({
  providedIn: 'root'
})
export class TwitchService {
  nonce: string = randomBytes(20).toString('hex');
  state: string = randomBytes(20).toString('hex');
  
  userToken: string = null;
  userData: USER | null = null;
  userUpdates: Subject<USER | null> = new Subject();

  busy: boolean = false;

  constructor(@Inject(WINDOW) private window: Window, private client: HttpClient) {
    let nonceStorage = window.localStorage.getItem(STORAGE_KEY_NONCE);
    let stateStorage = window.localStorage.getItem(STORAGE_KEY_STATE);
    this.userToken = window.localStorage.getItem(STORAGE_KEY_TOKEN);
    
    if(!nonceStorage) window.localStorage.setItem(STORAGE_KEY_NONCE, this.nonce);
    else this.nonce = nonceStorage;
    
    if(!stateStorage) window.localStorage.setItem(STORAGE_KEY_STATE, this.state);
    else this.state = stateStorage;
  }
  Reset(){
    this.SetNonce();
    this.SetState();
  }
  SetNonce() {
    this.nonce = randomBytes(20).toString('hex');
    window.localStorage.setItem(STORAGE_KEY_NONCE, this.nonce);
  }
  SetState(){
    this.state = randomBytes(20).toString('hex');
    window.localStorage.setItem(STORAGE_KEY_STATE, this.state);
  }
  
  ResetOrigin(){
    window.sessionStorage.removeItem(STORAGE_KEY_ORIGIN);
  }
  SetOrigin(origin: string){
    window.sessionStorage.setItem(STORAGE_KEY_ORIGIN, origin);
  }
  GetOrigin(){
    return window.sessionStorage.getItem(STORAGE_KEY_ORIGIN);
  }

  SetUser(token: string, user: USER) {
    this.userToken = token;
    this.userData = user;
    window.localStorage.setItem(STORAGE_KEY_TOKEN, token);
    this.userUpdates.next(user);
  }
  clearUser(){
    window.localStorage.removeItem(STORAGE_KEY_TOKEN);
    this.userToken = null;
    this.userData = null;
    this.userUpdates.next(null);
  }
  getUserUpdates(){
    return this.userUpdates;
  }

  GenerateLoginLink(claims : Array<string> = [ 'email', 'picture', 'preferred_username', 'email_verified' ]){
    let link = "https://id.twitch.tv/oauth2/authorize";
    link += "?client_id=" + environment.TTV_CLIENT_ID;
    link += "&redirect_uri=" + this.window.location.origin + '/login';
    link += "&response_type=id_token";
    link += "&scope=openid";
    
    if (claims && claims.length > 0) {
        let obj: obj = {};
        for (let claim of claims) {
            obj[claim] = null;
        }
        link += "&claims=" + JSON.stringify({ id_token: obj, userinfo: obj });
    }

    link += "&nonce=" + this.nonce;
    link += "&state=" + this.state;

    link += "&force_verify=true";

    return link;
  }
  VerifyTTVJWT(token: string, nonce?: string): Observable<{ err?: { name: string, message: string }, user?: USER }> {
    if(this.busy) return of({ err: { name: 'busy', message: 'Twitch Service is still busy checking another token!' } });
    this.busy = true;
    
    return this.client
      .get(LOGIN_SERVER + '/api/login', { headers: { Authorization: 'OAuth ' + token } })
      .pipe(
        take(1),
        catchError((val) => {
          return of({ err: { name: val.name, message: val.name === 'HttpErrorResponse' ? 'Login Validation Service down or unreachable' : val.statusText } });
        }),
        switchMap((val: { err?: { name: string, message: string }, nonce?: string }) => {
          this.busy = false;
          
          if(val.err){
            this.clearUser();
            this.Reset();
            return of(val);
          }

          if(nonce && val.nonce !== nonce) {
            this.clearUser();
            this.Reset();
            return of({ err: { name: 'Nonce missmatch', message: 'Nonce missmatch blocked token verivication!' } });
          }

          this.SetUser(token, val as USER);
          return of({ user: val as USER });
        })
      );
  }
}
