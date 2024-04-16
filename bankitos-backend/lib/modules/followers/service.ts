import { IFollower } from './model';
import followers from './schema';
import { FilterQuery } from 'mongoose';

export default class FollowerService {
    
    public async createFollower(post_params: IFollower): Promise<IFollower> {
        try {
            const session = new followers(post_params);
            return await session.save();
        } catch (error) {
            throw error;
        }
    }

    public async filterOneFollower(query: any): Promise<IFollower | null> {
        try {
            return await followers.findOne(query);
        } catch (error) {
            throw error;
        }
    }

    public async filterFollowers (query: any, page: number, pageSize: number): Promise<IFollower[] | null> {
        try {
            const skipCount = (page - 1) * pageSize;
            const updatedQuery = { ...query, follower_deactivated: { $ne: true } };
            return await followers.find(updatedQuery).skip(skipCount).limit(pageSize);
        } catch (error) {
            throw error;
        }
    }
    
    public async filterFollowersEvenDeactivated(query: any, page: number, pageSize: number): Promise<IFollower[] | null> {
        try {
            const skipCount = (page - 1) * pageSize;
            const updatedQuery = { query };
            return await followers.find(updatedQuery).skip(skipCount).limit(pageSize);
        } catch (error) {
            throw error;
        }
    }

    public async updateFollower (place_params: IFollower): Promise<void> {
        try {
            const query = { _id: place_params._id };
            await followers.findOneAndUpdate(query, place_params);
        } catch (error) {
            throw error;
        }
    }

    public async deactivateFollower (place_paramsPartial: Partial<IFollower>, place_filter: FilterQuery<IFollower>): Promise<void> {
        try {
            await followers.findOneAndUpdate(place_filter, place_paramsPartial);
        } catch (error) {
            throw error;
        }
    }

}