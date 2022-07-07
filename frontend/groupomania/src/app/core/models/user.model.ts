export interface User {
    _id: string;
    name: string;
    firstname: string;
    picture: string;
    job: string;
    email: string;
    password: string;
    role: string;
    followers: string[]|null; //id
    following: string[]|null; //id to follow ou id to unfollow
}