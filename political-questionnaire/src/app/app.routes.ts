import { Routes } from '@angular/router';
import { Questionnaire } from './questionnaire/questionnaire';
import { Results } from './results/results';

export const routes: Routes = [
    { path: '', redirectTo: '/questionnaire', pathMatch: 'full' },
    { path: 'questionnaire', component: Questionnaire },
    { path: 'results', component: Results }
];
