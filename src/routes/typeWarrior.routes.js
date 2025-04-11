/* Author: Valery Escobar
Date: 07/04/2025 */

import { Router } from 'express';
import {
  getTypeWarriors,
  getTypeWarriorId,
  addTypeWarrior,
  updateTypeWarrior,
  deleteTypeWarrior
} from '../controllers/typeWarrior.controller.js';

const router = Router();
const apiName = '/typeWarrior';

router.route(apiName)
  .get(getTypeWarriors)
  .post(addTypeWarrior);

router.route(`${apiName}/:id`)
  .get(getTypeWarriorId)
  .put(updateTypeWarrior)
  .delete(deleteTypeWarrior);

export default router;