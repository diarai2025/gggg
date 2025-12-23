import { Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { getUserIdByEmail } from '../utils/userHelper';

export class TasksController {
  // Получить все задачи пользователя
  static async getTasks(req: Request, res: Response) {
    try {
      const userEmail = req.user?.email;

      if (!userEmail) {
        return res.status(401).json({ error: 'Email пользователя не предоставлен' });
      }

      const userId = await getUserIdByEmail(userEmail);

      const tasks = await prisma.task.findMany({
        where: { userId },
        orderBy: [
          { dueDate: 'asc' },
          { createdAt: 'desc' },
        ],
      });

      res.json(tasks);
    } catch (error) {
      console.error('Ошибка при получении задач:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  // Получить задачу по ID
  static async getTaskById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userEmail = req.user?.email;

      if (!userEmail) {
        return res.status(401).json({ error: 'Email пользователя не предоставлен' });
      }

      const userId = await getUserIdByEmail(userEmail);

      const task = await prisma.task.findFirst({
        where: { 
          id: parseInt(id, 10),
          userId 
        },
      });

      if (!task) {
        return res.status(404).json({ error: 'Задача не найдена' });
      }

      res.json(task);
    } catch (error) {
      console.error('Ошибка при получении задачи:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }

  // Создать новую задачу
  static async createTask(req: Request, res: Response) {
    try {
      const userEmail = req.user?.email;
      const { title, description, status, priority, dueDate, clientId, dealId, assignedTo, tags } = req.body;

      if (!userEmail) {
        return res.status(401).json({ error: 'Email пользователя не предоставлен' });
      }

      if (!title) {
        return res.status(400).json({ error: 'Необходимо поле: title' });
      }

      const userId = await getUserIdByEmail(userEmail);

      const task = await prisma.task.create({
        data: {
          title,
          description: description || null,
          status: status || 'todo',
          priority: priority || 'medium',
          dueDate: dueDate ? new Date(dueDate) : null,
          userId,
          clientId: clientId || null,
          dealId: dealId || null,
          assignedTo: assignedTo || null,
          tags: tags || [],
        },
      });

      res.status(201).json(task);
    } catch (error: any) {
      console.error('Ошибка при создании задачи:', error);
      
      if (error?.code === 'P2002') {
        return res.status(409).json({ error: 'Задача с такими данными уже существует' });
      }
      
      res.status(500).json({ 
        error: 'Ошибка сервера',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      });
    }
  }

  // Обновить задачу
  static async updateTask(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userEmail = req.user?.email;
      const { title, description, status, priority, dueDate, clientId, dealId, assignedTo, tags } = req.body;

      if (!userEmail) {
        return res.status(401).json({ error: 'Email пользователя не предоставлен' });
      }

      const userId = await getUserIdByEmail(userEmail);

      const task = await prisma.task.findFirst({
        where: { 
          id: parseInt(id, 10),
          userId 
        },
      });

      if (!task) {
        return res.status(404).json({ error: 'Задача не найдена' });
      }

      const updateData: any = {};
      if (title) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (status) updateData.status = status;
      if (priority) updateData.priority = priority;
      if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
      if (clientId !== undefined) updateData.clientId = clientId;
      if (dealId !== undefined) updateData.dealId = dealId;
      if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
      if (tags !== undefined) updateData.tags = tags;

      const updatedTask = await prisma.task.update({
        where: { id: parseInt(id, 10) },
        data: updateData,
      });

      res.json(updatedTask);
    } catch (error: any) {
      console.error('Ошибка при обновлении задачи:', error);
      
      if (error?.code === 'P2025') {
        return res.status(404).json({ error: 'Задача не найдена' });
      }
      
      res.status(500).json({ 
        error: 'Ошибка сервера',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      });
    }
  }

  // Удалить задачу
  static async deleteTask(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userEmail = req.user?.email;

      if (!userEmail) {
        return res.status(401).json({ error: 'Email пользователя не предоставлен' });
      }

      const userId = await getUserIdByEmail(userEmail);

      const task = await prisma.task.findFirst({
        where: { 
          id: parseInt(id, 10),
          userId 
        },
      });

      if (!task) {
        return res.status(404).json({ error: 'Задача не найдена' });
      }

      await prisma.task.delete({
        where: { id: parseInt(id, 10) },
      });

      res.json({ message: 'Задача удалена' });
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }
}

