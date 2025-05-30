import { Router } from 'express';
import {
  showRoles,
  showRoleId,
  addRole,
  updateRole,
  deleteRole
} from '../controllers/role.controller.js';

const router = Router();
const apiName = '/roles';

router.route(apiName)
  .get(showRoles)
  .post(addRole);

router.route(`${apiName}/:id`)
  .get(showRoleId)
  .put(updateRole)
  .delete(deleteRole);

export default router;