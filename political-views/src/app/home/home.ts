import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Disclaimer } from '../disclaimer/disclaimer';

@Component({
    selector: 'app-home',
    imports: [Disclaimer],
    templateUrl: './home.html',
})
export class Home {

    constructor(private router: Router) { }

    start(): void {
        this.router.navigate(['/questionnaire']);
    }
}
