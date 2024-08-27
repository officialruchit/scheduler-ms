import { Router } from 'express';
import { activateSales } from '../controller/activeSales';
import { deactivateSales } from '../controller/deactiveSales';
const routes = Router();

routes.patch('/activateSales', activateSales);
routes.patch('/deactivateSales', deactivateSales);
export default routes;
