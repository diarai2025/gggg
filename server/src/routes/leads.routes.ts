import { Router } from 'express';
import { LeadsController } from '../controllers/leads.controller';
import { validateBody, validateParams } from '../middleware/validation.middleware';
import { createLeadSchema, updateLeadSchema, idParamSchema } from '../validations/schemas';

const router = Router();

router.get('/', LeadsController.getLeads);
router.get('/:id', validateParams(idParamSchema), LeadsController.getLeadById);
router.post('/', validateBody(createLeadSchema), LeadsController.createLead);
router.put('/:id', validateParams(idParamSchema), validateBody(updateLeadSchema), LeadsController.updateLead);
router.delete('/:id', validateParams(idParamSchema), LeadsController.deleteLead);

export default router;

