import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Question, UserAnswer, Result } from './models';

@Injectable({
    providedIn: 'root',
})
export class QuestionService {
    private questions: Question[] = [];
    private answersSubject = new BehaviorSubject<UserAnswer[]>([]);
    public answers$ = this.answersSubject.asObservable();

    constructor(private http: HttpClient) { }

    getQuestions(): Observable<Question[]> {
        if (this.questions.length > 0) {
            return new Observable(observer => {
                observer.next(this.questions);
                observer.complete();
            });
        } else {
            return this.http.get<Question[]>('questions.json').pipe(
                tap(questions => this.questions = questions)
            );
        }
    }

    getPartyPositions() {
        return [
            { name: 'ГЕРБ–СДС', x: 14, y: 13, color: '#1565c0' },
            { name: 'ПП–ДБ', x: 9, y: 6, color: '#e65100' },
            { name: 'БСП', x: 5, y: 14, color: '#c62828' },
            { name: 'ДПС-НН', x: 13, y: 12, color: '#2e7d32' },
            { name: 'Възраждане', x: 7, y: 18, color: '#4a148c' },
            { name: 'ИТН', x: 10, y: 12, color: '#7b1fa2' },
            { name: 'Български възход', x: 8, y: 11, color: '#bf360c' },
            { name: 'Зелени', x: 6, y: 4, color: '#1b5e20' },
        ];
    }

    saveAnswer(answer: UserAnswer): void {
        const currentAnswers = this.answersSubject.value;
        const existingIndex = currentAnswers.findIndex(
            a => a.questionNumber === answer.questionNumber
        );

        if (existingIndex !== -1) {
            currentAnswers[existingIndex] = answer;
        } else {
            currentAnswers.push(answer);
        }

        this.answersSubject.next([...currentAnswers]);
    }

    calculateResults(): Result {
        if (this.answersSubject.value.length === 0) {
            return {
                economicScore: -1,
                economicPercentage: 0,
                economicLabel: 'Няма отговори',
                economicQuestionsTotal: 10,
                socialScore: -1,
                socialPercentage: 0,
                socialLabel: 'Няма отговори',
                socialQuestionsTotal: 10
            };
        }

        const answers = this.answersSubject.value;

        const economicSection = 'Икономическа ос (Ляво ↔ Дясно)';
        const economicAnswers = answers.filter(a => a.section === economicSection);
        const economicScore = economicAnswers.reduce((sum, a) => sum + a.points, 0);
        const economicMax = economicAnswers.length * 2; // questions * 2 max points
        const economicPercentage = (economicScore / economicMax) * 100;
        
        const socialSection = 'Социално-културна ос (Прогресивно ↔ Консервативно)';
        const socialAnswers = answers.filter(a => a.section === socialSection);
        const socialScore = socialAnswers.reduce((sum, a) => sum + a.points, 0);
        const socialMax = socialAnswers.length * 2; // questions * 2 max points
        const socialPercentage = ((socialScore) / socialMax) * 100;

        return {
            economicScore: economicScore,
            economicPercentage: economicPercentage,
            economicLabel: this.getEconomicLabel(economicPercentage),
            economicQuestionsTotal: economicAnswers.length,
            socialScore: socialScore,
            socialPercentage: socialPercentage,
            socialLabel: this.getSocialLabel(socialPercentage),
            socialQuestionsTotal: socialAnswers.length,
        };
    }

    private getEconomicLabel(percentage: number): string {
        if (percentage < 33) return 'Ляво';
        if (percentage < 67) return 'Център';
        return 'Дясно';
    }

    private getSocialLabel(percentage: number): string {
        if (percentage < 33) return 'Консервативно';
        if (percentage < 67) return 'Умерено';
        return 'Прогресивно';
    }

    resetAnswers(): void {
        this.answersSubject.next([]);
    }
}
