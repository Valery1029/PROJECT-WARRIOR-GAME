import { Router } from 'express';
import {
  showProfiles,
  showProfileId,
  addProfile,
  updateProfile,
  deleteProfile
} from '../controllers/profile.controller.js';

const router = Router();
const apiName = '/profiles';

router.route(apiName)
  .get(showProfiles)
  .post(addProfile);

router.route(`${apiName}/:id`)
  .get(showProfileId)
  .put(updateProfile)
  .delete(deleteProfile);

export default router;
