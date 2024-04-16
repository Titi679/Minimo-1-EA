import * as mongoose from 'mongoose';

export interface Follower {
    _id?: string; // Optional _id field
    first_name:string;
    middle_name:string;
    last_name:string;
    followed: string; // Reference to the User collection
    follow_date: Date;
    deactivated:boolean;
}