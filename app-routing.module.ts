import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { MenuAdminComponent } from './menuadmin';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_guards';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'menuadmin', component: MenuAdminComponent, canActivate: [AuthGuard] },
    // { path: 'addmenu', component: AddMenuComponent, canActivate: [AuthGuard] },
    // { path: 'addaccount', component: AddAccountComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(routes);
