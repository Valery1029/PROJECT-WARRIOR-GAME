/* Author: Valery Escobar
Date: 07/04/2025 */

import { Router } from 'express';
import {
  showUsers,
  showUserId,
  addUser,
  updateUser,
  deleteUser,
  loginUser
} from '../controllers/users.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/authMiddleware.js';

const router = Router();
const apiName = '/users';

router.route(apiName)
  .get(verifyToken, isAdmin, showUsers)
  .post(addUser);

router.route('/usersLogin')
  .post(loginUser);

router.route(`${apiName}/:id`)
  .get(showUserId)
  .put(updateUser)
  .delete(deleteUser);

export default router;
