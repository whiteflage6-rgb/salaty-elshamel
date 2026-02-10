
export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface DateInfo {
  gregorian: string;
  hijri: {
    day: string;
    month: { ar: string; en: string };
    year: string;
    designation: { abbreviated: string };
  };
}

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export interface AppSettings {
  notifications: Record<string, boolean>;
  location?: LocationData;
  language: 'ar' | 'en';
}

export interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
}
