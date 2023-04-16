import { RouterModule, Routes } from '@angular/router';
import { AuthPage } from './auth.page';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
   component: AuthPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthPageRoutingModule { }