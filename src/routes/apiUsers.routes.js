/* Author: Valery Escobar
Date: 08/04/2025 */

import { Router } from 'express';
import {
	showApiUsers,
	showApiUserId,
	addApiUser,
	updateApiUser,
	deleteApiUser,
	loginApiUser
} from '../controllers/apiUsers.controller.js';

const router = Router();
const apiName = '/apiUsers';

router.route(apiName)
	.get(showApiUsers)
	.post(addApiUser);

router.route('/apiUsersLogin')
  .post(loginApiUser);

router.route(`${apiName}/:id`)
	.get(showApiUserId)
	.put(updateApiUser)
	.delete(deleteApiUser);

export default router;
