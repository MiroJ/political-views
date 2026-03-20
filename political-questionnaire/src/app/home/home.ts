import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.html',
})
export class Home {

    constructor(private router: Router) { }

    start(): void {
        this.router.navigate(['/questionnaire']);
    }
}
