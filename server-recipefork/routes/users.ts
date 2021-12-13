import { Request, Response, Router } from 'express';

import UserModel from '../models/user';

const usersRoute = (router: Router) => {
  router.get('/users', async (req: Request, res: Response) => {
    try {
      const users = await UserModel.find();
      res.status(200).json({ message: 'Users query successful', data: users });
    } catch (error) {
      res.status(500).json({ message: 'Users query failed - something went wrong on the server', data: error });
    }
  });

  router.post('/users', async (req: Request, res: Response) => {
    try {
      let validationError: boolean = false;
      const errorMessages: Record<string, string> = {};

      if ('username' in req.body === false) {
        // enforce username requirement
        validationError = true;
        errorMessages.username = 'username is a required field';
      } else if (typeof req.body.username !== 'string') {
        // enforce username is a string
        validationError = true;
        errorMessages.username = 'username should be a string field';
      } else {
        // enforce uniqueness on username
        const userWithUsername = await UserModel.findOne({ username: req.body.username });
        if (userWithUsername !== null && userWithUsername !== undefined) {
          validationError = true;
          errorMessages.username = `${req.body.username} is already used by another user, please use a unique username`;
        }
      }

      if ('email' in req.body === false) {
        // enforce email requirement
        validationError = true;
        errorMessages.email = 'email is a required field';
      } else if (typeof req.body.email !== 'string') {
        // enforce email is a string
        validationError = true;
        errorMessages.email = 'email should be a string field';
      } else {
        // enforce uniqueness on email
        const userWithEmail = await UserModel.findOne({ email: req.body.email });
        if (userWithEmail !== null && userWithEmail !== undefined) {
          validationError = true;
          errorMessages.email = `${req.body.email} is already used by another user, please use a unique email`;
        }
      }

      // enforce profilePic is a string or null
      if ('profilePic' in req.body === true && req.body.profilePic !== null && typeof req.body.profilePic !== 'string') {
        validationError = true;
        errorMessages.profilePic = 'profilePic should be a string field or null';
      } // TODO: image exists?

      // enforce recipes is a string array
      if ('recipes' in req.body === true && (!(Array.isArray(req.body.recipes)) || req.body.recipes.some((item: any) => typeof item !== 'string'))) {
        validationError = true;
        errorMessages.recipes = 'recipes should be a string array field';
      } // TODO: enforce all recipes exist, user owns the recipes in the list

      // enforce pinnedRecipes is a string array
      if ('pinnedRecipes' in req.body === true && (!(Array.isArray(req.body.pinnedRecipes)) || req.body.pinnedRecipes.some((item: any) => typeof item !== 'string'))) {
        validationError = true;
        errorMessages.pinnedRecipes = 'pinnedRecipes should be a string array field';
      } else if (req.body.length > 6) {
        // enforce pinnedRecipes has 6 or less entries
        validationError = true;
        errorMessages.pinnedRecipes = 'pinnedRecipes can only have 6 entries at max';
      } // TODO: enforce all recipes exist

      if (validationError) {
        res.status(400).json({ message: 'User creation failed - validation error', errors: errorMessages });
        return;
      }

      const createdUser = await UserModel.create(req.body);
      res.status(201).json({ message: 'User created!', data: createdUser });
    } catch (error) {
      res.status(500).json({ message: 'User post failed - something went wrong on the server', data: error });
    }
  });

  return router;
};

export default usersRoute;
