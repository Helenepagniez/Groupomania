export class User {
    _id: any;
    name!: string;
    firstname!: string;
    picture!: string|null;
    job!: string;
    email!: string;
    password!: string;
    role!: string;
    followers!: string[]|null; //id
    following!: string[]|null; //id to follow ou id to unfollow
}