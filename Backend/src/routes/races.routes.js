/* Author: Valery Escobar
Date: 07/04/2025 */

import { Router } from 'express';
import {
  getRaces,
  getRaceId,
  addRace,
  updateRace,
  deleteRace
} from '../controllers/races.controller.js';

const router = Router();
const apiName = '/races';

router.route(apiName)
  .get(getRaces)
  .post(addRace);

router.route(`${apiName}/:id`)
  .get(getRaceId)
  .put(updateRace)
  .delete(deleteRace);

export default router;
