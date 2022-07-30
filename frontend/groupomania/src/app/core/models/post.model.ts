import { Comment } from '../models/comment.model';

export class Post {
    _id: any;
    picture!: string | null;
    video!: string | null;
    likers!: string[] | null;
    comments!: Comment[] | null;
    posterId!: string;
    message!: string | null;
    createdAt!: string| null;
    updatedAt!: string| null;
}