import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Questionnaire } from './questionnaire/questionnaire';
import { Results } from './results/results';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'questionnaire', component: Questionnaire },
    { path: 'results', component: Results }
];
