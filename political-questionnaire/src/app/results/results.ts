import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuestionService } from '../question';
import { Result } from '../models';

@Component({
    selector: 'app-results',
    imports: [CommonModule],
    templateUrl: './results.html',
})
export class Results implements OnInit {
    result: Result | null = null;

    constructor(
        private questionService: QuestionService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.result = this.questionService.calculateResults();
    }

    restart(): void {
        this.questionService.resetAnswers();
        this.router.navigate(['/questionnaire']);
    }

    getEconomicPosition(): number {
        return this.result ? this.result.economicPercentage : 50;
    }

    getSocialPosition(): number {
        return this.result ? this.result.socialPercentage : 50;
    }
}
