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
router.get('/session',
    Controller.currentSession
);
router.get('/isLogged',
    Controller.isLogged
);
// reports
router.get('/getAgents',
    Controller.getAgents
);
router.post('/reportByStatus',
    Controller.getReportByStatus
);
router.post('/reportByStatusAgent',
    Controller.getTotalByStatusAgent
);
router.post('/reportTop10Agents',
    Controller.getTop10Agents
);
router.post('/reportTop10Schedulers',
    Controller.getTop10Schedulers
);
router.post('/reportAppointmentSummary',
    Controller.getAppointmentSummary
);
router.post('/reportAppointmentSummaryByMonth',
    Controller.getAppointmentSummaryByMonth
);

export default router;