export interface Question {
    id: number;
    text: string;
    order: number
}


export interface JournalTemplate {
    id: number;
    name: string;
    is_public: boolean;
    questions: Question[];
    is_default: boolean;

}


export interface CreateJournalTemplate {
  name: string;
  questions: CreateQuestion[];
  is_public?: boolean;  
  
}


export interface CreateQuestion {
  text: string;
  order: number;
}


export interface JournalResponse {
    id?: number;
    question: number;
    question_text?: string;
    answer: string;
}


export interface JournalInterface {
    id: number;
    template_used: number | null;
    date: string;
    responses: JournalResponse[];

}


export interface CreateJournal {
  template_used: number | null;
  date: string; 
  responses: CreateJournalResponse[];
}


export interface CreateJournalResponse {
  question: number; 
  answer: string;
}


