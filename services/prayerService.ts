
import { PrayerTimes, DateInfo, LocationData } from '../types';

export const fetchPrayerTimes = async (location: LocationData): Promise<{ times: PrayerTimes; date: DateInfo }> => {
  const { latitude, longitude } = location;
  const date = new Date();
  const timestamp = Math.floor(date.getTime() / 1000);
  
  const response = await fetch(
    `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=4`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch prayer times');
  }
  
  const data = await response.json();
  const timings = data.data.timings;
  const hijri = data.data.date.hijri;
  const gregorian = data.data.date.gregorian;

  return {
    times: {
      Fajr: timings.Fajr,
      Sunrise: timings.Sunrise,
      Dhuhr: timings.Dhuhr,
      Asr: timings.Asr,
      Maghrib: timings.Maghrib,
      Isha: timings.Isha,
    },
    date: {
      gregorian: gregorian.date,
      hijri: {
        day: hijri.day,
        month: { ar: hijri.month.ar, en: hijri.month.en },
        year: hijri.year,
        designation: { abbreviated: hijri.designation.abbreviated }
      }
    }
  };
};

export const fetchRamadanCalendar = async (location: LocationData, year: number): Promise<any[]> => {
  const { latitude, longitude } = location;
  // This is a simplified fetch for the current month. In a real app, you'd target Ramadan specifically.
  const response = await fetch(
    `https://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=4&month=${new Date().getMonth() + 1}&year=${year}`
  );
  const data = await response.json();
  return data.data;
};
