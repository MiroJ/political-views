import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { QuestionService } from '../question';
import { Question as QuestionModel, UserAnswer } from '../models';

@Component({
    selector: 'app-questionnaire',
    imports: [CommonModule, RouterLink],
    templateUrl: './questionnaire.html',
})
export class Questionnaire implements OnInit {
    questions: QuestionModel[] = [];
    currentQuestionIndex = 0;
    selectedAnswerIndex: number | null = null;
    answeredCount = 0;

    constructor(
        private questionService: QuestionService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.questionService.getQuestions().subscribe({
            next: (questions) => {
                this.questions = questions.sort((a, b) => a.questionNumber - b.questionNumber);
                this.cdr.markForCheck();
            },
            error: (error) => {
                console.error('Error loading questions:', error);
            }
        });

        this.questionService.answers$.subscribe(answers => {
            this.answeredCount = answers.length;
            this.cdr.markForCheck();
        });
    }

    get currentQuestion(): QuestionModel | null {
        return this.questions[this.currentQuestionIndex] || null;
    }

    get progress(): number {
        return this.questions.length > 0 ? (this.answeredCount / this.questions.length) * 100 : 0;
    }

    selectAnswer(index: number): void {
        this.selectedAnswerIndex = index;
    }

    nextQuestion(): void {
        if (this.selectedAnswerIndex !== null && this.currentQuestion) {
            const answer: UserAnswer = {
                questionNumber: this.currentQuestion.questionNumber,
                section: this.currentQuestion.section,
                points: this.currentQuestion.answers[this.selectedAnswerIndex].points
            };

            this.questionService.saveAnswer(answer);

            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.currentQuestionIndex++;
                this.selectedAnswerIndex = null;
            } else {
                this.router.navigate(['/results']);
            }
        }
    }

    previousQuestion(): void {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.selectedAnswerIndex = null;
        }
    }

    canGoNext(): boolean {
        return this.selectedAnswerIndex !== null;
    }
}
