import { Request, Response, Router } from 'express';

const Recipe = require('../models/recipe');

const recipesRoute = (router: Router) => {
  router.get('/recipes', async (req, res) => {
    try {
      let where = {};
      if (req.query.where !== undefined) {
        where = JSON.parse((req.query as any).where);
      }
      let sort = {};
      if (req.query.sort !== undefined) {
        sort = JSON.parse((req.query as any).sort);
      }
      let select = {};
      if (req.query.select !== undefined) {
        select = JSON.parse((req.query as any).select);
      }
      let skip = 0;
      if (req.query.skip !== undefined) {
        skip = parseInt((req.query as any).skip, 10);
      }
      let limit = 0;
      if (req.query.limit !== undefined) {
        limit = parseInt((req.query as any).limit, 10);
      }
      await Recipe.find(where).select(select).skip(skip).limit(limit)
        .sort(sort)
        .then((data) => {
          if (Object.keys(data).length === 0) {
            return res.status(404).json({
              message: 'ERROR: QUERY RETURNED NO DATA',
              data,
            });
          }
          return res.status(200).json({
            message: 'OK',
            data,
          });
        });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  });

  router.post('/recipes', async (req: Request, res: Response) => {
    try {
      const newRecipe = await new Recipe(req.body);
      newRecipe.save((error) => {
        if (error) {
          res.status(500).json({
            message: error,
          });
        } else {
          res.status(201).json({
            message: 'Ok',
            data: newRecipe,
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  });

  router.put('/recipes/:id', async (req: Request, res: Response) => {
    try {
      const result = await Recipe.findByIdAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true },
      ).exec();
      if (result) {
        res.status(200).json({
          message: 'Ok',
          data: result,
        });
      } else {
        res.status(404).json({
          message: 'Error that task cannot be found',
          data: '',
        });
      }
    } catch (err) {
      res.status(500).json({
        message: 'Error, that is something unknown',
        data: err,
      });
    }
  });

  router.delete('/recipes/:id', async (req: Request, res: Response) => {
    try {
      const result = await Recipe.deleteOne({ _id: req.params.id });
      if (result.deletedCount === 0) {
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
    } catch (error) {
      res.status(500).json({
        message: 'SERVER SIDE ERROR',
      });
    }
  });

  return router;
};

export default recipesRoute;
