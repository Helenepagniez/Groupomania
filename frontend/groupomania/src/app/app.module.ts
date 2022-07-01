import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './header.component/header.component';
import { ProfilComponent } from './profil/profil.component';
import { MessagerieComponent } from './messagerie/messagerie.component';
import { ContactComponent } from './contact/contact.component';
import { AccueilComponent } from './accueil/accueil.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { registerLocaleData } from '@angular/common';
import fr from '@angular/common/locales/fr';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    ProfilComponent,
    MessagerieComponent,
    ContactComponent,
    AccueilComponent,
    AuthentificationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  providers: [ { provide: LOCALE_ID, useValue: 'fr-FR'}],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor() {
    registerLocaleData(fr);
  }
}
