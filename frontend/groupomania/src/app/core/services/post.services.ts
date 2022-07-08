import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Post } from "../models/post.model";
import { Comment } from '../models/comment.model';

@Injectable({providedIn: 'root'})
export class PostService {
    private apiServerUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) {}

    public getPosts(): Observable<Post[]> {
        return this.http.get<any>(`${this.apiServerUrl}/api/post`);
    };

    public addPost(post: Post): Observable<Post> {
        return this.http.post<Post>(`${this.apiServerUrl}/api/post`, post);
    };

    public updatePost(postId: number, post: Post): Observable<Post> {
        return this.http.put<Post>(`${this.apiServerUrl}/api/post/${postId}`, post);
    };

    public deletePost(postId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiServerUrl}/api/post/${postId}`);
    };

    public likePost(postId: string, userId: string): Observable<Post> {
        return this.http.patch<Post>(`${this.apiServerUrl}/api/post/like-post/${postId}`, {"id":userId});
    };

    public unlikePost(postId: string, userId: string): Observable<Post> {
        return this.http.patch<Post>(`${this.apiServerUrl}/api/post/unlike-post/${postId}`, {"id":userId});
    };
    
    public addCommentPost(postId: string, comment: Comment): Observable<Post> {
        return this.http.patch<Post>(`${this.apiServerUrl}/api/post/comment-post/${postId}`, comment);
    };

    public editCommentPost(postId: string, comment: Comment): Observable<Post> {
        return this.http.patch<Post>(`${this.apiServerUrl}/api/post/edit-comment-post/${postId}`, comment);
    };

    public deleteCommentPost(postId: string, commentId: any): Observable<Post> {
        return this.http.patch<Post>(`${this.apiServerUrl}/api/post/delete-comment-post/${postId}`, {"commentId":commentId});
    };
}