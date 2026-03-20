import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Question, UserAnswer, Result } from './models';

@Injectable({
    providedIn: 'root',
})
export class QuestionService {
    private answersSubject = new BehaviorSubject<UserAnswer[]>([]);
    public answers$ = this.answersSubject.asObservable();

    constructor(private http: HttpClient) { }

    getQuestions(): Observable<Question[]> {
        return this.http.get<Question[]>('/questions.json');
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
        const answers = this.answersSubject.value;

        const economicSection = 'Икономическа ос (Ляво ↔ Дясно)';
        const socialSection = 'Социално-културна ос (Прогресивно ↔ Консервативно)';

        const economicAnswers = answers.filter(a => a.section === economicSection);
        const socialAnswers = answers.filter(a => a.section === socialSection);

        const economicScore = economicAnswers.reduce((sum, a) => sum + a.points, 0);
        const socialScore = socialAnswers.reduce((sum, a) => sum + a.points, 0);

        const economicMax = 20; // 10 questions * 2 max points
        const socialMax = 20; // 10 questions * 2 max points

        const economicPercentage = (economicScore / economicMax) * 100;
        const socialPercentage = (socialScore / socialMax) * 100;

        return {
            economicScore,
            economicPercentage,
            economicLabel: this.getEconomicLabel(economicPercentage),
            socialScore,
            socialPercentage,
            socialLabel: this.getSocialLabel(socialPercentage)
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
