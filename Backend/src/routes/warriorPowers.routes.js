/* Author: Valery Escobar
Date: 07/04/2025 */

import { Router } from 'express';
import {
  showWarriorPowers,
  showWarriorPowersId,
  addWarriorPowers,
  updateWarriorPowers,
  deleteWarriorPowers
} from '../controllers/warriorPowers.controller.js';

const router = Router();
const apiName = '/warriorPowers';

router.route(apiName)
  .get(showWarriorPowers)
  .post(addWarriorPowers);

router.route(`${apiName}/:id`)
  .get(showWarriorPowersId)
  .put(updateWarriorPowers)
  .delete(deleteWarriorPowers);

export default router;