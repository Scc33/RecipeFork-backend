import { Request, Response, Router } from 'express';

import ImageModel from '../models/image';
import queryParams from './common/query-params';
import { validateImage } from './common/validators';

const imagesRoute = (router: Router) => {
  router.get('/images', async (req: Request, res: Response) => {
    try {
      const images = await queryParams(ImageModel.find(), req.query);
      res.status(200).json({ message: 'Images GET successful', data: images });
    } catch (error) {
      res.status(500).json({ message: 'Images GET failed - something went wrong on the server', data: error });
    }
  });

  router.post('/images', async (req: Request, res: Response) => {
    try {
      const [validationError, errors] = await validateImage(req.body);

      if (validationError) {
        res.status(400).json({ message: 'Image POST failed - validation error', data: errors });
        return;
      }

      const createdUser = await ImageModel.create(req.body);
      res.status(201).json({ message: 'Image POST successful', data: createdUser });
    } catch (error) {
      res.status(500).json({ message: 'Image POST failed - something went wrong on the server', data: error });
    }
  });

  return router;
};

export default imagesRoute;
