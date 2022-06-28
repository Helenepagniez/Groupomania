export class Post {
    _id: any;
    picture!: string | null;
    video!: string | null;
    likers!: string[] | null;
    posterId!: string;
    message!: string | null;
}