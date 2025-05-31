import { Router } from 'express';
import {
  showWinners,
  showWinnerById,
  addWinner,
  updateWinner,
  deleteWinner
} from '../controllers/winners.controller.js';

const router = Router();
const apiName = '/winners';

router.route(apiName)
  .get(showWinners)
  .post(addWinner);

router.route(`${apiName}/:id`)
  .get(showWinnerById)
  .put(updateWinner)
  .delete(deleteWinner);

export default router;