/* Author: Valery Escobar
Date: 07/04/2025 */

import { Router } from 'express';
import {
  showMatches,
  showMatchId,
  addMatch,
  updateMatch,
  deleteMatch
} from '../controllers/matches.controller.js';

const router = Router();
const apiName = '/matches';

router.route(apiName)
  .get(showMatches)
  .post(addMatch);

router.route(`${apiName}/:id`)
  .get(showMatchId)
  .put(updateMatch)
  .delete(deleteMatch);

export default router;
