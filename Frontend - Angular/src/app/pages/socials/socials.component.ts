import { Component } from '@angular/core';
import { faTwitch, faYoutube, faTwitter, faDiscord, faInstagram, faGithub, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-socials',
  templateUrl: './socials.component.html',
  styleUrls: ['./socials.component.css']
})
export class SocialsComponent {
  faTwitch = faTwitch;
  faYoutube = faYoutube;
  faTwitter = faTwitter;
  faXTwitter = faXTwitter;
  faDiscord = faDiscord;
  faInstagram = faInstagram;
  faGithub = faGithub;
  faEnvelope = faEnvelope;

  replayVideo(e: MouseEvent) {
    (e.target as any).play();
    (e.target as any).currentTime = 0;
  }
  videoError(e: ErrorEvent){
    let s = (e.target as Element).innerHTML;

    (e.target as Element).innerHTML = s;

    (e.target as any).play();
  }
}
