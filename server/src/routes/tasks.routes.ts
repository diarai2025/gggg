import { Router } from 'express';
import { TasksController } from '../controllers/tasks.controller';
import { validateBody, validateParams } from '../middleware/validation.middleware';
import { createTaskSchema, updateTaskSchema, idParamSchema } from '../validations/schemas';

const router = Router();

router.get('/', TasksController.getTasks);
router.get('/:id', validateParams(idParamSchema), TasksController.getTaskById);
router.post('/', validateBody(createTaskSchema), TasksController.createTask);
router.put('/:id', validateParams(idParamSchema), validateBody(updateTaskSchema), TasksController.updateTask);
router.delete('/:id', validateParams(idParamSchema), TasksController.deleteTask);

export default router;

