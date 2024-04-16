import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Follower } from '../../models/follower';
import { FollowerService } from '../../services/follower.service';
import { AuthService } from '../../services/auth.service';
import { scheduled } from 'rxjs';
import mongoose from 'mongoose';

@Component({
  selector: 'app-follower',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,],
  templateUrl: './follower.component.html',
  styleUrl: './follower.component.css'
})
export class FollowerComponent {
  followers: Follower[] = [];
  showForm: boolean = false;
  newFollower: Follower = { first_name: '', middle_name: '', last_name: '', follow_date: new Date(),  followed: '', deactivated: false };



  constructor(private followerService: FollowerService, private AuthService: AuthService) { }

  ngOnInit(): void {
    this.getFollowers();
  }

  getFollowers() {
    this.followerService.getFollowers().subscribe(
      (data: Follower[]) => {
        this.followers = data;
      },
      (error) => {
        console.error('Error fetching followers:', error);
      }
    );
  }
  showAddFollowerForm() {
    this.showForm = true;
  }

  addFollower() {
    this.newFollower.followed = this.AuthService.getCurrentUserId(); 
    this.followerService.createFollower(this.newFollower).subscribe(
      (data: Follower) => {
        console.log('Follower added successfully:', data);
        this.getFollowers(); // Refresh the list of followers after adding a new one
        this.resetForm();
      },
      (error) => {
        console.error('Error adding follower:', error);
      }
    );
  }

  resetForm() {
    this.newFollower = { first_name: '', middle_name: '', last_name: '', follow_date: new Date(), followed: '', deactivated: false };
    this.showForm = false;
  }

  deleteFollower(followerId: string) {
    this.followerService.deleteFollower(followerId).subscribe(
      () => {
        console.log('Follower deleted successfully');
        this.getFollowers(); // Actualiza la lista de seguidores después de eliminar uno
      },
      (error) => {
        console.error('Error deleting follower:', error);
      }
    )
  }
}
