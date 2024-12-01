import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './pages/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrandIconComponent } from './components/brand-icon/brand-icon.component';
import { FooterComponent } from './components/footer/footer.component';
import { SkillsComponent } from './pages/skills/skills.component';
import { AboutComponent } from './pages/about/about.component';
import { ProjectSummaryComponent } from './components/project-summary/project-summary.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectComponent } from './components/project/project.component';
import { SafeHTMLPipe } from './services/safe-html.service';
import { SocialsComponent } from './pages/socials/socials.component';
import { SocialCardComponent } from './components/social-card/social-card.component';
import { ContactComponent } from './pages/contact/contact.component';

import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { OutputComponent } from './components/output/output.component';
import { LoadingButtonComponent } from './components/loading-button/loading-button.component';
import { LoadingRingComponent } from './components/loading-ring/loading-ring.component';
import { VideoComponent } from './components/video/video.component';
import { IconWheelComponent } from './components/icon-wheel/icon-wheel.component';
import { WINDOW_PROVIDERS } from './window.providers';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    BrandIconComponent,
    FooterComponent,
    SkillsComponent,
    AboutComponent,
    ProjectSummaryComponent,
    ProjectsComponent,
    ProjectComponent,
    SafeHTMLPipe,
    SocialsComponent,
    SocialCardComponent,
    ContactComponent,
    LoginComponent,
    OutputComponent,
    LoadingButtonComponent,
    LoadingRingComponent,
    VideoComponent,
    IconWheelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ],
  providers: [WINDOW_PROVIDERS, provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent]
})
export class AppModule { }
