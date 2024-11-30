import { Router } from 'express';
import aep from './aep.route';

const router = Router();
router.use('/aep', aep);

export default router;
