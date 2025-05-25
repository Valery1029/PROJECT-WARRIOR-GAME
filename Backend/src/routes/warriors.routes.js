/* Author: Valery Escobar
Date: 07/04/2025 */

import { Router } from 'express';
import { showWarriors, showWarriorId, addWarrior, updateWarrior, deleteWarrior } from '../controllers/warriors.controller.js';

const router = Router();
const apiName = '/warriors';

router.route(apiName)
  .get(showWarriors)
  .post(addWarrior);

router.route(`${apiName}/:id`)
  .get(showWarriorId)
  .put(updateWarrior)
  .delete(deleteWarrior);

export default router;
