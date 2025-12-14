import { ArrowLeft, Instagram, Send, MessageCircle, Check, ExternalLink } from 'lucide-react';
import { Screen } from '../App';
import { useState } from 'react';

interface IntegrationsProps {
  onNavigate: (screen: Screen) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function Integrations({ onNavigate, showToast }: IntegrationsProps) {
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>(['Instagram']);

  const handleConnect = (name: string) => {
    if (connectedIntegrations.includes(name)) {
      setConnectedIntegrations(connectedIntegrations.filter(i => i !== name));
      showToast(`${name} отключен`, 'info');
    } else {
      setConnectedIntegrations([...connectedIntegrations, name]);
      showToast(`${name} успешно подключен!`, 'success');
    }
  };

  const integrations = [
    {
      name: 'Instagram',
      description: 'Публикация постов и управление комментариями',
      icon: <Instagram className="w-8 h-8" />,
      gradient: 'from-purple-500 via-pink-500 to-orange-500',
      features: ['Автопостинг', 'Ответы на комментарии', 'Статистика'],
    },
    {
      name: 'Telegram Bot',
      description: 'Автоматизация общения с клиентами',
      icon: <Send className="w-8 h-8" />,
      gradient: 'from-blue-400 to-blue-600',
      features: ['AI Ответы', 'Сбор лидов', 'Уведомления'],
    },
    {
      name: 'WhatsApp Business',
      description: 'Бизнес-коммуникация с клиентами',
      icon: <MessageCircle className="w-8 h-8" />,
      gradient: 'from-green-400 to-green-600',
      features: ['Массовые рассылки', 'Чат-бот', 'Каталог товаров'],
    },
  ];

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
            <h1 className="text-white">Интеграции</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-white mb-2">Подключите сервисы</h2>
          <p className="text-gray-400">
            Интегрируйте DIAR с вашими любимыми платформами для автоматизации маркетинга
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all"
            >
              {/* Icon and Status */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${integration.gradient} flex items-center justify-center`}>
                  {integration.icon}
                </div>
                {connectedIntegrations.includes(integration.name) && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg">
                    <Check className="w-4 h-4" />
                    <span>Подключено</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <h3 className="text-white mb-2">{integration.name}</h3>
              <p className="text-gray-400 mb-4">{integration.description}</p>

              {/* Features */}
              <div className="space-y-2 mb-6">
                {integration.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              {connectedIntegrations.includes(integration.name) ? (
                <div className="space-y-2">
                  <button className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Настройки
                  </button>
                  <button
                    onClick={() => handleConnect(integration.name)}
                    className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors"
                  >
                    Отключить
                  </button>
                </div>
              ) : (
                <button
                  className="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-xl hover:shadow-lg hover:shadow-yellow-500/50 transition-all"
                  onClick={() => handleConnect(integration.name)}
                >
                  Подключить
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6">
          <h3 className="text-white mb-3">💡 Совет по интеграциям</h3>
          <p className="text-gray-300 mb-4">
            Подключите Instagram для автоматической публикации постов и Telegram Bot для сбора лидов. 
            Это увеличит вашу эффективность на 40%.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-gray-400 mb-1">Сэкономьте</p>
              <p className="text-white">До 10 часов в неделю</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-gray-400 mb-1">Увеличьте</p>
              <p className="text-white">Лиды на 50%</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-gray-400 mb-1">Автоматизируйте</p>
              <p className="text-white">80% рутинных задач</p>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mt-8">
          <h3 className="text-white mb-4">Скоро появятся</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Facebook', 'TikTok', 'LinkedIn', 'Twitter'].map((platform, index) => (
              <div
                key={index}
                className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 text-center opacity-60"
              >
                <p className="text-gray-400">{platform}</p>
                <p className="text-gray-500 mt-1">Скоро</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}