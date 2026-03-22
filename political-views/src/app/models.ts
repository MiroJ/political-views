export interface Answer {
    option: string;
    points: number;
}

export interface Question {
    section: string;
    questionNumber: number;
    questionText: string;
    answers: Answer[];
}

export interface UserAnswer {
    questionNumber: number;
    section: string;
    points: number;
}

export interface Result {
    economicScore: number;
    economicPercentage: number;
    economicLabel: string;
    socialScore: number;
    socialPercentage: number;
    socialLabel: string;
    totalEconomicQuestions: number;
    totalSocialQuestions: number;
}
