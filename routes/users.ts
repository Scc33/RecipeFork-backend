import { Request, Response, Router } from 'express';

import UserModel from '../models/user';
import validateUser from './common/validators';

const usersRoute = (router: Router) => {
  router.get('/users', async (req: Request, res: Response) => {
    try {
      // TODO: handle query params
      const users = await UserModel.find();
      res.status(200).json({ message: 'Users GET successful', data: users });
    } catch (error) {
      res.status(500).json({ message: 'Users GET failed - something went wrong on the server', data: error });
    }
  });

  router.post('/users', async (req: Request, res: Response) => {
    try {
      const [validationError, errors] = await validateUser(req.body, true);

      if (validationError) {
        res.status(400).json({ message: 'User POST failed - validation error', errors });
        return;
      }

      const createdUser = await UserModel.create(req.body);
      res.status(201).json({ message: 'User POST successful', data: createdUser });
    } catch (error) {
      res.status(500).json({ message: 'User POST failed - something went wrong on the server', data: error });
    }
  });

  return router;
};

export default usersRoute;
