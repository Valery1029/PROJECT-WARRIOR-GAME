/* Author: Valery Escobar
Date: 07/04/2025 */

import { Router } from 'express';
import {
  showWarriorSpells,
  showWarriorSpellsId,
  addWarriorSpells,
  updateWarriorSpells,
  deleteWarriorSpells
} from '../controllers/warriorSpells.controller.js';

const router = Router();
const apiName = '/warriorSpells';

router.route(apiName)
  .get(showWarriorSpells)
  .post(addWarriorSpells);

router.route(`${apiName}/:id`)
  .get(showWarriorSpellsId)
  .put(updateWarriorSpells)
  .delete(deleteWarriorSpells);

export default router;