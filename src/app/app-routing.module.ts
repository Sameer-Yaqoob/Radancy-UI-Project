import { createComponent, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './view/accounts/accounts.component';
import { CreateAccountComponent } from './view/create-account/create-account.component';

const routes: Routes = [
  {path:'' , component:AccountsComponent},
  {path:'create-accounts' , component:CreateAccountComponent},
  {path:'accounts' , component:AccountsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
