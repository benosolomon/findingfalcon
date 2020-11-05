import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { FindingFalconeComponent } from './components/finding-falcone/finding-falcone.component';
import { ResultComponent } from './components/result/result.component';
import { AuthguardService } from './services/authguard.service';



const routes: Routes = [
  {
    path: '', redirectTo: '/home', pathMatch: 'full'
  },
  { path: 'home', component: HomeComponent },
  {path: 'findingFalcone' , component: FindingFalconeComponent},
  {path: 'result' , component: ResultComponent , canActivate: [AuthguardService]},
  { path: '**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
