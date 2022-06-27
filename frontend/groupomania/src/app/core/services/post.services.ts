import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Post } from "../models/post.model";

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

    public updatePost(post: Post, postId: number): Observable<Post> {
        return this.http.put<Post>(`${this.apiServerUrl}/api/post/${postId}`, post);
    };

    public deletePost(postId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiServerUrl}/api/post/${postId}`);
    };

    /*
    public likePost(postId: number): Observable<void> {
        return this.http.patch<void>(`${this.apiServerUrl}/api/post/like-post/${postId}`);
    };

    public unlikePost(postId: number): Observable<void> {
        return this.http.patch<void>(`${this.apiServerUrl}/api/post/unlike-post/${postId}`);
    };
    */
}