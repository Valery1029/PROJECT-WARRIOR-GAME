import { Router } from 'express';
import {addUpload} from '../controllers/upload.controller.js';

const router = Router();
const apiName = '/upload';

router.route(apiName)
  .post(addUpload);



export default router;