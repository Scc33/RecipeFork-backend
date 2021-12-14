import { Request, Response, Router } from 'express';
import { isValidObjectId } from 'mongoose';

import queryParams from './common/query-params';
import RecipeModel from '../models/recipe';
import UserModel from '../models/user';
import { validateUser } from './common/validators';

const usersIdRoute = (router: Router) => {
  router.get('/users/:id', async (req: Request, res: Response) => {
    try {
      if (req.params === undefined || req.params === null || req.params.id === undefined || req.params.id === null) {
        res.status(400).json({ message: 'User GET failed - no object id provided', data: { _id: req.params.id } });
      }

      if (isValidObjectId(req.params.id) === false) {
        res.status(400).json({ message: 'User GET failed - invalid object id', data: { _id: req.params.id } })
        return;
      }

      const foundUser = await queryParams(UserModel.findById(req.params.id), req.query);
      if (foundUser === null || foundUser === undefined) {
        res.status(404).json({ message: 'User GET failed - no user found', data: { _id: req.params.id } });
        return;
      }

      res.status(200).json({ message: 'User GET successful!', data: foundUser });
    } catch (error) {
      res.status(500).json({ message: 'User GET failed - something went wrong on the server', data: error });
    }
  });

  router.put('/users/:id', async (req: Request, res: Response) => {
    try {
      if (req.params === undefined || req.params === null || req.params.id === undefined || req.params.id === null) {
        res.status(400).json({ message: 'User PUT failed - no object id provided', data: { _id: req.params.id } });
        return;
      }

      if (isValidObjectId(req.params.id) === false) {
        res.status(400).json({ message: 'User PUT failed - invalid object id', data: { _id: req.params.id } })
        return;
      }

      const foundUser = await UserModel.findById(req.params.id);
      if (foundUser === null || foundUser === undefined) {
        res.status(404).json({ message: 'User PUT failed - no user found', data: { _id: req.params.id } });
        return;
      }

      if ('_id' in req.body === false) {
        res.status(400).json({ message: 'User PUT failed - no object id provided in body (_id)' });
        return;
      } else if (req.params.id !== req.body._id) {
        res.status(400).json({ message: 'User PUT failed - parameter id and body _id must agree', data: { param_id: req.params.id, _id: req.body._id } });
        return;
      }

      /* eslint-disable-next-line prefer-const */
      let [validationError, errors] = await validateUser(req.body, false);

      // can change username so long as no OTHER user currently has that username
      if ('username' in errors === false) {
        const userWithUsername = await UserModel.findOne({ username: req.body.username });
        if (userWithUsername !== null
          && userWithUsername !== undefined
          && String(userWithUsername._id) !== req.params.id) {
          validationError = true;
          errors.username = `${req.body.username} is already used by another user, please use a unique username`;
        }
      }

      // can change email so long as no OTHER user currently has that email
      if ('email' in errors === false) {
        const userWithEmail = await UserModel.findOne({ email: req.body.email });
        if (userWithEmail !== null
          && userWithEmail !== undefined
          && String(userWithEmail._id) !== req.params.id) {
          validationError = true;
          errors.email = `${req.body.email} is already used by another user, please use a unique email`;
        }
      }

      if (validationError) {
        res.status(400).json({ message: 'User PUT failed - validation error', errors });
        return;
      }

      const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });

      res.status(200).json({ message: 'User PUT successful!', data: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'User PUT failed - something went wrong on the server', data: error });
    }
  });

  router.delete('/users/:id', async (req: Request, res: Response) => {
    try {
      if (req.params === undefined || req.params === null || req.params.id === undefined || req.params.id === null) {
        res.status(400).json({ message: 'User DELETE failed - no object id provided', data: { _id: req.params.id } });
      }

      if (isValidObjectId(req.params.id) === false) {
        res.status(400).json({ message: 'User DELETE failed - invalid object id', data: { _id: req.params.id } })
        return;
      }

      const foundUser = await UserModel.findById(req.params.id);
      if (foundUser === null || foundUser === undefined) {
        res.status(404).json({ message: 'User DELETE failed - no user found', data: { username: req.params.username } });
        return;
      }

      const removedUser = await UserModel.findByIdAndRemove(req.params.id);

      res.status(200).json({ message: 'User DELETE successful!', data: removedUser });

      // wipe author from recipes, leave around in case of forks
      await RecipeModel.updateMany({ 'userId': removedUser._id }, { 'userId': null });
    } catch (error) {
      res.status(500).json({ message: 'User DELETE failed - something went wrong on the server', data: error });
    }
  });

  return router;
};

export default usersIdRoute;
