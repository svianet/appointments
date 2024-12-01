import { AEPController } from '../controllers/aep.controller';
import { Router } from 'express';

const router = Router();

const Controller = new AEPController();

router.get('/contact/:id',
    Controller.getContact
);
router.get('/statuses',
    Controller.getStatuses
);
router.post('/login',
    Controller.login
);
router.post('/logout',
    Controller.logout
);
export default router;