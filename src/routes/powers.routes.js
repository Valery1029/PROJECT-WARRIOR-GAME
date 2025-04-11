/* Author: Valery Escobar
Date: 07/04/2025 */

import {Router} from 'express';
import {showPowers, showPowersId, addPowers, updatePowers, deletePowers} from '../controllers/powers.controller.js';

const router = Router();
const apiName ='/powers';

router.route(apiName)
  .get(showPowers)
  .post(addPowers);

router.route(`${apiName}/:id`)
  .get(showPowersId)
  .put(updatePowers)
  .delete(deletePowers);

export default router;