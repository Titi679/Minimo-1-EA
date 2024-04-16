import { Request, Response } from 'express';
import { IFollower } from '../modules/followers/model';
import FollowerService from '../modules/followers/service';
import UserService from '../modules/users/service';
import * as mongoose from 'mongoose';

export class FollowerController {

  private follower_service: FollowerService = new FollowerService();
  private user_service: UserService = new UserService();

  public async create_follower(req: Request, res: Response) {
      try {
        console.log("create follower")
        console.log(req.body.first_name, req.body.middle_name, req.body.last_name, req.body.followed, req.body.follow_date)
        // this check whether all the fields were sent through the request or not
        if (
            req.body.first_name &&
            req.body.middle_name &&
            req.body.last_name &&
            req.body.followed &&
            req.body.follow_date
        ) {
        console.log("IFollower")
          const follower_params: IFollower = {
            first_name:req.body.first_name,
            middle_name:req.body.middle_name,
            last_name:req.body.last_name,
            followed: req.body.followed,
            follow_date: req.body.follow_date,
            follower_deactivated:false
          };
          console.log("Follower data")
          const follower_data = await this.follower_service.createFollower(follower_params);
          // Now, you may want to add the created post's ID to the user's array of posts
          console.log("follower data realizado")
          await this.user_service.addFollowerToUser(req.body.author, follower_data._id);
          console.log("añadido follower a user")
          return res.status(201).json(follower_data);
        } else {
            console.log("missing fields")
          return res.status(400).json({ error: 'Missing fields' });
        }
      } catch (error) {
        console.log("Error: "+error)
        return res.status(500).json({ error: 'Internal server error' });
      }
  }

  public async get_follower(req: Request, res: Response) {
      try{
          if (req.params.id) {
              const follower_filter = { _id: req.params.id };
              // Fetch user
              const follower_data = await this.follower_service.filterOneFollower(follower_filter);
              // Send success response
              return res.status(200).json(follower_data);
          } else {
              return res.status(400).json({ error: 'Missing fields' });
          }
      }catch(error){
          return res.status(500).json({ error: 'Internal server error' });
      }
  }
  
  public async get_followers(req: Request, res: Response) {
    try {
        // Extract pagination parameters from query string or use default values
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10;

        // Fetch users based on pagination parameters
        const follower_data = await this.follower_service.filterFollowers({}, page, pageSize);

        // Send success response
        return res.status(200).json(follower_data);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async get_followers_even_deactivated(req: Request, res: Response) {
      try {
          // Extract pagination parameters from query string or use default values
          const page = req.query.page ? parseInt(req.query.page as string) : 1;
          const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10;
  
          // Fetch users based on pagination parameters
          const follower_data = await this.follower_service.filterFollowersEvenDeactivated({}, page, pageSize);
  
          // Send success response
          return res.status(200).json(follower_data);
      } catch (error) {
          return res.status(500).json({ error: 'Internal server error' });
      }
  }
  
  public async update_follower(req: Request, res: Response) {
      try {
          if (req.params.id) {
              const follower_filter = { _id: req.params.id };
              // Fetch user
              const follower_data = await this.follower_service.filterOneFollower(follower_filter);
              if(follower_data.follower_deactivated===true){
                  return res.status(400).json({ error: 'Follower not found' });
              }

              const objectid = new mongoose.Types.ObjectId(req.params.id);

              // Check if emergency_contact exists in req.body and handle accordingly
              const follower_params: IFollower = {
                _id: objectid,
                first_name:req.body.first_name || follower_data.first_name,
                middle_name:req.body.middle_name || follower_data.middle_name,
                last_name:req.body.last_name || follower_data.last_name,
                followed: req.body.followed || follower_data.followed,
                follow_date: req.body.follow_date || follower_data.follow_date,
                follower_deactivated: follower_data.follower_deactivated
              };
              // Update user
              await this.follower_service.updateFollower(follower_params);
              //get new user data
              const new_follower_data = await this.follower_service.filterOneFollower(follower_filter);

              // Send success response
              return res.status(200).json(new_follower_data);
          } else {
              // Send error response if ID parameter is missing
              return res.status(400).json({ error: 'Missing ID parameter' });
          }
      } catch (error) {
          // Catch and handle any errors
          console.error("Error updating:", error);
          return res.status(500).json({ error: 'Internal server error' });
      }
  }

  public async deactivate_follower(req: Request, res: Response) {
      try {
          if (req.params.id) {
              const follower_filter = { _id: req.params.id };
              // Fetch user
              const follower_data = await this.follower_service.filterOneFollower(follower_filter);
              if(follower_data.follower_deactivated===true){
                  return res.status(400).json({ error: 'Follower not found' });
              }
              // Create a partial user object with only the user_deactivated field updated
          const follower_paramsPartial: Partial<IFollower> = {
            follower_deactivated: true,
          };

          // Update user
          await this.follower_service.deactivateFollower(follower_paramsPartial, follower_filter);

          const new_follower_data = await this.follower_service.filterOneFollower(follower_filter);
          // Send success response
          if (new_follower_data.follower_deactivated === true) {
              return res.status(200).json({ message: 'Follower Deleted' });
          }
      } else {
          // Send error response if ID parameter is missing
          return res.status(400).json({ error: 'Missing ID parameter' });
      }
  } catch (error) {
      // Catch and handle any errors
      console.error("Error updating:", error);
      return res.status(500).json({ error: 'Internal server error' });
  }
}
     
}