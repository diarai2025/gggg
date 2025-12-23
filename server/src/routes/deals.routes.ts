import { Router } from 'express';
import { DealsController } from '../controllers/deals.controller';
import { validateBody, validateParams } from '../middleware/validation.middleware';
import { createDealSchema, updateDealSchema, idParamSchema } from '../validations/schemas';

const router = Router();

router.get('/', DealsController.getDeals);
router.get('/:id', validateParams(idParamSchema), DealsController.getDealById);
router.post('/', validateBody(createDealSchema), DealsController.createDeal);
router.put('/:id', validateParams(idParamSchema), validateBody(updateDealSchema), DealsController.updateDeal);
router.delete('/:id', validateParams(idParamSchema), DealsController.deleteDeal);

export default router;

