import { Request, Response, Router } from 'express';

import queryParams from './common/query-params';
import RecipeModel from '../models/recipe';
import { validateRecipe } from './common/validators';

const recipesRoute = (router: Router) => {
  router.get('/recipes', async (req: Request, res: Response) => {
    try {
      const recipes = await queryParams(RecipeModel.find(), req.query);
      res.status(200).json({ message: 'Recipes GET successful', data: recipes });
    } catch (error) {
      res.status(500).json({ message: 'Recipes GET failed - something went wrong on the server', data: error });
    }
  });

  router.post('/recipes', async (req: Request, res: Response) => {
    try {
      const [validationError, errors] = await validateRecipe(req.body, true);

      if (validationError) {
        res.status(400).json({ message: 'Recipes POST failed - validation error', data: errors });
        return;
      }

      const createdRecipe = await RecipeModel.create(req.body);
      res.status(201).json({ message: 'Recipes POST successful', data: createdRecipe });
    } catch (error) {
      res.status(500).json({ message: 'Recipes POST failed - something went wrong on the server', data: error });
    }
  });

  return router;
};

export default recipesRoute;
