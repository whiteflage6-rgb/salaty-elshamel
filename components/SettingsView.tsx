
import React, { useState } from 'react';
import { X, MapPin, Globe, Bell, Info, ShieldCheck } from 'lucide-react';

interface SettingsViewProps {
  onClose: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onClose }) => {
  const [lang, setLang] = useState('ar');
  const [saving, setSaving] = useState(false);

  const handleUpdateLocation = () => {
    setSaving(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        localStorage.setItem('user_location', JSON.stringify(loc));
        alert("تم تحديث الموقع بنجاح");
        setSaving(false);
      },
      (err) => {
        alert("فشل في الحصول على الموقع");
        setSaving(false);
      }
    );
  };

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-bottom-4 duration-300 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">الإعدادات</h2>
        <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500">
          <X size={24} />
        </button>
      </div>

      <div className="space-y-4">
        <section className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Globe size={20} />
              </div>
              <span className="font-bold text-gray-700">لغة التطبيق</span>
            </div>
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              className="bg-gray-50 p-2 rounded-lg text-sm border-none outline-none"
            >
              <option value="ar">العربية</option>
              <option value="en">English (Coming Soon)</option>
            </select>
          </div>

          <hr className="border-gray-50" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <MapPin size={20} />
              </div>
              <div>
                <span className="font-bold text-gray-700 block">تحديث الموقع</span>
                <span className="text-[10px] text-gray-400">لحساب مواقيت الصلاة بدقة</span>
              </div>
            </div>
            <button 
              onClick={handleUpdateLocation}
              disabled={saving}
              className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm active:scale-95 disabled:opacity-50"
            >
              {saving ? 'جارٍ التحديث...' : 'تحديث الآن'}
            </button>
          </div>

          <hr className="border-gray-50" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Bell size={20} />
              </div>
              <span className="font-bold text-gray-700">صوت الأذان</span>
            </div>
            <select className="bg-gray-50 p-2 rounded-lg text-sm border-none outline-none">
              <option>مكة المكرمة</option>
              <option>القدس</option>
              <option>صوت منبه هادئ</option>
            </select>
          </div>
        </section>

        <section className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center space-x-3 space-x-reverse opacity-60">
            <div className="p-2 bg-gray-50 text-gray-600 rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <span className="font-bold text-gray-700">سياسة الخصوصية</span>
          </div>
          <hr className="border-gray-50" />
          <div className="flex items-center space-x-3 space-x-reverse opacity-60">
            <div className="p-2 bg-gray-50 text-gray-600 rounded-lg">
              <Info size={20} />
            </div>
            <span className="font-bold text-gray-700">حول التطبيق</span>
          </div>
        </section>
      </div>

      <div className="text-center pt-8">
        <p className="text-[10px] text-gray-300">أوقات الصلاة الشامل v1.0.0</p>
        <p className="text-[10px] text-gray-300 mt-1 italic">بكل حب من أجل المسلمين في كل مكان</p>
      </div>
    </div>
  );
};

export default SettingsView;
