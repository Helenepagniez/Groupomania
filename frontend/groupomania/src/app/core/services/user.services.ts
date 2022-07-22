import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { User } from "../models/user.model";

@Injectable({providedIn: 'root'})
export class UserService {
    private apiServerUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) {}

    public getUsers(): Observable<User[]> {
        return this.http.get<any>(`${this.apiServerUrl}/api/user`,{
            withCredentials: true,
          });
    };

    public addUser(user: User): Observable<User> {
        return this.http.post<User>(`${this.apiServerUrl}/api/user/register`, user,{
            withCredentials: true,
          });
    };

    public updateUser(user: User, userId: string): Observable<User> {
        return this.http.put<User>(`${this.apiServerUrl}/api/user/${userId}`, user,{
            withCredentials: true,
          });
    };

    public deleteUser(userId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiServerUrl}/api/user/${userId}`,{
            withCredentials: true,
          });
    };

    public loginUser(user: User): Observable<User> {
        return this.http.post<User>(`${this.apiServerUrl}/api/user/login`, user,{
            withCredentials: true,
          });
    };

    public logoutUser(user: User): Observable<User> {
        return this.http.get<any>(`${this.apiServerUrl}/api/user/logout`,{
            withCredentials: true,
          });
    };

    public followUser(IdFollower: string, IdToFollow: string): Observable<User> {
        return this.http.patch<User>(`${this.apiServerUrl}/api/user/follow/${IdFollower}`, {"idToFollow":IdToFollow},{
            withCredentials: true,
          });
    };

    public unfollowUser(IdUnfollower: string, IdToUnfollow: string): Observable<User> {
        return this.http.patch<User>(`${this.apiServerUrl}/api/user/unfollow/${IdUnfollower}`, {"idToUnfollow":IdToUnfollow},{
            withCredentials: true,
          })
    };
}