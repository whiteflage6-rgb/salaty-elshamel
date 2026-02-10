
import React, { useState, useEffect } from 'react';
import { Compass, CheckCircle2 } from 'lucide-react';

const QiblaCompass: React.FC = () => {
  const [heading, setHeading] = useState<number | null>(null);
  const [qiblaDir, setQiblaDir] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const calculateQibla = (lat: number, lng: number) => {
    const meccaLat = 21.4225;
    const meccaLng = 39.8262;
    
    const phi1 = lat * (Math.PI / 180);
    const phi2 = meccaLat * (Math.PI / 180);
    const lambda1 = lng * (Math.PI / 180);
    const lambda2 = meccaLng * (Math.PI / 180);

    const y = Math.sin(lambda2 - lambda1);
    const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(lambda2 - lambda1);
    
    let qibla = Math.atan2(y, x) * (180 / Math.PI);
    return (qibla + 360) % 360;
  };

  useEffect(() => {
    const savedLoc = localStorage.getItem('user_location');
    if (savedLoc) {
      const loc = JSON.parse(savedLoc);
      setQiblaDir(calculateQibla(loc.latitude, loc.longitude));
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // heading is zero when device points North. 
      const h = (event as any).webkitCompassHeading || (360 - (event.alpha || 0));
      setHeading(h);
    };

    if (window.DeviceOrientationEvent) {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        (DeviceOrientationEvent as any).requestPermission()
          .then((state: string) => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
            } else {
              setError("يرجى منح صلاحية البوصلة من إعدادات المتصفح");
            }
          });
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    } else {
      setError("متصفحك لا يدعم البوصلة الرقمية");
    }

    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  // Calculate the rotation of the needle relative to the phone's 'Up'
  const needleRotation = heading !== null ? (qiblaDir - heading) : 0;
  
  // Normalized rotation to detect if pointing at Qibla (within 3 degrees)
  const normalizedRotation = ((needleRotation % 360) + 360) % 360;
  const isAligned = normalizedRotation < 5 || normalizedRotation > 355;

  // Trigger vibration when aligned for the first time in a movement (optional browser support)
  useEffect(() => {
    if (isAligned && navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, [isAligned]);

  return (
    <div className="p-8 h-full flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-emerald-800 mb-2 font-amiri">اتجاة القبلة</h2>
        <p className="text-sm text-gray-500">قم بتدوير هاتفك حتى يتحول السهم للون الأخضر</p>
      </div>

      <div className="relative w-72 h-72">
        {/* Outer Ring Decoration */}
        <div className={`absolute inset-0 rounded-full border-4 transition-colors duration-500 ${isAligned ? 'border-emerald-500 animate-pulse' : 'border-gray-200'}`}></div>

        {/* Compass Dial (Rotates to keep North pointing real North) */}
        <div 
          className="absolute inset-4 bg-white rounded-full shadow-2xl flex items-center justify-center transition-transform duration-200"
          style={{ transform: `rotate(${heading !== null ? -heading : 0}deg)` }}
        >
          <div className="absolute top-4 font-black text-red-600 text-xl">N</div>
          <div className="absolute right-4 font-bold text-gray-400">E</div>
          <div className="absolute bottom-4 font-bold text-gray-400">S</div>
          <div className="absolute left-4 font-bold text-gray-400">W</div>
          
          {/* Tick marks */}
          {[...Array(36)].map((_, i) => (
            <div 
              key={i} 
              className={`absolute w-0.5 ${i % 9 === 0 ? 'h-4 bg-gray-400' : 'h-2 bg-gray-200'}`} 
              style={{ transform: `rotate(${i * 10}deg) translateY(-118px)` }}
            />
          ))}

          {/* Qibla Marker Triangle on the Dial */}
          <div 
            className="absolute flex flex-col items-center"
            style={{ transform: `rotate(${qiblaDir}deg) translateY(-130px)` }}
          >
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[15px] border-b-emerald-600"></div>
          </div>
        </div>

        {/* Floating Qibla Needle (Rotates relative to device's 'Up') */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-transform duration-300 pointer-events-none"
          style={{ transform: `rotate(${needleRotation}deg)` }}
        >
          <div className="relative w-1.5 h-48 flex flex-col items-center">
            {/* Arrow Head */}
            <div className={`w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[24px] transition-colors duration-300 ${isAligned ? 'border-b-emerald-500' : 'border-b-amber-500'}`}></div>
            
            {/* Needle Body */}
            <div className={`w-full h-full rounded-full transition-colors duration-300 ${isAligned ? 'bg-gradient-to-b from-emerald-500 to-transparent' : 'bg-gradient-to-b from-amber-500 to-transparent'}`}></div>
            
            {/* Kaaba Icon at the target */}
            <div className="absolute -top-16 text-4xl transform animate-bounce">
              {isAligned ? '🕋' : '📍'}
            </div>
          </div>
        </div>
        
        {/* Center Point Decoration */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-8 h-8 rounded-full border-4 shadow-md z-20 transition-colors duration-300 ${isAligned ? 'bg-emerald-600 border-emerald-100' : 'bg-white border-emerald-600'}`}>
            {isAligned && <CheckCircle2 size={16} className="text-white m-1" />}
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className={`mt-16 bg-white p-5 rounded-3xl shadow-lg border transition-all duration-300 flex items-center space-x-4 space-x-reverse ${isAligned ? 'border-emerald-500 bg-emerald-50 scale-105' : 'border-emerald-100'}`}>
        <div className={`p-4 rounded-2xl transition-colors ${isAligned ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
          <Compass size={32} className={isAligned ? 'animate-spin-slow' : ''} />
        </div>
        <div>
          <span className="text-xs text-gray-400 font-bold block">زاوية القبلة:</span>
          <span className="text-xl font-black text-emerald-900">{qiblaDir.toFixed(1)}° <span className="text-sm font-normal text-gray-500">من الشمال</span></span>
          {isAligned && <p className="text-emerald-600 font-bold text-xs mt-1 animate-pulse">أنت تشير باتجاه الكعبة الآن!</p>}
        </div>
      </div>

      {error && (
        <div className="mt-8 text-sm text-amber-700 bg-amber-50 px-6 py-3 rounded-2xl border border-amber-200 shadow-sm">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default QiblaCompass;
