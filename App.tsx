
import React, { useState, useEffect } from 'react';
import { NAVIGATION_ITEMS } from './constants';
import PrayerDashboard from './components/PrayerDashboard';
import Tasbeeh from './components/Tasbeeh';
import QiblaCompass from './components/QiblaCompass';
import ReligiousAlarms from './components/ReligiousAlarms';
import FastingTracker from './components/FastingTracker';
import SettingsView from './components/SettingsView';
import { Settings as SettingsIcon } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showSettings, setShowSettings] = useState(false);

  const renderContent = () => {
    if (showSettings) return <SettingsView onClose={() => setShowSettings(false)} />;

    switch (activeTab) {
      case 'home': return <PrayerDashboard />;
      case 'tasbeeh': return <Tasbeeh />;
      case 'qibla': return <QiblaCompass />;
      case 'alarms': return <ReligiousAlarms />;
      case 'fasting': return <FastingTracker />;
      default: return <PrayerDashboard />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-xl overflow-hidden relative">
      {/* Header */}
      <header className="bg-emerald-700 text-white p-4 flex justify-between items-center shadow-md z-10">
        <h1 className="text-xl font-bold">أوقات الصلاة الشامل</h1>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-emerald-600 rounded-full transition-colors"
        >
          <SettingsIcon size={24} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-50 pb-20">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t flex justify-around items-center py-2 px-1 z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {NAVIGATION_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setShowSettings(false);
            }}
            className={`flex flex-col items-center justify-center w-full transition-colors ${
              activeTab === item.id && !showSettings ? 'text-emerald-700' : 'text-gray-400'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === item.id && !showSettings ? 'bg-emerald-50' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
