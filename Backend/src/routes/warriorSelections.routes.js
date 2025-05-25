/* Author: Valery Escobar
Date: 07/04/2025 */

import { Router } from 'express';
import {
  showWarriorSelections,
  showWarriorSelectionId,
  addWarriorSelection,
  updateWarriorSelection,
  deleteWarriorSelection
} from '../controllers/warriorSelections.controller.js';

const router = Router();
const apiName = '/warriorSelections';

router.route(apiName)
  .get(showWarriorSelections)
  .post(addWarriorSelection);

router.route(`${apiName}/:id`)
  .get(showWarriorSelectionId)
  .put(updateWarriorSelection)
  .delete(deleteWarriorSelection);

export default router;
