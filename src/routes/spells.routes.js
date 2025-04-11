/* Author: Valery Escobar
Date: 07/04/2025 */

import { Router } from 'express';
import { getSpells, getSpellId, addSpell, updateSpell, deleteSpell } from '../controllers/spells.controller.js';

const router = Router();
const apiName = '/spells';

router.route(apiName)
  .get(getSpells)
  .post(addSpell);

router.route(`${apiName}/:id`)
  .get(getSpellId)
  .put(updateSpell)
  .delete(deleteSpell);

export default router;