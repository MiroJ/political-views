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
                socialScore: -1,
                socialPercentage: 0,
                socialLabel: 'Няма отговори',
                totalEconomicQuestions: 0,
                totalSocialQuestions: 0
            };
        }

        const answers = this.answersSubject.value;

        const economicSection = 'Икономическа ос (Ляво ↔ Дясно)';
        const socialSection = 'Социално-културна ос (Прогресивно ↔ Консервативно)';

        const economicAnswers = answers.filter(a => a.section === economicSection);
        const socialAnswers = answers.filter(a => a.section === socialSection);

        const economicScore = economicAnswers.reduce((sum, a) => sum + a.points, 0);
        const socialScore = socialAnswers.reduce((sum, a) => sum + a.points, 0);

        const economicMax = economicAnswers.length * 2; // questions * 2 max points
        const socialMax = socialAnswers.length * 2; // questions * 2 max points

        const economicPercentage = (economicScore / economicMax) * 100;
        const socialPercentage = (socialScore / socialMax) * 100;

        return {
            economicScore,
            economicPercentage,
            economicLabel: this.getEconomicLabel(economicPercentage),
            socialScore,
            socialPercentage,
            socialLabel: this.getSocialLabel(socialPercentage),
            totalEconomicQuestions: economicAnswers.length,
            totalSocialQuestions: socialAnswers.length,
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
