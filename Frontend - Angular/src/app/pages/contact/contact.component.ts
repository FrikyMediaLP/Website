import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faTrashCan, faBoxArchive } from '@fortawesome/free-solid-svg-icons';
import { LoadingButtonComponent } from 'src/app/components/loading-button/loading-button.component';
import { OutputComponent } from 'src/app/components/output/output.component';
import { CONTACT, ContactDBService } from 'src/app/services/contact-db.service';
import { LangService } from 'src/app/services/lang.service';
import { TwitchService } from 'src/app/services/twitch.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  providers: [ContactDBService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  faTrash = faTrashCan;
  faBoxArchive = faBoxArchive;

  @ViewChild('output') outputRef: OutputComponent;
  @ViewChild('button') buttonRef: LoadingButtonComponent;

  pending_loading: boolean = false;
  pending_contacts: Array<CONTACT> = [];
  
  archieved_loading: boolean = false;
  archieved_contacts: Array<CONTACT> = [];
  
  public form = new FormGroup({
    topic: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(100)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    message: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(1000)
    ])
  });

  public formSubmitted = false;
  
  constructor(
    private langService: LangService, 
    private contacts: ContactDBService, 
    private changeDetectorRef: ChangeDetectorRef,
    public twitch: TwitchService
  ) {
    this.refetchPending();

    this.twitch.getUserUpdates().subscribe(user => {
      if(!user) this.archieved_contacts = [];
      else if(this.isAdmin(user.sub)) this.refetchArchieved();

      this.changeDetectorRef.detectChanges();
    });

    if(this.isAdmin(this.twitch.userData?.sub)) {
      this.refetchArchieved();
    }

    this.langService.langEvents.subscribe((lang) => {
      this.changeDetectorRef.detectChanges();
    });
  }

  refetchPending(){
    this.pending_loading = true;

    this.contacts.getContactRequests(this.twitch.userToken).subscribe(val => { 
      this.pending_loading = false;
      this.pending_contacts = val.data;
      this.changeDetectorRef.detectChanges();
    });
  }
  refetchArchieved(){
    this.archieved_loading = true;

    this.contacts.getContactRequests(this.twitch.userToken, 'archieved').subscribe(val => { 
      this.archieved_loading = false;
      this.archieved_contacts = val.data;
      this.changeDetectorRef.detectChanges();
    });
  }
  
  submit() {
    if(this.formSubmitted) return;
    this.formSubmitted = true;
    this.buttonRef.loading = true;
    this.pending_loading = true;
    this.changeDetectorRef.detectChanges();
    
    this.contacts
      .postContactRequest(this.form.value as CONTACT)
      .subscribe(x => {
        if(x === true){
          this.refetchPending();
          this.form.reset();
          this.outputRef.trigger("INFO", { 
            'de': 'Anfrage übermittelt!',
            'en': 'Contact Request delivered!'
          }[this.lang]);
        } else {
          this.pending_loading = false;
        }

        this.buttonRef.loading = false;
        this.formSubmitted = false;
        this.changeDetectorRef.detectChanges();
      });
  }
  archieve(id: string){
    this.pending_loading = true;
    this.archieved_loading = true;
    this.changeDetectorRef.detectChanges();

    this.contacts
      .putContactRequest(id, this.twitch.userToken)
      .subscribe(x => {
        if(x === true){
          this.refetchPending();
          this.refetchArchieved();
          this.outputRef.trigger("INFO", { 
            'de': 'Anfrage archieviert!',
            'en': 'Contact Request archieved!'
          }[this.lang]);
        } else {
          this.pending_loading = false;
        }

        this.changeDetectorRef.detectChanges();
      });
  }
  remove(id: string) {
    this.pending_loading = true;
    this.changeDetectorRef.detectChanges();

    this.contacts
      .removeContactRequest(id, this.twitch.userToken)
      .subscribe(x => {
        if(x === true){
          this.refetchPending();
          this.outputRef.trigger("INFO", { 
            'de': 'Anfrage gelöscht!',
            'en': 'Contact Request deleted!'
          }[this.lang]);
        } else {
          this.pending_loading = false;
        }

        this.changeDetectorRef.detectChanges();
      });
  }
  
  isAdmin(user_id: string ){
    return environment.ADMIN_TWITCH_IDS.find(elt => elt === user_id) !== undefined;
  }
  toDate(t: number){
    return new Date(t).toLocaleString(undefined, { 
      year: 'numeric',
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  get lang() {
    return this.langService.lang;
  }
}
