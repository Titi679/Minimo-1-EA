import * as mongoose from 'mongoose';

export interface IFollower {
    _id?: mongoose.Types.ObjectId;
    first_name:string;
    middle_name?:string;
    last_name:string;
    followed: mongoose.Types.ObjectId; // Reference to the User collection
    follow_date: Date;
    follower_deactivated:boolean;
}