import { Brain, Feather, Rocket, Users, TrendingUp, DollarSign, Target, Sparkles, Menu, Settings, LogOut, Plus, FileText, Image as ImageIcon } from 'lucide-react';
import { Screen } from '../App';
import { useState } from 'react';

interface DashboardProps {
  user: { name: string; plan: 'Free' | 'Pro' | 'Business' } | null;
  onNavigate: (screen: Screen) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function Dashboard({ user, onNavigate, showToast }: DashboardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const mainBlocks = [
    {
      title: 'AI Реклама',
      icon: <Rocket className="w-8 h-8" />,
      gradient: 'from-pink-500 to-purple-500',
      description: 'Запуск кампаний',
      onClick: () => onNavigate('ai-advertising'),
    },
    {
      title: 'CRM',
      icon: <Users className="w-8 h-8" />,
      gradient: 'from-yellow-400 to-amber-500',
      description: 'Управление клиентами',
      onClick: () => onNavigate('crm'),
    },
  ];

  const kpis = [
    { label: 'Лиды', value: '127', change: '+12%', icon: <Target className="w-5 h-5" /> },
    { label: 'Продажи', value: '₸1.2M', change: '+23%', icon: <DollarSign className="w-5 h-5" /> },
    { label: 'Конверсия', value: '34.5%', change: '+5%', icon: <TrendingUp className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black">
      {/* Header */}
      <header className="border-b border-slate-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
                DIAR
              </h2>
              <span className="hidden sm:block text-gray-500">|</span>
              <span className="hidden sm:block text-gray-400">AI Marketing CRM</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('subscription')}
                className={`px-4 py-2 rounded-lg ${
                  user?.plan === 'Free'
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                }`}
              >
                {user?.plan}
              </button>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center text-black"
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
                    <button
                      onClick={() => onNavigate('integrations')}
                      className="w-full px-4 py-3 text-left hover:bg-slate-700 flex items-center gap-3"
                    >
                      <Settings className="w-4 h-4" />
                      Интеграции
                    </button>
                    <button className="w-full px-4 py-3 text-left hover:bg-slate-700 flex items-center gap-3 text-red-400">
                      <LogOut className="w-4 h-4" />
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-white mb-2">
            Добро пожаловать, {user?.name}!
          </h1>
          <p className="text-gray-400">Управляйте вашим бизнесом с помощью AI</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {kpis.map((kpi, index) => (
            <div
              key={index}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-yellow-500/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-400">{kpi.label}</div>
                <div className="text-yellow-500">{kpi.icon}</div>
              </div>
              <div className="text-white mb-1">{kpi.value}</div>
              <div className="text-green-400">{kpi.change} за неделю</div>
            </div>
          ))}
        </div>

        {/* AI Insights */}
        <div className="mb-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white mb-2">AI Insights</h3>
              <p className="text-gray-300 mb-3">
                Ваша конверсия выросла на 23% за последнюю неделю! Рекомендуем увеличить бюджет на рекламу в Instagram на 15% для максимизации результатов.
              </p>
              <button className="text-purple-400 hover:text-purple-300">
                Подробнее →
              </button>
            </div>
          </div>
        </div>

        {/* Main Blocks */}
        <div className="mb-8">
          <h2 className="text-white mb-6">Основные инструменты</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mainBlocks.map((block, index) => (
              <button
                key={index}
                onClick={block.onClick}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all duration-300 hover:scale-105 text-left group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${block.gradient} flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow`}>
                  {block.icon}
                </div>
                <h3 className="text-white mb-2">{block.title}</h3>
                <p className="text-gray-400">{block.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white mb-4">Активность за 7 дней</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Создано постов</span>
                <span className="text-white">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Новых клиентов</span>
                <span className="text-white">18</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Активных кампаний</span>
                <span className="text-white">5</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white mb-4">Последние действия</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-gray-400">Новый лид от Instagram</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span className="text-gray-400">Опубликован пост</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span className="text-gray-400">Запущена рекламная кампания</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}