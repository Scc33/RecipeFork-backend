/* eslint-disable no-underscore-dangle */
import { Request, Response, Router } from 'express';
import { isValidObjectId } from 'mongoose';

import queryParams from './common/query-params';
import ImageModel from '../models/image';
import RecipeModel from '../models/recipe';
import UserModel from '../models/user';
import { validateImage } from './common/validators';

const imagesIdRoute = (router: Router) => {
  router.get('/images/:id', async (req: Request, res: Response) => {
    try {
      if (req.params === undefined || req.params === null
        || req.params.id === undefined || req.params.id === null) {
        res.status(400).json({ message: 'Image GET failed - no object id provided', data: { _id: req.params.id } });
        return;
      }

      if (isValidObjectId(req.params.id) === false) {
        res.status(400).json({ message: 'Image GET failed - invalid object id', data: { _id: req.params.id } });
        return;
      }

      const foundImage = await queryParams(ImageModel.findById(req.params.id), req.query);
      if (foundImage === null || foundImage === undefined) {
        res.status(404).json({ message: 'Image GET failed - no user found', data: { _id: req.params.id } });
        return;
      }

      res.status(200).json({ message: 'Image GET successful!', data: foundImage });
    } catch (error) {
      res.status(500).json({ message: 'Image GET failed - something went wrong on the server', data: error });
    }
  });

  router.put('/images/:id', async (req: Request, res: Response) => {
    try {
      if (req.params === undefined || req.params === null
        || req.params.id === undefined || req.params.id === null) {
        res.status(400).json({ message: 'Image PUT failed - no object id provided', data: { _id: req.params.id } });
        return;
      }

      if (isValidObjectId(req.params.id) === false) {
        res.status(400).json({ message: 'Image PUT failed - invalid object id', data: { _id: req.params.id } });
        return;
      }

      const foundImage = await ImageModel.findById(req.params.id);
      if (foundImage === null || foundImage === undefined) {
        res.status(404).json({ message: 'Image PUT failed - no user found', data: { _id: req.params.id } });
        return;
      }

      if ('_id' in req.body === false) {
        res.status(400).json({ message: 'Image PUT failed - no object id provided in body (_id)' });
        return;
      } if (req.params.id !== req.body._id) {
        res.status(400).json({ message: 'Image PUT failed - parameter id and body _id must agree', data: { param_id: req.params.id, _id: req.body._id } });
        return;
      }

      /* eslint-disable-next-line prefer-const */
      let [validationError, errors] = await validateImage(req.body);

      if (validationError) {
        res.status(400).json({ message: 'Image PUT failed - validation error', errors });
        return;
      }

      const updatedImage = await ImageModel.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });

      res.status(200).json({ message: 'Image PUT successful!', data: updatedImage });
    } catch (error) {
      res.status(500).json({ message: 'Image PUT failed - something went wrong on the server', data: error });
    }
  });

  router.delete('/images/:id', async (req: Request, res: Response) => {
    try {
      if (req.params === undefined || req.params === null
        || req.params.id === undefined || req.params.id === null) {
        res.status(400).json({ message: 'Image DELETE failed - no object id provided', data: { _id: req.params.id } });
        return;
      }

      if (isValidObjectId(req.params.id) === false) {
        res.status(400).json({ message: 'Image DELETE failed - invalid object id', data: { _id: req.params.id } });
        return;
      }

      const foundImage = await ImageModel.findById(req.params.id);
      if (foundImage === null || foundImage === undefined) {
        res.status(404).json({ message: 'Image DELETE failed - no user found', data: { username: req.params.username } });
        return;
      }

      const removedImage = await ImageModel.findByIdAndRemove(req.params.id);

      res.status(200).json({ message: 'Image DELETE successful!', data: removedImage });

      // wipe image from user/recipe
      await UserModel.updateMany({ profilePic: removedImage._id }, { profilePic: null });
      await RecipeModel.updateMany({ image: removedImage._id }, { image: null });
    } catch (error) {
      res.status(500).json({ message: 'Image DELETE failed - something went wrong on the server', data: error });
    }
  });

  return router;
};

export default imagesIdRoute;
