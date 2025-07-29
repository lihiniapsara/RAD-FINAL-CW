export interface User {
    _id: string;
    name: string;
    email: string;
    accessToken?: string; // Optional, included in login response
}