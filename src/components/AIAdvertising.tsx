import { useState } from 'react';
import { ArrowLeft, Target, TrendingUp, DollarSign, Eye, MousePointer, BarChart3, Sparkles, X, Plus } from 'lucide-react';
import { Screen } from '../App';

interface AIAdvertisingProps {
  onNavigate: (screen: Screen) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface Campaign {
  name: string;
  platform: string;
  status: string;
  budget: string;
  spent: string;
  conversions: number;
}

export function AIAdvertising({ onNavigate, showToast }: AIAdvertisingProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      name: 'Летняя распродажа',
      platform: 'Instagram',
      status: 'Активна',
      budget: '₸50,000',
      spent: '₸32,400',
      conversions: 124,
    },
    {
      name: 'Новая коллекция',
      platform: 'Facebook',
      status: 'Активна',
      budget: '₸35,000',
      spent: '₸18,900',
      conversions: 67,
    },
    {
      name: 'Brand awareness',
      platform: 'Google Ads',
      status: 'На паузе',
      budget: '₸70,000',
      spent: '₸45,200',
      conversions: 201,
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    platform: 'Instagram',
    budget: '',
  });

  const adCards = [
    {
      title: 'Создать рекламное объявление',
      description: 'AI поможет создать эффективный текст, подобрать изображение и call-to-action',
      icon: <Target className="w-8 h-8" />,
      gradient: 'from-blue-500 to-cyan-500',
      onClick: () => setShowCreateModal(true),
    },
    {
      title: 'Подбор целевой аудитории',
      description: 'Определите интересы, возраст и платформы для максимальной эффективности',
      icon: <Eye className="w-8 h-8" />,
      gradient: 'from-purple-500 to-pink-500',
      onClick: () => showToast('Функция в разработке', 'info'),
    },
    {
      title: 'Оптимизация кампаний',
      description: 'AI анализирует метрики и дает рекомендации по улучшению результатов',
      icon: <TrendingUp className="w-8 h-8" />,
      gradient: 'from-yellow-400 to-amber-500',
      onClick: () => showToast('Функция в разработке', 'info'),
    },
  ];

  const metrics = [
    { label: 'CTR', value: '3.2%', change: '+0.5%', icon: <MousePointer className="w-5 h-5" />, color: 'blue' },
    { label: 'CPM', value: '₸450', change: '-12%', icon: <Eye className="w-5 h-5" />, color: 'purple' },
    { label: 'CPC', value: '₸14', change: '-8%', icon: <MousePointer className="w-5 h-5" />, color: 'green' },
    { label: 'ROAS', value: '4.2x', change: '+18%', icon: <DollarSign className="w-5 h-5" />, color: 'yellow' },
  ];

  const handleCreateCampaign = () => {
    if (newCampaign.name && newCampaign.budget) {
      const campaign: Campaign = {
        name: newCampaign.name,
        platform: newCampaign.platform,
        status: 'Активна',
        budget: `₸${newCampaign.budget}`,
        spent: '₸0',
        conversions: 0,
      };
      setCampaigns([...campaigns, campaign]);
      setShowCreateModal(false);
      setNewCampaign({
        name: '',
        platform: 'Instagram',
        budget: '',
      });
      showToast('Рекламная кампания успешно создана', 'success');
    } else {
      showToast('Заполните все поля', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black">
      {/* Header */}
      <header className="border-b border-slate-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-white">AI Реклама</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Overview */}
        <div className="mb-8">
          <h2 className="text-white mb-6">Ключевые метрики</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-yellow-500/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">{metric.label}</span>
                  <div className={`text-${metric.color}-400`}>{metric.icon}</div>
                </div>
                <div className="text-white mb-1">{metric.value}</div>
                <div className={`${metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {metric.change} за неделю
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Optimization Insight */}
        <div className="mb-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">Рекомендация AI по оптимизации</h3>
              <p className="text-gray-300 mb-4">
                Ваша кампания "Летняя распродажа" показывает отличный CTR. Рекомендуем увеличить бюджет на 20% и 
                расширить аудиторию на возрастную группу 25-34 года для повышения конверсий на 15-20%.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => showToast('Рекомендация применена', 'success')}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors"
                >
                  Применить рекомендацию
                </button>
                <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors">
                  Узнать больше
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="mb-8">
          <h2 className="text-white mb-6">Инструменты</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {adCards.map((card, index) => (
              <button
                key={index}
                onClick={card.onClick}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all duration-300 hover:scale-105 text-left group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${card.gradient} flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow`}>
                  {card.icon}
                </div>
                <h3 className="text-white mb-3">{card.title}</h3>
                <p className="text-gray-400">{card.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Active Campaigns */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white">Активные кампании</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-xl hover:shadow-lg transition-shadow flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Создать кампанию
            </button>
          </div>

          <div className="space-y-4">
            {campaigns.map((campaign, index) => (
              <div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-yellow-500/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white mb-2">{campaign.name}</h3>
                    <div className="flex items-center gap-3 text-gray-400">
                      <span>{campaign.platform}</span>
                      <span>•</span>
                      <span className={`px-3 py-1 rounded-lg ${
                        campaign.status === 'Активна'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    Редактировать →
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-500 mb-1">Бюджет</p>
                    <p className="text-white">{campaign.budget}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Потрачено</p>
                    <p className="text-white">{campaign.spent}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Конверсии</p>
                    <p className="text-white">{campaign.conversions}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Прогресс</p>
                    <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full"
                        style={{ width: `${(parseInt(campaign.spent.replace(/[^\d]/g, '')) / parseInt(campaign.budget.replace(/[^\d]/g, ''))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Targeting Helper */}
        <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Помощник по таргетингу
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-gray-400 mb-2 block">Интересы</label>
              <input
                type="text"
                placeholder="Спорт, Технологии, Мода..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50"
              />
            </div>
            <div>
              <label className="text-gray-400 mb-2 block">Возраст</label>
              <select className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-yellow-500/50">
                <option>18-24</option>
                <option>25-34</option>
                <option>35-44</option>
                <option>45+</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 mb-2 block">Платформа</label>
              <select className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-yellow-500/50">
                <option>Instagram</option>
                <option>Facebook</option>
                <option>Google Ads</option>
                <option>TikTok</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => showToast('AI подбирает аудиторию...', 'info')}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-shadow"
          >
            Подобрать аудиторию с AI
          </button>
        </div>
      </main>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-[500px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white">Создать рекламную кампанию</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 mb-2 block">Название кампании</label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  placeholder="Например: Весенняя акция"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50"
                />
              </div>

              <div>
                <label className="text-gray-400 mb-2 block">Платформа</label>
                <select
                  value={newCampaign.platform}
                  onChange={(e) => setNewCampaign({ ...newCampaign, platform: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50"
                >
                  <option>Instagram</option>
                  <option>Facebook</option>
                  <option>Google Ads</option>
                  <option>TikTok</option>
                </select>
              </div>

              <div>
                <label className="text-gray-400 mb-2 block">Бюджет (₸)</label>
                <input
                  type="number"
                  value={newCampaign.budget}
                  onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })}
                  placeholder="50000"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50"
                />
              </div>

              <div>
                <label className="text-gray-400 mb-2 block">Описание (AI)</label>
                <textarea
                  placeholder="AI сгенерирует текст объявления..."
                  rows={4}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 resize-none"
                />
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                  <div className="text-gray-300">
                    AI автоматически подберет целевую аудиторию, оптимизирует ставки и создаст эффективное объявление
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateCampaign}
                className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-xl hover:shadow-lg transition-shadow"
              >
                Создать кампанию
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
