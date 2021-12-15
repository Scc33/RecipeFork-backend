import { Application, Router } from 'express';

import imagesRoute from './images';
import imagesIdRoute from './images-id';
import recipesRoute from './recipes';
import recipesIdRoute from './recipes-id';
import usersRoute from './users';
import usersIdRoute from './users-id';

const registerRoutes = (server: Application, router: Router) => {
  server.use('/api', imagesRoute(router));
  server.use('/api', imagesIdRoute(router));
  server.use('/api', recipesRoute(router));
  server.use('/api', recipesIdRoute(router));
  server.use('/api', usersRoute(router));
  server.use('/api', usersIdRoute(router));
};

export default registerRoutes;
