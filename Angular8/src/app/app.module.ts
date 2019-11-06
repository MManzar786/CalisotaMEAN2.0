//built-in
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialModule } from './material/material.module';

//components
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';

//routes
import { AppRoutingModule, routes } from './app-routing.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { UserService } from './shared/user.service';
import { HomeComponent } from './home/home.component';

//other
import { AuthGuard } from './auth/auth.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './auth/auth.interceptor';
import { MatListModule, MatIconModule, MatSidenavModule, MatButtonModule, MatToolbarModule } from '@angular/material';
import { TestpageComponent } from './testpage/testpage.component';
import { AddEmploymentComponent } from './add-employment/add-employment.component';
import { AddEducationComponent } from './add-education/add-education.component';
import { AddCertificationComponent } from './add-certification/add-certification.component';
import { ResumeComponent } from './resume/resume.component';
import { ContactsComponent } from './contacts/contacts.component';
import { GamecardComponent } from './gamecard/gamecard.component';


@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    SignUpComponent,
    UserProfileComponent,
    SignInComponent,
    HomeComponent,
    TestpageComponent,
    AddEducationComponent,
    AddCertificationComponent,
    AddEmploymentComponent,
    ResumeComponent,
    ContactsComponent,
    GamecardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    MatListModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }, AuthGuard, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
