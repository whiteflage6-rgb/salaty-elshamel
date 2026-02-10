
import React, { useState, useEffect } from 'react';
import { Calendar, Info, MapPin } from 'lucide-react';
import { FASTING_DAYS } from '../constants';
import { fetchRamadanCalendar } from '../services/prayerService';

const FastingTracker: React.FC = () => {
  const [imsakiye, setImsakiye] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadImsakiye = async () => {
      const savedLoc = localStorage.getItem('user_location');
      if (savedLoc) {
        setLoading(true);
        try {
          const loc = JSON.parse(savedLoc);
          const data = await fetchRamadanCalendar(loc, new Date().getFullYear());
          setImsakiye(data);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
    };
    loadImsakiye();
  }, []);

  return (
    <div className="p-4 space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">فضل الصيام</h2>
          <p className="text-emerald-50 text-sm leading-relaxed">
            "كُلُّ عَمَلِ ابْنِ آدَمَ لَهُ إِلَّا الصِّيَامَ فَإِنَّهُ لِي وَأَنَا أَجْزِي بِهِ"
          </p>
        </div>
        <div className="absolute top-0 right-0 opacity-10 translate-x-4 -translate-y-4">
          <Calendar size={120} />
        </div>
      </div>

      {/* Sunnah Fasting Days */}
      <section>
        <h3 className="font-bold text-gray-800 mb-3 px-2 flex items-center">
          <Info size={18} className="ml-2 text-emerald-600" />
          مواعيد الصيام المستحبة
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {FASTING_DAYS.map((day, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-50 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-emerald-800">{day.name}</h4>
                <p className="text-xs text-gray-500">{day.description}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                ⭐
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ramadan Imsakiye Section */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-800">إمساكية الشهر الحالي</h3>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold">1446 هـ</span>
        </div>

        {loading ? (
          <div className="py-10 text-center animate-pulse text-emerald-600">جاري تحميل الإمساكية...</div>
        ) : imsakiye.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="text-gray-400 font-bold border-b border-gray-50">
                <tr>
                  <th className="pb-3 pr-2">اليوم</th>
                  <th className="pb-3">الإمساك</th>
                  <th className="pb-3">الإفطار</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {imsakiye.slice(0, 10).map((day, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-bold text-emerald-800 pr-2">
                      {day.date.hijri.day} {day.date.hijri.month.ar}
                    </td>
                    <td className="py-4 text-gray-600">{day.timings.Imsak.split(' ')[0]}</td>
                    <td className="py-4 font-bold text-orange-600">{day.timings.Maghrib.split(' ')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-center text-[10px] text-gray-400 mt-4">إمساكية تقريبية بناءً على موقعك الحالي</p>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-2xl">
            <MapPin size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">فشل تحميل الإمساكية، يرجى تفعيل الموقع</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default FastingTracker;
