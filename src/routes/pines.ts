import { Router } from 'express';
import { createPin, getPines, getPinById, updatePin, deletePin } from '../controllers/pines';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.route('/')
  .post(createPin)
  .get(getPines);

router.route('/:id')
  .get(getPinById)
  .put(updatePin)
  .delete(deletePin);

export default router;
