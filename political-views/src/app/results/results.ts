import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuestionService } from '../question-service';
import { PartyPosition, Result } from '../models';
import { Disclaimer } from '../disclaimer/disclaimer';

@Component({
    selector: 'app-results',
    imports: [CommonModule, Disclaimer],
    templateUrl: './results.html',
})
export class Results implements OnInit {
    result: Result | null = null;
    parties: PartyPosition[];

    constructor(
        private questionService: QuestionService,
        private router: Router
    ) { 
        this.parties = questionService.getPartyPositions();
    }

    ngOnInit(): void {
        this.result = this.questionService.calculateResults();
    }

    restart(): void {
        this.questionService.resetAnswers();
        this.router.navigate(['/questionnaire']);
    }

    getEconomicPosition(): number {
        return this.result && this.result.economicScore >= 0 ? this.result.economicPercentage : 50;
    }

    getSocialPosition(): number {
        return this.result && this.result.socialScore >= 0 ? this.result.socialPercentage : 50;
    }
}
