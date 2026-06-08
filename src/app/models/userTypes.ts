export interface LoginRequestInterface {
    login_id: string;
    password: string;
}



export interface UserProfileInterface {
    id: number;
    username: string;
    email: string;
    profile_image: string | null;
    cover_image: string | null;
    
}


export interface RegisterRequestInterface {
    username: string;
    email: string;
    password: string;
    profile_image?: File | null;
}


export interface LoginResponse {
    access: string
}

