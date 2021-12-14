import { Request, Response, Router } from 'express';

const recipe = require('../models/recipe');

const recipesNameRoute = (router: Router) => {
  router.get('/recipes/:id', async (req: Request, res: Response) => {
    try {
      const result = await recipe.findById({ _id: req.params.id }).exec();
      if (result === null) {
        res.status(404).json({
          message: 'Error that recipe cannot be found',
          data: '',
        });
      } else {
        res.status(200).json({
          message: 'Ok',
          data: result,
        });
      }
    } catch (err) {
      res.status(500).json({
        message: 'Error some backend issue',
        data: err,
      });
    }
  });

  return router;
};

export default recipesNameRoute;
