import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
    first_name: {type:String,required:true},
    middle_name: {type:String,required:false},
    last_name: {type:String,required:true},
    followed: { type: Schema.Types.ObjectId, ref: 'users', required: true }, // Reference to the User model
    follow_date: {type:Date,required:true,default: new Date()},
    follower_deactivated: {type:Boolean,required:true,default:false},
    }
);

export default mongoose.model('followers', schema);
