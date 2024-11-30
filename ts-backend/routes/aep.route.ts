import { AEPController } from '../controllers/aep.controller';
import { Router } from 'express';

const router = Router();

const Controller = new AEPController();

router.get('/contact/:id',
    Controller.getContact
);
export default router;