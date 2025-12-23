import { Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { getUserIdByEmail } from '../utils/userHelper';

export class LeadsController {
  // Получить все лиды пользователя
  static async getLeads(req: Request, res: Response) {
    try {
      const userEmail = req.user?.email;
      
      console.log('=== Запрос на получение лидов ===');
      console.log('Headers:', JSON.stringify(req.headers, null, 2));
      console.log('User from middleware:', req.user);
      console.log('UserEmail:', userEmail);
      
      if (!userEmail) {
        console.error('Email пользователя не предоставлен');
        return res.status(401).json({ error: 'Email пользователя не предоставлен' });
      }

      console.log('Получение лидов для пользователя:', userEmail);

      // Получаем userId из базы данных по email
      let userId: number;
      try {
        console.log('Вызов getUserIdByEmail с email:', userEmail);
        userId = await getUserIdByEmail(userEmail);
        console.log('✅ UserId получен:', userId);
      } catch (error: any) {
        console.error('❌ Ошибка при получении userId:', error);
        console.error('Тип ошибки:', error.constructor.name);
        console.error('Код ошибки:', error.code);
        console.error('Сообщение:', error.message);
        if (error.stack) {
          console.error('Stack trace:', error.stack);
        }
        return res.status(500).json({ 
          error: 'Ошибка при получении данных пользователя',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }

      let leads;
      try {
        console.log('Запрос к базе данных для userId:', userId);
        leads = await prisma.lead.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        });
        console.log('✅ Найдено лидов:', leads.length);
      } catch (dbError: any) {
        console.error('❌ Ошибка при запросе к базе данных:', dbError);
        console.error('Тип ошибки:', dbError.constructor.name);
        console.error('Код ошибки Prisma:', dbError.code);
        console.error('Сообщение:', dbError.message);
        if (dbError.meta) {
          console.error('Meta:', JSON.stringify(dbError.meta, null, 2));
        }
        if (dbError.stack) {
          console.error('Stack trace:', dbError.stack);
        }
        throw dbError;
      }

      console.log('✅ Успешно возвращаем лиды');
      res.json(leads);
    } catch (error: any) {
      console.error('❌ Критическая ошибка при получении лидов:', error);
      console.error('Тип ошибки:', error.constructor.name);
      console.error('Детали ошибки:', {
        message: error.message,
        code: error.code,
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
      res.status(500).json({ 
        error: 'Ошибка сервера',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Получить лид по ID
  static async getLeadById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userEmail = req.user?.email;

      if (!userEmail) {
        return res.status(401).json({ error: 'Email пользователя не предоставлен' });
      }

      const userId = await getUserIdByEmail(userEmail);

      const lead = await prisma.lead.findFirst({
        where: { 
          id: parseInt(id, 10),
          userId 
        },
      });

      if (!lead) {
        return res.status(404).json({ error: 'Лид не найден' });
      }

      res.json(lead);
    } catch (error) {
      console.error('Ошибка при получении лида:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  // Создать новый лид
  static async createLead(req: Request, res: Response) {
    try {
      const userEmail = req.user?.email;
      const { name, phone, email, status, source, stage, lastAction, notes } = req.body;

      if (!userEmail) {
        return res.status(401).json({ error: 'Email пользователя не предоставлен' });
      }

      if (!name || !phone || !email) {
        return res.status(400).json({ error: 'Необходимы поля: name, phone, email' });
      }

      // Валидация email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Неверный формат email адреса' });
      }

      const userId = await getUserIdByEmail(userEmail);

      const lead = await prisma.lead.create({
        data: {
          name,
          phone,
          email,
          status: status || 'new',
          source: source || 'Другое',
          stage: stage || 'Первый контакт',
          lastAction: lastAction ? new Date(lastAction) : new Date(),
          notes: notes || null,
          userId,
        },
      });

      res.status(201).json(lead);
    } catch (error: any) {
      console.error('Ошибка при создании лида:', error);
      
      // Более детальная обработка ошибок
      if (error?.code === 'P2002') {
        return res.status(409).json({ error: 'Лид с таким email уже существует' });
      }
      
      if (error?.code === 'P2003') {
        return res.status(400).json({ error: 'Неверный userId' });
      }
      
      res.status(500).json({ 
        error: 'Ошибка сервера',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      });
    }
  }

  // Обновить лид
  static async updateLead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userEmail = req.user?.email;
      const { name, phone, email, status, source, stage, lastAction, notes } = req.body;

      if (!userEmail) {
        return res.status(401).json({ error: 'Email пользователя не предоставлен' });
      }

      // Валидация ID
      const leadId = parseInt(id, 10);
      if (isNaN(leadId)) {
        return res.status(400).json({ error: 'Неверный формат ID' });
      }

      // Валидация email если он передан
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ error: 'Неверный формат email адреса' });
        }
      }

      const userId = await getUserIdByEmail(userEmail);

      const lead = await prisma.lead.findFirst({
        where: { 
          id: leadId,
          userId 
        },
      });

      if (!lead) {
        return res.status(404).json({ error: 'Лид не найден' });
      }

      const updatedLead = await prisma.lead.update({
        where: { id: leadId },
        data: {
          ...(name && { name }),
          ...(phone && { phone }),
          ...(email && { email }),
          ...(status && { status }),
          ...(source !== undefined && { source }),
          ...(stage !== undefined && { stage }),
          ...(lastAction !== undefined && { lastAction: lastAction ? new Date(lastAction) : null }),
          ...(notes !== undefined && { notes }),
        },
      });

      res.json(updatedLead);
    } catch (error: any) {
      console.error('Ошибка при обновлении лида:', error);
      
      if (error?.code === 'P2025') {
        return res.status(404).json({ error: 'Лид не найден' });
      }
      
      res.status(500).json({ 
        error: 'Ошибка сервера',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      });
    }
  }

  // Удалить лид
  static async deleteLead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userEmail = req.user?.email;

      if (!userEmail) {
        return res.status(401).json({ error: 'Email пользователя не предоставлен' });
      }

      // Валидация ID
      const leadId = parseInt(id, 10);
      if (isNaN(leadId)) {
        return res.status(400).json({ error: 'Неверный формат ID' });
      }

      const userId = await getUserIdByEmail(userEmail);

      const lead = await prisma.lead.findFirst({
        where: { 
          id: leadId,
          userId 
        },
      });

      if (!lead) {
        return res.status(404).json({ error: 'Лид не найден' });
      }

      await prisma.lead.delete({
        where: { id: leadId },
      });

      res.json({ message: 'Лид удален' });
    } catch (error: any) {
      console.error('Ошибка при удалении лида:', error);
      
      if (error?.code === 'P2025') {
        return res.status(404).json({ error: 'Лид не найден' });
      }
      
      res.status(500).json({ 
        error: 'Ошибка сервера',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      });
    }
  }
}

