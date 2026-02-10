
import React from 'react';
import { 
  Home, 
  RotateCw, 
  Compass, 
  AlarmClock, 
  CalendarCheck, 
  Settings 
} from 'lucide-react';

export const TASBEEHAT = [
  "سبحان الله",
  "الحمد لله",
  "لا إله إلا الله",
  "الله أكبر",
  "أستغفر الله",
  "لا حول ولا قوة إلا بالله",
  "اللهم صل على محمد"
];

export const TASBEEH_TARGETS = [33, 100, 1000, 0]; // 0 means unlimited

export const PRAYER_NAMES: Record<string, string> = {
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء"
};

export const NAVIGATION_ITEMS = [
  { id: 'home', label: 'الرئيسية', icon: <Home size={24} /> },
  { id: 'tasbeeh', label: 'السبحة', icon: <RotateCw size={24} /> },
  { id: 'qibla', label: 'القبلة', icon: <Compass size={24} /> },
  { id: 'alarms', label: 'المنبه', icon: <AlarmClock size={24} /> },
  { id: 'fasting', label: 'الصيام', icon: <CalendarCheck size={24} /> },
];

export const FASTING_DAYS = [
  { name: "صيام الاثنين", description: "سنة عن النبي ﷺ كل أسبوع" },
  { name: "صيام الخميس", description: "سنة عن النبي ﷺ كل أسبوع" },
  { name: "يوم عاشوراء", description: "١٠ محرم" },
  { name: "يوم عرفة", description: "٩ ذو الحجة" },
  { name: "الأيام البيض", description: "١٣، ١٤، ١٥ من كل شهر هجري" }
];
