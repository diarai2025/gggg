import { useState } from 'react';
import { ArrowLeft, Users, UserPlus, Target, CheckSquare, MessageSquare, Phone, Mail, MoreVertical, Send, Search, X } from 'lucide-react';
import { Screen } from '../App';

interface CRMProps {
  onNavigate: (screen: Screen) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

type Tab = 'clients' | 'leads' | 'deals' | 'tasks' | 'chat';

interface Client {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: string;
  stage: string;
  lastAction: string;
  avatar: string;
}

interface Message {
  id: number;
  sender: 'client' | 'me';
  text: string;
  time: string;
  isAI: boolean;
}

const initialClients: Client[] = [
  {
    id: 1,
    name: 'Анна Иванова',
    phone: '+7 777 123 4567',
    email: 'anna@example.com',
    status: 'Активный',
    stage: 'Переговоры',
    lastAction: '2 часа назад',
    avatar: 'А',
  },
  {
    id: 2,
    name: 'Дмитрий Петров',
    phone: '+7 777 234 5678',
    email: 'dmitry@example.com',
    status: 'Новый',
    stage: 'Первый контакт',
    lastAction: '5 часов назад',
    avatar: 'Д',
  },
  {
    id: 3,
    name: 'Елена Сидорова',
    phone: '+7 777 345 6789',
    email: 'elena@example.com',
    status: 'Активный',
    stage: 'Закрытие сделки',
    lastAction: 'вчера',
    avatar: 'Е',
  },
];

const initialMessages: Message[] = [
  { id: 1, sender: 'client', text: 'Здравствуйте! Интересует ваш продукт', time: '10:30', isAI: false },
  { id: 2, sender: 'me', text: 'Добрый день! С удовольствием расскажу о наших решениях', time: '10:32', isAI: true },
  { id: 3, sender: 'client', text: 'Какие есть тарифы?', time: '10:35', isAI: false },
  { id: 4, sender: 'me', text: 'У нас есть 3 тарифа: Free, Pro и Business. Могу выслать подробное сравнение?', time: '10:36', isAI: true },
];

export function CRM({ onNavigate, showToast }: CRMProps) {
  const [activeTab, setActiveTab] = useState<Tab>('clients');
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    phone: '',
    email: '',
    stage: 'Первый контакт',
  });

  const tabs = [
    { id: 'clients' as Tab, label: 'Клиенты', icon: <Users className="w-4 h-4" /> },
    { id: 'leads' as Tab, label: 'Лиды', icon: <UserPlus className="w-4 h-4" /> },
    { id: 'deals' as Tab, label: 'Сделки', icon: <Target className="w-4 h-4" /> },
    { id: 'tasks' as Tab, label: 'Задачи', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'chat' as Tab, label: 'Чат', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: 'me',
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAI: true,
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleAddClient = () => {
    if (newClient.name && newClient.phone && newClient.email) {
      const newClientWithId: Client = {
        id: clients.length + 1,
        ...newClient,
        status: 'Новый',
        lastAction: 'только что',
        avatar: newClient.name[0].toUpperCase(),
      };
      setClients([...clients, newClientWithId]);
      setShowAddClientModal(false);
      setNewClient({
        name: '',
        phone: '',
        email: '',
        stage: 'Первый контакт',
      });
      showToast('Клиент успешно добавлен', 'success');
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
            <h1 className="text-white">CRM</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                  : 'bg-slate-800/50 border border-slate-700 text-gray-400 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        {activeTab !== 'chat' && (
          <div className="mb-6 flex items-center gap-4">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск..."
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors"
              />
            </div>
            {activeTab === 'clients' && (
              <button
                onClick={() => setShowAddClientModal(true)}
                className="px-4 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-xl hover:shadow-lg transition-shadow flex items-center gap-2 whitespace-nowrap"
              >
                <UserPlus className="w-5 h-5" />
                Добавить клиента
              </button>
            )}
          </div>
        )}

        {/* Content */}
        {activeTab === 'clients' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Client List */}
            <div className="lg:col-span-2 space-y-4">
              {clients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => setSelectedClient(client.id)}
                  className={`bg-slate-800/50 border rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.02] ${
                    selectedClient === client.id ? 'border-yellow-500' : 'border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center text-black">
                        {client.avatar}
                      </div>
                      <div>
                        <h3 className="text-white mb-1">{client.name}</h3>
                        <p className="text-gray-400">{client.email}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-white">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 mb-1">Телефон</p>
                      <p className="text-gray-300">{client.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Статус</p>
                      <span className={`inline-block px-3 py-1 rounded-lg ${
                        client.status === 'Активный' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {client.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Этап воронки</p>
                      <p className="text-gray-300">{client.stage}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Последнее действие</p>
                      <p className="text-gray-300">{client.lastAction}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Client Details */}
            {selectedClient && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-white mb-4">Детали клиента</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-gray-500 mb-2">Заметки</p>
                    <textarea
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 resize-none"
                      rows={4}
                      placeholder="Добавить заметку..."
                    ></textarea>
                  </div>

                  <div>
                    <p className="text-gray-500 mb-2">История действий</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-400">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span>Первый контакт - 3 дня назад</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        <span>Отправлено предложение - 2 дня назад</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                        <span>Звонок - 1 день назад</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-xl hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Написать сообщение
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="border-b border-slate-700 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white">
                А
              </div>
              <div>
                <h3 className="text-white">Анна Иванова</h3>
                <p className="text-gray-400">онлайн</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-sm px-4 py-3 rounded-2xl ${
                      msg.sender === 'me'
                        ? msg.isAI
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                          : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black'
                        : 'bg-slate-700 text-white'
                    }`}
                  >
                    {msg.isAI && msg.sender === 'me' && (
                      <div className="text-xs mb-1 opacity-80">AI Ответ</div>
                    )}
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'opacity-80' : 'text-gray-400'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-slate-700 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Введите сообщение..."
                  className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-xl hover:shadow-lg transition-shadow"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-500 mt-2">
                AI автоматически генерирует ответы на основе контекста
              </p>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="text-center py-12 text-gray-400">
            <UserPlus className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Функционал лидов в разработке</p>
          </div>
        )}

        {activeTab === 'deals' && (
          <div className="text-center py-12 text-gray-400">
            <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Функционал сделок в разработке</p>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="text-center py-12 text-gray-400">
            <CheckSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Функционал задач в разработке</p>
          </div>
        )}
      </main>

      {/* Add Client Modal */}
      {showAddClientModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 w-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white">Добавить клиента</h3>
              <button
                onClick={() => setShowAddClientModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-500 mb-2">Имя</p>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50"
                />
              </div>

              <div>
                <p className="text-gray-500 mb-2">Телефон</p>
                <input
                  type="text"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50"
                />
              </div>

              <div>
                <p className="text-gray-500 mb-2">Email</p>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50"
                />
              </div>

              <div>
                <p className="text-gray-500 mb-2">Этап воронки</p>
                <select
                  value={newClient.stage}
                  onChange={(e) => setNewClient({ ...newClient, stage: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50"
                >
                  <option value="Первый контакт">Первый контакт</option>
                  <option value="Переговоры">Переговоры</option>
                  <option value="Закрытие сделки">Закрытие сделки</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAddClient}
              className="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-xl hover:shadow-lg transition-shadow mt-6"
            >
              Добавить клиента
            </button>
          </div>
        </div>
      )}
    </div>
  );
}