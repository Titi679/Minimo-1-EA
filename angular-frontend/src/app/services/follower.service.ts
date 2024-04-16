import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Follower } from '../models/follower';

@Injectable({
  providedIn: 'root'
})
export class FollowerService {

  token: string | null = null;

  constructor(private http:HttpClient, private authService:AuthService) { }

  url: string = "http://127.0.0.1:3000";
  
  getToken() {
    this.token = this.authService.getToken();
  }

  getHeaders() {
    this.getToken();
    let headers = new HttpHeaders();
    headers = headers.set('x-access-token', this.token || '');
    return headers;
  }

  createFollower(newFollower : Follower |undefined) {
    return this.http.post<Follower>(this.url+'/follower',newFollower,{ headers: this.getHeaders() });
  }

  getFollower(findFollower : string){
    return this.http.get<Follower>(this.url+'/follower/'+findFollower, { headers: this.getHeaders() });
  }

  getFollowers() {
    return this.http.get<Follower[]>(this.url+'/follower', { headers: this.getHeaders() });
  }
  
  getFollowersAdmin(){
    return this.http.get<Follower[]>(this.url+'/follower/admin', { headers: this.getHeaders() });
  }

  updateFollower(editFollower : Follower) {
    return this.http.put<Follower>(this.url+'/follower/'+ editFollower._id, editFollower, { headers: this.getHeaders() });
  }
  
  deleteFollower(deleteFollowerId : string) {
    return this.http.delete(this.url+'/follower/'+ deleteFollowerId, { headers: this.getHeaders() });
  }
}
