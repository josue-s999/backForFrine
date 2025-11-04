import { Router } from 'express';
import { getComunas, queryArea } from '../controllers/geo';

const router = Router();

router.get('/comunas', getComunas);
router.get('/query_area', queryArea);

export default router;
