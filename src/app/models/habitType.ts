export interface HabitRequestInterface {
    name: string;
       
}

export interface HabitInterface {
    id: number;
    name: string;
    user: number;
    completed_today: boolean


}

export interface Log {
    habit: number;
    date: string;

}


export interface MonthlyCalendarData {
    total_completion_percentage: 50.0
}



export interface LogsGrid {
    date: string;
    day: number;
    total_completed: number;
    total_active_habits: number;
    percentage: number;
}