
import React, { useState, useEffect } from 'react';
// Added Info to the imports
import { Plus, Trash2, Clock, CheckCircle2, Sparkles, Info } from 'lucide-react';
import { Alarm } from '../types';

const SUGGESTED_ALARMS = [
  { label: 'أذكار الصباح', time: '05:30' },
  { label: 'أذكار المساء', time: '16:30' },
  { label: 'قراءة القرآن', time: '06:00' },
  { label: 'صلاة الضحى', time: '09:00' },
  { label: 'قيام الليل', time: '03:00' },
];

const ReligiousAlarms: React.FC = () => {
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem('religious_alarms');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAdd, setShowAdd] = useState(false);
  const [newAlarm, setNewAlarm] = useState({ time: '04:00', label: '' });

  useEffect(() => {
    localStorage.setItem('religious_alarms', JSON.stringify(alarms));
  }, [alarms]);

  const addAlarm = (label?: string, time?: string) => {
    const alarm: Alarm = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      time: time || newAlarm.time,
      label: label || newAlarm.label || 'منبه ديني',
      enabled: true
    };
    setAlarms([...alarms, alarm]);
    setShowAdd(false);
    setNewAlarm({ time: '04:00', label: '' });
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter(a => a.id !== id));
  };

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-emerald-800 font-amiri">منبهات دينية</h2>
        <button 
          onClick={() => setShowAdd(true)}
          className="p-3 bg-emerald-600 text-white rounded-full shadow-lg active:scale-90 transition-transform flex items-center gap-2"
        >
          <Plus size={20} />
          <span className="text-xs font-bold px-1">إضافة</span>
        </button>
      </div>

      {/* Suggested Alarms Section */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-gray-400 flex items-center gap-2 px-1">
          <Sparkles size={16} className="text-amber-500" />
          تنبيهات مقترحة
        </h3>
        <div className="flex overflow-x-auto pb-2 gap-3 no-scrollbar -mx-1 px-1">
          {SUGGESTED_ALARMS.map((suggested, idx) => (
            <button
              key={idx}
              onClick={() => addAlarm(suggested.label, suggested.time)}
              className="flex-shrink-0 bg-white border border-emerald-100 px-4 py-3 rounded-2xl shadow-sm hover:border-emerald-500 transition-all active:scale-95 text-right min-w-[120px]"
            >
              <p className="text-xs font-bold text-emerald-800 mb-1">{suggested.label}</p>
              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                <Clock size={10} />
                {suggested.time}
              </div>
            </button>
          ))}
        </div>
      </section>

      {showAdd && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-emerald-100 animate-in fade-in slide-in-from-top-4 z-20">
          <h3 className="font-bold text-emerald-700 mb-4">إضافة تنبيه جديد</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">وقت التنبيه:</label>
              <input 
                type="time" 
                value={newAlarm.time}
                onChange={(e) => setNewAlarm({...newAlarm, time: e.target.value})}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-emerald-800 text-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">اسم التنبيه:</label>
              <input 
                type="text" 
                placeholder="مثلاً: قراءة سورة الملك..."
                value={newAlarm.label}
                onChange={(e) => setNewAlarm({...newAlarm, label: e.target.value})}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="flex space-x-3 space-x-reverse pt-2">
              <button 
                onClick={() => addAlarm()}
                className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-md active:scale-95 transition-transform"
              >
                حفظ التنبيه
              </button>
              <button 
                onClick={() => setShowAdd(false)}
                className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold active:scale-95 transition-transform"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Alarms List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-400 px-1">تنبيهاتك النشطة</h3>
        {alarms.length === 0 ? (
          <div className="text-center py-16 bg-white/50 rounded-3xl border border-dashed border-gray-200">
            <Clock size={64} className="mx-auto mb-4 text-gray-200" />
            <p className="text-gray-400 text-sm">لا يوجد منبهات مخصصة حالياً</p>
            <p className="text-[10px] text-gray-300 mt-1">ابدأ بإضافة تنبيه من المقترحات أعلاه</p>
          </div>
        ) : (
          alarms.sort((a,b) => a.time.localeCompare(b.time)).map(alarm => (
            <div key={alarm.id} className={`group bg-white p-5 rounded-3xl flex items-center justify-between shadow-sm border transition-all duration-300 ${alarm.enabled ? 'border-emerald-100' : 'border-gray-50 grayscale opacity-50'}`}>
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className={`p-4 rounded-2xl transition-all ${alarm.enabled ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                  <Clock size={24} />
                </div>
                <div>
                  <span className="text-2xl font-black text-emerald-900 tracking-tight block leading-none mb-1">{alarm.time}</span>
                  <p className="text-xs font-bold text-gray-500">{alarm.label}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                <button 
                  onClick={() => toggleAlarm(alarm.id)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${alarm.enabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${alarm.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <button 
                  onClick={() => deleteAlarm(alarm.id)}
                  className="p-3 text-red-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Fixed: Added Info icon from lucide-react */}
      <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 items-start">
        <Info size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
          لضمان دقة التنبيهات، يرجى السماح للتطبيق بالعمل في الخلفية وعدم إغلاقه نهائياً من قائمة التطبيقات النشطة.
        </p>
      </div>
    </div>
  );
};

export default ReligiousAlarms;
