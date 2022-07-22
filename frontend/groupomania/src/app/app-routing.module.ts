import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import { ContactComponent } from './contact/contact.component';
import { AuthGuard } from './core/guards/auth.guards';
import { ProfilComponent } from './profil/profil.component';

const routes: Routes = [
  {path:'contact', component: ContactComponent},
  {path:'profil', component: ProfilComponent},
  {path:'accueil', component: AccueilComponent},
  {path:'', component: AuthentificationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
