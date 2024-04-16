import { Application, Request, Response, NextFunction } from 'express';
import { FollowerController } from '../controllers/followerController';
import  {authJWT}  from '../middlewares/authJWT';


export class FollowerRoutes {

    private follower_controller: FollowerController = new FollowerController();
    private AuthJWT: authJWT = new authJWT();


    public route(app: Application) {
        
        // Post follower by ID 
        app.post('/follower', (req: Request, res: Response, next: NextFunction) => {
            this.AuthJWT.verifyToken(req, res, (err?: any) => {
                if (err) {
                    console.log("Error: " + err)
                    return next(err); // Short-circuit if token verification fails
                }
                this.follower_controller.create_follower(req, res);
                
            });
        });

        // Get follower by ID
        app.get('/follower/:id', (req: Request, res: Response, next: NextFunction) => {
            this.AuthJWT.verifyToken(req, res, (err?: any) => {
                if (err) {
                    return next(err); // Short-circuit if token verification fails
                }
                this.follower_controller.get_follower(req, res);
            });
        });

        // Get all followers
        app.get('/follower', (req: Request, res: Response, next: NextFunction) => {
            this.AuthJWT.verifyToken(req, res, (err?: any) => {
                if (err) {
                    return next(err); // Short-circuit if token verification fails
                }
                this.follower_controller.get_followers(req, res);
            });
        });

        // Update follower by ID
        app.put('/follower/:id', (req: Request, res: Response, next: NextFunction) => {
            this.AuthJWT.verifyToken(req, res, (err?: any) => {
                if (err) {
                    return next(err); // Short-circuit if token verification fails
                }
                this.AuthJWT.isOwner(req, res, (err?: any) => {
                    if (err) {
                        return next(err); // Short-circuit if isOwner check fails
                    }
                    this.follower_controller.update_follower(req, res);
                }, 'Follower');
            });
        });

        // Delete follower by ID
        app.delete('/follower/:id', (req: Request, res: Response, next: NextFunction) => {
            this.AuthJWT.verifyToken(req, res, (err?: any) => {
                if (err) {
                    return next(err); // Short-circuit if token verification fails
                }
                this.AuthJWT.isOwner(req, res, (err?: any) => {
                    if (err) {
                        return next(err); // Short-circuit if isOwner check fails
                    }
                    this.follower_controller.deactivate_follower(req, res);
                }, 'Follower');
            });
        });

    }
}