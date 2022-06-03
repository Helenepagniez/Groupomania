import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import { ContactComponent } from './contact/contact.component';
import { AuthGuard } from './core/guards/auth.guards';
import { MessagerieComponent } from './messagerie/messagerie.component';
import { ProfilComponent } from './profil/profil.component';

const routes: Routes = [
  {path:'', component: AuthentificationComponent},
  {path:'accueil', component: AccueilComponent, canActivate:[AuthGuard] },
  {path:'profil', component: ProfilComponent, canActivate:[AuthGuard] },
  {path:'messagerie', component: MessagerieComponent, canActivate:[AuthGuard] },
  {path:'contact', component: ContactComponent, canActivate:[AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
