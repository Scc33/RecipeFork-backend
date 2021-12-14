import { Request, Response, Router } from 'express';
import { isValidObjectId } from 'mongoose';

import queryParams from './common/query-params';
import RecipeModel from '../models/recipe';
import { validateRecipe } from './common/validators';

const recipe = require('../models/recipe');

const recipesIdRoute = (router: Router) => {
  router.get('/recipes/:id', async (req: Request, res: Response) => {
    try {
      if (req.params === undefined || req.params === null || req.params.id === undefined || req.params.id === null) {
        res.status(400).json({ message: 'Recipe GET failed - no object id provided', data: { _id: req.params.id } });
      }

      if (isValidObjectId(req.params.id) === false) {
        res.status(400).json({ message: 'Recipe GET failed - invalid object id', data: { _id: req.params.id } })
        return;
      }

      const foundRecipe = await queryParams(RecipeModel.findById(req.params.id), req.query);
      if (foundRecipe === null || foundRecipe === undefined) {
        res.status(404).json({ message: 'Recipe GET failed - no recipe found', data: { _id: req.params.id } });
        return;
      }

      res.status(200).json({ message: 'Recipe GET successful!', data: foundRecipe });
    } catch (error) {
      res.status(500).json({ message: 'Recipe GET failed - something went wrong on the server', data: error });
    }
  });

  router.put('/recipes/:id', async (req: Request, res: Response) => {
    try {
      if (req.params === undefined || req.params === null || req.params.id === undefined || req.params.id === null) {
        res.status(400).json({ message: 'Recipe PUT failed - no object id provided', data: { _id: req.params.id } });
      }

      if (isValidObjectId(req.params.id) === false) {
        res.status(400).json({ message: 'Recipe PUT failed - invalid object id', data: { _id: req.params.id } })
        return;
      }

      const foundRecipe = await queryParams(RecipeModel.findById(req.params.id), req.query);
      if (foundRecipe === null || foundRecipe === undefined) {
        res.status(404).json({ message: 'Recipe PUT failed - no recipe found', data: { _id: req.params.id } });
        return;
      }

      if ('_id' in req.body === false) {
        res.status(400).json({ message: 'Recipe PUT failed - no object id provided in body (_id)' });
        return;
      } else if (req.params.id !== req.body._id) {
        res.status(400).json({ message: 'Recipe PUT failed - parameter id and body _id must agree', data: { param_id: req.params.id, _id: req.body._id } });
        return;
      }

      // TODO: additional verification

      /* eslint-disable-next-line prefer-const */
      let [validationError, errors] = await validateRecipe(req.body, false);

      if (validationError) {
        res.status(400).json({ message: 'Recipes PUT failed - validation error', data: errors });
        return;
      }

      const updatedRecipe = await RecipeModel.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });

      res.status(200).json({ message: 'Recipe PUT successful!', data: updatedRecipe });
    } catch (error) {
      res.status(500).json({ message: 'Recipe PUT failed - something went wrong on the server', data: error });
    }
  });

  router.delete('/recipes/:id', async (req: Request, res: Response) => {
    try {
      if (req.params === undefined || req.params === null || req.params.id === undefined || req.params.id === null) {
        res.status(400).json({ message: 'Recipe DELETE failed - no object id provided', data: { _id: req.params.id } });
      }

      if (isValidObjectId(req.params.id) === false) {
        res.status(400).json({ message: 'Recipe DELETE failed - invalid object id', data: { _id: req.params.id } })
        return;
      }

      const foundRecipe = await queryParams(RecipeModel.findById(req.params.id), req.query);
      if (foundRecipe === null || foundRecipe === undefined) {
        res.status(404).json({ message: 'Recipe DELETE failed - no recipe found', data: { _id: req.params.id } });
        return;
      }

      const removedRecipe = await RecipeModel.findByIdAndRemove(req.params.id);

      res.status(200).json({ message: 'Recipe DELETE successful!', data: removedRecipe });

      // TODO: remove from user's that pinned the recipe
    } catch (error) {
      res.status(500).json({ message: 'Recipe DELETE failed - something went wrong on the server', data: error });
    }
  });

  return router;
};

export default recipesIdRoute;
