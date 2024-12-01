import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, switchMap, take } from 'rxjs';
// @ts-ignore
import { randomBytes } from 'crypto';
import { environment } from 'src/environments/environment';

interface REQUEST {
  data: Array<CONTACT>,
  pagination: string
};

export interface CONTACT_INFO {
  topic: string,
  email: string,
  message: string
};

export interface CONTACT {
  session: string,
  topic: string,
  email: string,
  message: string,
  pending: boolean,
  archieved_at: number,
  time: number,
  _id: string
};

interface PAGINATION_OPTIONS {
  pagecount?: number,
  customsort?: string,
  timesorted?: boolean
}

const CONTACTS_SERVER = environment.CONTACTS_SERVER || '';

export function GetPaginationValues(pagination = "") {
  if (!pagination) return null;
  let out: [number, number, PAGINATION_OPTIONS] = [10, 0, {}];

  try {
      if (pagination.indexOf('A') >= 0 && pagination.indexOf('B') >= 0 && pagination.indexOf('C') >= 0) {
          out[0] = parseInt(pagination.substring(1, pagination.indexOf('B')));
          out[1] = parseInt(pagination.substring(pagination.indexOf('B') + 1, pagination.indexOf('C')));
      }

      if (pagination.indexOf('T') >= 0) out[2].timesorted = true;
      if (pagination.indexOf('CSS') >= 0 && pagination.indexOf('CSE') >= 0) {
          out[2].customsort = pagination.substring(pagination.indexOf('CSS') + 2, pagination.indexOf('CSE'));
      }
      if (pagination.indexOf('PS') >= 0 && pagination.indexOf('PE') >= 0) out[2].pagecount = parseInt(pagination.substring(pagination.indexOf('PS') + 2, pagination.indexOf('PE')));
  } catch (err) {
      return null;
  }

  return out;
}
export function GetPaginationString(first = 10, cursor = 0, options: PAGINATION_OPTIONS = {}) {
  let s = "A" + first + "B" + Math.max(0, Math.min(cursor, (options.pagecount === undefined ? (cursor + 1) : options.pagecount) - 1)) + "C";
  if (options.timesorted) s += "T";
  if (options.customsort) s += "CSS" + options.customsort + "CSE";
  if (options.pagecount !== undefined) s += "PS" + options.pagecount + "PE";
  return s;
}

@Injectable({
  providedIn: 'root'
})
export class ContactDBService {
  session: string = randomBytes(20).toString('hex');

  constructor(private client: HttpClient) {
    let storage = window.localStorage.getItem('dbsession');
    
    if(!storage){
      window.localStorage.setItem('dbsession', this.session);
    } else {
      this.session = storage;
    }
  }
  
  getContactRequests(token?: string, mode: 'pending' | 'archieved' = 'pending'){
    let headers = { 'authorization': 'OAuth ' + token };
    
    return this.client
      .get<REQUEST>(CONTACTS_SERVER + '/api/contacts?session=' + this.session + '&mode=' + mode, token ? { headers } : undefined)
      .pipe(
        take(1),
        catchError((val) => {
          return of(null);
        }),
        switchMap((response) => {
          if(!response) return of({ data: [], pagination: GetPaginationString() });
          return of(response);
        })
      );
  }
  postContactRequest(contact: CONTACT_INFO) {
    return this.client
        .post<number>(CONTACTS_SERVER + '/api/contacts?session=' + this.session, contact)
        .pipe(
          take(1),
          catchError(val => {
            return of({ status: val.status});
          }),
          switchMap((response: any) => {
            return of(response.status === 200);
          })
        );
  }
  putContactRequest(id: string, token: string) {
    return this.client
        .put<number>(CONTACTS_SERVER + '/api/contacts?id=' + id, {}, { headers: { 'authorization': 'OAuth ' + token } })
        .pipe(
          take(1),
          catchError(val => {
            return of({ status: val.status});
          }),
          switchMap((response: any) => {
            return of(response.status === 200);
          })
        );
  }
  removeContactRequest(id: string, token?: string){
    let headers = { 'authorization': 'OAuth ' + token };
    
    return this.client
        .delete<number>(CONTACTS_SERVER + '/api/contacts?session=' + this.session + '&id=' + id, token ? { headers } : undefined)
        .pipe(
          take(1),
          catchError(val => {
            return of({ status: val.status});
          }),
          switchMap((response: any) => {
            return of(response.status === 200);
          })
        );
  }
}
