import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Profile } from './components/profile/profile';
import { profileguardGuard } from './guards/profileguard-guard';
import { loginRegisterGuard } from './guards/login-register-guard';
import { Habit } from './components/habit/habit';
import { Focus } from './components/focus/focus';
import { Journal } from './components/journal/journal';
import { Journaling } from './components/journaling/journaling';

export const routes: Routes = [
    {path: "", component: Login, title: 'Login', 
        canActivate: [loginRegisterGuard]
    },

    {path: "login",
    component: Login, 
    title: "Login",
    canActivate: [loginRegisterGuard]}, 

    {path: "register", component: Register, title: "Register",
        canActivate: [loginRegisterGuard]
    },
    {path: "profile", 
        component: Profile,
       
        title: "Profile Page", 
        canActivate: [profileguardGuard],
        children: [
            
            {path: 'habits', component: Habit},
            {path: 'focus', component: Focus},
            {path: 'journal', component: Journal}, 
            {path: 'journaling/:id', component: Journaling}
        ]
    },



];
