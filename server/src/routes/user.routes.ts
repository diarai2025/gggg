import { Router } from 'express';
import { getUserProfile, updateUserPlan } from '../controllers/user.controller';
import { validateBody } from '../middleware/validation.middleware';
import { updatePlanSchema } from '../validations/schemas';

const router = Router();

// GET /api/user/profile - получить профиль пользователя
router.get('/profile', getUserProfile);

// PUT /api/user/plan - обновить план пользователя
router.put('/plan', validateBody(updatePlanSchema), updateUserPlan);

export default router;

