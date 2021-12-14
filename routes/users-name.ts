import { Request, Response, Router } from 'express';

import UserModel from '../models/user';
import { validateUser } from './common/validators';

const usersNameRoute = (router: Router) => {
  router.get('/users/:username', async (req: Request, res: Response) => {
    try {
      // TODO: handle query params
      const foundUser = await UserModel.findOne({ username: req.params.username });
      if (foundUser === null || foundUser === undefined) {
        res.status(404).json({ message: 'User GET failed - no user found', data: { username: req.params.username } });
        return;
      }

      res.status(200).json({ message: 'User GET successful!', data: foundUser });
    } catch (error) {
      res.status(500).json({ message: 'User GET failed - something went wrong on the server', data: error });
    }
  });

  router.put('/users/:username', async (req: Request, res: Response) => {
    try {
      const foundUser = await UserModel.findOne({ username: req.params.username });
      if (foundUser === null || foundUser === undefined) {
        res.status(404).json({ message: 'User PUT failed - no user found', data: { username: req.params.username } });
        return;
      }

      let [validationError, errors] = await validateUser(req.body, false);

      // make sure URL and body agree on which user is being modified
      if ('username' in errors === false) {
        if (req.params.username !== req.body.username) {
          validationError = true;
          errors.username = 'parameter username and body username must agree';
        }
      }

      // can change email so long as no OTHER user currently has that email
      if ('email' in errors === false) {
        const userWithEmail = await UserModel.findOne({ email: req.body.email });
        if (userWithEmail !== null && userWithEmail !== undefined && userWithEmail.username !== req.params.username) {
          validationError = true;
          errors.email = `${req.body.email} is already used by another user, please use a unique username`;
        }
      }

      if (validationError) {
        res.status(400).json({ message: 'User PUT failed - validation error', errors: errors });
        return;
      }

      const updatedUser = await UserModel.findOneAndReplace({ username: req.params.username }, req.body, { returnDocument: 'after' });

      res.status(200).json({ message: 'User PUT successful!', data: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'User PUT failed - something went wrong on the server', data: error });
    }
  });

  router.delete('/users/:username', async (req: Request, res: Response) => {
    try {
      const foundUser = await UserModel.findOne({ username: req.params.username });
      if (foundUser === null || foundUser === undefined) {
        res.status(404).json({ message: 'User DELETE failed - no user found', data: { username: req.params.username } });
        return;
      }

      // TODO: determine behavior on a user delete
      // Remove owner? Delete recipe?

      const removedUser = await UserModel.findOneAndRemove({ username: req.params.username });

      res.status(200).json({ message: 'User DELETE successful!', data: removedUser });
    } catch (error) {
      res.status(500).json({ message: 'User DELETE failed - something went wrong on the server', data: error });
    }
  });

  return router;
};

export default usersNameRoute;
