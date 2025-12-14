import { useState } from 'react';
import { Onboarding } from './components/Onboarding';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { CRM } from './components/CRM';
import { AIAdvertising } from './components/AIAdvertising';
import { Integrations } from './components/Integrations';
import { Subscription } from './components/Subscription';
import { Toast } from './components/Toast';

export type Screen = 'onboarding' | 'login' | 'dashboard' | 'crm' | 'ai-advertising' | 'integrations' | 'subscription';

export type ToastType = {
  message: string;
  type: 'success' | 'error' | 'info';
} | null;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [user, setUser] = useState<{ name: string; plan: 'Free' | 'Pro' | 'Business' } | null>(null);
  const [toast, setToast] = useState<ToastType>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const handleLogin = (name: string) => {
    setUser({ name, plan: 'Free' });
    setCurrentScreen('dashboard');
    showToast(`Добро пожаловать, ${name}!`, 'success');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <Onboarding onComplete={() => setCurrentScreen('login')} />;
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'dashboard':
        return <Dashboard user={user} onNavigate={setCurrentScreen} showToast={showToast} />;
      case 'crm':
        return <CRM onNavigate={setCurrentScreen} showToast={showToast} />;
      case 'ai-advertising':
        return <AIAdvertising onNavigate={setCurrentScreen} showToast={showToast} />;
      case 'integrations':
        return <Integrations onNavigate={setCurrentScreen} showToast={showToast} />;
      case 'subscription':
        return <Subscription user={user} onNavigate={setCurrentScreen} showToast={showToast} />;
      default:
        return <Dashboard user={user} onNavigate={setCurrentScreen} showToast={showToast} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {renderScreen()}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}