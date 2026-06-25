import { Router } from 'express';
import { getHomePageData } from '../controllers/home.controller';

export const homeRouter = Router();

homeRouter.get('/', getHomePageData);
