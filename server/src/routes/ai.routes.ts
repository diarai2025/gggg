import { Router } from 'express';
import { getAIAudience, getAIStatus, generateAdImageHandler } from '../controllers/ai.controller';
import { validateBody } from '../middleware/validation.middleware';
import { z } from 'zod';

// Схема валидации для AI запроса
const aiAudienceSchema = z.object({
  campaignName: z
    .string()
    .min(3, 'Название кампании должно содержать минимум 3 символа')
    .max(200, 'Название кампании не должно превышать 200 символов')
    .trim(),
  platforms: z
    .array(z.string())
    .min(1, 'Выберите хотя бы одну платформу'),
  budget: z
    .number()
    .positive('Бюджет должен быть положительным числом')
    .min(1000, 'Минимальный бюджет: 1000'),
  phone: z.string().optional(),
  location: z.string().max(200).optional(),
  description: z.string().optional(),
});

// Схема валидации для генерации изображения
const generateImageSchema = z.object({
  campaignName: z
    .string()
    .min(3, 'Название кампании должно содержать минимум 3 символа')
    .max(200, 'Название кампании не должно превышать 200 символов')
    .trim(),
  category: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

const router = Router();

// POST /api/ai/audience - Подбор целевой аудитории
router.post('/audience', validateBody(aiAudienceSchema), getAIAudience);

// GET /api/ai/status - Проверка статуса OpenAI API (без раскрытия ключа)
router.get('/status', getAIStatus);

// POST /api/ai/generate-image - Генерация изображения для рекламы
router.post('/generate-image', validateBody(generateImageSchema), generateAdImageHandler);

export default router;
