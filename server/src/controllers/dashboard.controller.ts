import { Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { getUserIdByEmail } from '../utils/userHelper';

export class DashboardController {
  // Получить статистику для дашборда
  static async getStats(req: Request, res: Response) {
    try {
      const userEmail = req.user?.email;

      if (!userEmail) {
        return res.status(401).json({ error: 'Email пользователя не предоставлен' });
      }

      const userId = await getUserIdByEmail(userEmail);

      const [
        leadsCount,
        activeLeads,
        dealsCount,
        closedDeals,
        tasksCount,
        totalAmount,
        recentLeads,
        recentDeals,
      ] = await Promise.all([
        prisma.lead.count({ where: { userId } }),
        prisma.lead.count({ where: { userId, status: 'contacted' } }),
        prisma.deal.count({ where: { userId } }),
        prisma.deal.count({ where: { userId, stage: { in: ['closed_won', 'closed_lost'] } } }),
        prisma.task.count({ where: { userId, status: { not: 'done' } } }),
        prisma.deal.aggregate({
          where: { userId },
          _sum: { amount: true },
        }),
        prisma.lead.findMany({
          where: { userId },
          take: 5,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.deal.findMany({
          where: { userId },
          take: 5,
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      res.json({
        leads: {
          total: leadsCount,
          active: activeLeads,
        },
        deals: {
          total: dealsCount,
          closed: closedDeals,
          totalAmount: totalAmount._sum.amount || 0,
        },
        tasks: tasksCount,
        recentLeads,
        recentDeals,
      });
    } catch (error) {
      console.error('Ошибка при получении статистики дашборда:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }
}

