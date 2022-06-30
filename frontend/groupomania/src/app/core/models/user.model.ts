export interface User {
    _id: string;
    name: string;
    firstname: string;
    picture: string;
    job: string;
    email: string;
    password: string;
    role: string;
    follower: string|null;
    following: string|null;
}