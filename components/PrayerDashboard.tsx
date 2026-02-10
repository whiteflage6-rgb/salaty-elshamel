
import React, { useState, useEffect, useMemo } from 'react';
import { Bell, BellOff, MapPin, RefreshCw, Clock } from 'lucide-react';
import { fetchPrayerTimes } from '../services/prayerService';
import { PrayerTimes, DateInfo, LocationData } from '../types';
import { PRAYER_NAMES } from '../constants';

const PrayerDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ times: PrayerTimes; date: DateInfo } | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('prayer_notifications');
    return saved ? JSON.parse(saved) : { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true };
  });

  const loadData = async () => {
    setLoading(true);
    try {
      let activeLocation = location;
      if (!activeLocation) {
        const savedLocation = localStorage.getItem('user_location');
        if (savedLocation) {
          activeLocation = JSON.parse(savedLocation);
          setLocation(activeLocation);
        } else {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          activeLocation = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          localStorage.setItem('user_location', JSON.stringify(activeLocation));
          setLocation(activeLocation);
        }
      }

      if (activeLocation) {
        const result = await fetchPrayerTimes(activeLocation);
        setData(result);
      }
    } catch (error) {
      console.error("Error loading prayer times", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      if (now.getHours() === 0 && now.getMinutes() === 5) {
        loadData();
      }
    }, 1000); // Update every second for the clock/next prayer logic
    return () => clearInterval(timer);
  }, []);

  const nextPrayerInfo = useMemo(() => {
    if (!data) return null;
    const { times } = data;
    const now = currentTime;
    const nowHours = now.getHours();
    const nowMinutes = now.getMinutes();
    const nowTotalMinutes = nowHours * 60 + nowMinutes;

    const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    
    for (const key of prayerOrder) {
      const timeStr = (times as any)[key];
      const [h, m] = timeStr.split(':').map(Number);
      const prayerTotalMinutes = h * 60 + m;

      if (prayerTotalMinutes > nowTotalMinutes) {
        return { name: key, time: timeStr, arName: PRAYER_NAMES[key] };
      }
    }

    // If after Isha, next prayer is Fajr
    return { name: 'Fajr', time: times.Fajr, arName: PRAYER_NAMES.Fajr, isNextDay: true };
  }, [data, currentTime]);

  const toggleNotification = (prayer: string) => {
    const next = { ...notifications, [prayer]: !notifications[prayer] };
    setNotifications(next);
    localStorage.setItem('prayer_notifications', JSON.stringify(next));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <RefreshCw className="animate-spin text-emerald-600" size={48} />
        <p className="text-gray-500 font-medium">جاري تحديث مواقيت الصلاة...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-center space-y-4">
        <MapPin className="mx-auto text-red-400" size={48} />
        <p className="text-gray-600">يرجى تفعيل الموقع الجغرافي لعرض مواقيت الصلاة</p>
        <button onClick={loadData} className="bg-emerald-600 text-white px-6 py-2 rounded-full shadow-lg">محاولة مرة أخرى</button>
      </div>
    );
  }

  const { times, date } = data;
  const prayerKeys = Object.keys(PRAYER_NAMES);

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      {/* Hijri Date Display */}
      <div className="text-center pt-2">
        <h2 className="text-2xl font-bold text-emerald-800 font-amiri">
          {date.hijri.day} {date.hijri.month.ar} {date.hijri.year} هـ
        </h2>
        <p className="text-gray-400 text-xs mt-1">{date.gregorian} م</p>
      </div>

      {/* Next Prayer Feature Card */}
      {nextPrayerInfo && (
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-6 text-white shadow-xl shadow-orange-200/50 transform hover:scale-[1.02] transition-transform">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
                الصلاة القادمة
              </div>
              <h3 className="text-3xl font-black mb-1">{nextPrayerInfo.arName}</h3>
              <p className="text-orange-50 font-medium flex items-center gap-1">
                <Clock size={14} />
                متبقي القليل على موعد الصلاة
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black tracking-tighter">{nextPrayerInfo.time}</div>
              {nextPrayerInfo.isNextDay && <div className="text-[10px] opacity-70">غداً صباحاً</div>}
            </div>
          </div>
          {/* Decorative background circle */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-4 -top-4 w-24 h-24 bg-amber-400/20 rounded-full blur-xl"></div>
        </div>
      )}

      {/* Location Badge */}
      <div className="flex items-center justify-center">
        <div className="text-[10px] text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 flex items-center gap-2 font-bold shadow-sm">
          <MapPin size={12} />
          <span>الموقع مفعل: حساب دقيق للمواقيت</span>
        </div>
      </div>

      {/* All Prayer List */}
      <div className="grid grid-cols-1 gap-3">
        {prayerKeys.map((key) => {
          const isNotified = notifications[key];
          const isNext = nextPrayerInfo?.name === key;
          
          return (
            <div 
              key={key} 
              className={`group bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border transition-all duration-300 ${
                isNext 
                  ? 'border-orange-200 ring-2 ring-orange-500/10 bg-orange-50/30' 
                  : 'border-gray-100 hover:border-emerald-200'
              }`}
            >
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                  isNext 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' 
                    : isNotified ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-50 text-gray-400'
                }`}>
                  {key === 'Fajr' ? '🌙' : key === 'Sunrise' ? '🌅' : key === 'Dhuhr' ? '☀️' : key === 'Asr' ? '⛅' : key === 'Maghrib' ? '🌇' : '🌃'}
                </div>
                <div>
                  <h3 className={`font-bold transition-colors ${isNext ? 'text-orange-900' : 'text-gray-700'}`}>
                    {PRAYER_NAMES[key]}
                    {isNext && <span className="mr-2 text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded uppercase font-black">الآن</span>}
                  </h3>
                  <p className={`text-xl font-black tracking-tight ${isNext ? 'text-orange-600' : 'text-emerald-700'}`}>
                    {(times as any)[key]}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => toggleNotification(key)}
                className={`p-3 rounded-xl transition-all ${
                  isNotified 
                    ? isNext ? 'bg-orange-100 text-orange-600' : 'bg-emerald-50 text-emerald-600' 
                    : 'bg-gray-50 text-gray-300 hover:text-gray-400'
                }`}
                title={isNotified ? "إلغاء التنبيه" : "تفعيل التنبيه"}
              >
                {isNotified ? <Bell size={20} /> : <BellOff size={20} />}
              </button>
            </div>
          );
        })}
      </div>

      <div className="pt-4 pb-2">
        <p className="text-[10px] text-center text-gray-400">
          تطبيق أوقات الصلاة الشامل • يتم التحديث آلياً يومياً
        </p>
      </div>
    </div>
  );
};

export default PrayerDashboard;
