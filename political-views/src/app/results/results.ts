import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuestionService } from '../question-service';
import { Result } from '../models';

@Component({
    selector: 'app-results',
    imports: [CommonModule],
    templateUrl: './results.html',
})
export class Results implements OnInit {
    result: Result | null = null;

    parties = [
        { name: 'ГЕРБ–СДС',          x: 14, y: 13, color: '#1565c0' },
        { name: 'ПП–ДБ',             x: 9,  y: 6,  color: '#e65100' },
        { name: 'БСП',               x: 5,  y: 14, color: '#c62828' },
        { name: 'ДПС-НН',            x: 13, y: 12, color: '#2e7d32' },
        { name: 'Възраждане',        x: 7,  y: 18, color: '#4a148c' },
        { name: 'ИТН',               x: 10, y: 12, color: '#7b1fa2' },
        { name: 'Български възход',  x: 8,  y: 11, color: '#bf360c' },
        { name: 'Зелени',            x: 6,  y: 4,  color: '#1b5e20' },
    ];

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
        return this.result ? 100 - this.result.socialPercentage : 50;
    }
}
