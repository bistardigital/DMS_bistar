import React, { useState } from 'react';
import {
  Smartphone,
  Monitor,
  Apple,
  Globe,
  Database,
  Terminal,
  CheckCircle2,
  Copy,
  Layers,
  Printer,
  Wifi,
  ExternalLink,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export const MultiOsArchitectureGuide: React.FC = () => {
  const [activePlatform, setActivePlatform] = useState<'android' | 'desktop' | 'web' | 'backend'>('android');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>সার্বজনীন মাল্টি-ওএস বিস্তার নির্দেশিকা (Universal Multi-OS Architecture)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black mt-1 text-white">
          ওয়েব, অ্যান্ড্রয়েড, উইন্ডোজ ও ম্যাক অ্যাপ তৈরির বাস্তব নির্দেশিকা
        </h2>
        <p className="text-xs text-slate-300 mt-2 max-w-3xl leading-relaxed">
          আপনার DMS প্ল্যাটফর্মটি এমনভাবে ডিজাইন করা হয়েছে যাতে একই রিঅ্যাক্ট (React/Next.js) কোডবেস এবং ক্লাউড ডাটাবেজ (PostgreSQL / Firebase) ব্যবহার করে ৫টি প্ল্যাটফর্মেই (Android APK, Windows .exe, macOS .dmg, Web & PWA) নেটিভ স্পিডে চালানো সম্ভব।
        </p>

        {/* Platform Switcher Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
          <button
            onClick={() => setActivePlatform('android')}
            className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
              activePlatform === 'android'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-300" />
            <div className="text-left">
              <div>অ্যান্ড্রয়েড (Android APK)</div>
              <div className="text-[10px] font-normal opacity-80">Capacitor / TWA</div>
            </div>
          </button>

          <button
            onClick={() => setActivePlatform('desktop')}
            className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
              activePlatform === 'desktop'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Monitor className="w-4 h-4 text-indigo-300" />
            <div className="text-left">
              <div>উইন্ডোজ ও ম্যাক (Desktop)</div>
              <div className="text-[10px] font-normal opacity-80">Tauri / Electron</div>
            </div>
          </button>

          <button
            onClick={() => setActivePlatform('web')}
            className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
              activePlatform === 'web'
                ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/30'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Globe className="w-4 h-4 text-amber-300" />
            <div className="text-left">
              <div>ওয়েব ও পিডব্লিউএ (Web & PWA)</div>
              <div className="text-[10px] font-normal opacity-80">Next.js / Service Worker</div>
            </div>
          </button>

          <button
            onClick={() => setActivePlatform('backend')}
            className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
              activePlatform === 'backend'
                ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4 text-purple-300" />
            <div className="text-left">
              <div>ক্লাউড সিঙ্ক ডাটাবেজ</div>
              <div className="text-[10px] font-normal opacity-80">PostgreSQL / Firestore</div>
            </div>
          </button>
        </div>
      </div>

      {/* Tab 1: Android Platform */}
      {activePlatform === 'android' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <Smartphone className="w-5 h-5" />
              <h3>অ্যান্ড্রয়েড অ্যাপ (APK ও Google Play Store) বানানোর দুটি সহজ উপায়</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Method 1: Capacitor */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">পদ্ধতি ১: Capacitor (সবচেয়ে শক্তিশালী ও রিকমেন্ডেড)</span>
                  <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded">প্রোডাকশন গ্রেড</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Capacitor দিয়ে আমাদের বর্তমান প্রজেক্টকে সরাসরি একটি <strong>Android Studio Native Project</strong>-এ রূপান্তর করা যায়। এতে ডেলিভারি ভ্যান ড্রাইভারদের জন্য <strong>Bluetooth POS Thermal Printer</strong> (রুট চালান প্রিন্টিং) এবং ক্যামেরা দিয়ে <strong>Barcode Scan</strong> সরাসরি কাজ করবে।
                </p>

                <div className="bg-slate-900 text-slate-100 rounded-lg p-3 font-mono text-[11px] space-y-1 relative">
                  <div className="text-slate-400"># ১. Capacitor ইনস্টল করুন:</div>
                  <div className="text-emerald-400">npm install @capacitor/core @capacitor/cli @capacitor/android</div>
                  <div className="text-slate-400 mt-2"># ২. প্রজেক্ট ইনিশিয়ালাইজ করুন:</div>
                  <div className="text-emerald-400">npx cap init "BISTAR B2B-DMS" com.bistar.dms --web-dir dist</div>
                  <div className="text-slate-400 mt-2"># ৩. অ্যান্ড্রয়েড বিল্ড যুক্ত ও ওপেন করুন:</div>
                  <div className="text-emerald-400">npm run build && npx cap add android</div>
                  <div className="text-emerald-400">npx cap open android</div>

                  <button
                    onClick={() => copyToClipboard('npm install @capacitor/core @capacitor/cli @capacitor/android && npx cap init "BISTAR B2B-DMS" com.bistar.dms --web-dir dist && npm run build && npx cap add android', 1)}
                    className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                    title="Copy commands"
                  >
                    {copiedIndex === 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Method 2: TWA */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">পদ্ধতি ২: TWA (Bubblewrap CLI)</span>
                  <span className="bg-indigo-100 text-indigo-800 font-bold text-[10px] px-2 py-0.5 rounded">১০ মিনিটে APK</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  আমাদের অ্যাপে ইতিমধ্যে <code>manifest.json</code> এবং Service Worker সেটআপ আছে। গুগলের অফিসিয়াল <strong>Bubblewrap CLI</strong> দিয়ে সরাসরি ওয়েবসাইটের লিংক দিলেই এটি মাত্র ১০ মিনিটে সরাসরি সাইন করা <code>.apk</code> বা <code>.aab</code> ফাইল বানিয়ে দেয়।
                </p>

                <div className="bg-slate-900 text-slate-100 rounded-lg p-3 font-mono text-[11px] space-y-1 relative">
                  <div className="text-slate-400"># ১. Bubblewrap CLI চালান:</div>
                  <div className="text-indigo-400">npm install -g @bubblewrap/cli</div>
                  <div className="text-slate-400 mt-2"># ২. আপনার লাইভ ইউআরএল দিন:</div>
                  <div className="text-indigo-400">bubblewrap init --manifest https://your-domain.com/manifest.json</div>
                  <div className="text-slate-400 mt-2"># ৩. APK ফাইল জেনারেট করুন:</div>
                  <div className="text-indigo-400">bubblewrap build</div>

                  <button
                    onClick={() => copyToClipboard('npm install -g @bubblewrap/cli && bubblewrap init --manifest https://your-domain.com/manifest.json && bubblewrap build', 2)}
                    className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                    title="Copy commands"
                  >
                    {copiedIndex === 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Windows & Mac Desktop */}
      {activePlatform === 'desktop' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
              <Monitor className="w-5 h-5" />
              <h3>উইন্ডোজ (.exe) ও ম্যাক (.dmg) ডেস্কটপ সফটওয়্যার তৈরি</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              ডিস্ট্রিবিউশন ডিপো বা ওয়্যারহাউজের জন্য ডেস্কটপ সফটওয়্যার প্রয়োজন হয় যাতে সরাসরি ক্যাশ ড্রয়ার খোলা, বারকোড স্ক্যানার এবং 80mm থার্মাল রিসিপ্ট প্রিন্টারে ইনস্ট্যান্ট প্রিন্ট পাঠানো যায়।
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Tauri */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">Tauri (অতি দ্রুত, মাত্র ৫ মেগাবাইট সাইজ)</span>
                  <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded">সুপার লাইটওয়েট</span>
                </div>
                <p className="text-slate-600">
                  উইন্ডোজের বিল্ট-ইন WebView2 ব্যবহার করে। কোনো ভারী ব্রাউজার বান্ডিল করে না, তাই মাত্র 5MB থেকে 10MB ইনস্টলার হয় এবং ১ সেকেন্ডে ওপেন হয়।
                </p>

                <div className="bg-slate-900 text-slate-100 rounded-lg p-3 font-mono text-[11px] space-y-1 relative">
                  <div className="text-slate-400"># Tauri ইনস্টল ও সেটআপ:</div>
                  <div className="text-indigo-400">npm install -D @tauri-apps/cli</div>
                  <div className="text-indigo-400">npx tauri init</div>
                  <div className="text-slate-400 mt-2"># Windows .exe বা Mac .dmg বিল্ড:</div>
                  <div className="text-emerald-400">npm run build && npx tauri build</div>

                  <button
                    onClick={() => copyToClipboard('npm install -D @tauri-apps/cli && npx tauri init && npm run build && npx tauri build', 3)}
                    className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                  >
                    {copiedIndex === 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Electron */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">Electron (প্রচলিত ও নির্ভরযোগ্য)</span>
                  <span className="bg-slate-200 text-slate-800 font-bold text-[10px] px-2 py-0.5 rounded">Standard</span>
                </div>
                <p className="text-slate-600">
                  ভিএস কোড (VS Code) বা স্ল্যাকের মতো ক্রোমিয়াম বান্ডিল করে। সরাসরি উইন্ডোজ অটো-আপডেট ও অফলাইন ব্যাকআপ সাপোর্ট করে।
                </p>

                <div className="bg-slate-900 text-slate-100 rounded-lg p-3 font-mono text-[11px] space-y-1 relative">
                  <div className="text-slate-400"># Electron সেটআপ:</div>
                  <div className="text-indigo-400">npm install -D electron electron-builder</div>
                  <div className="text-slate-400 mt-2"># উইন্ডোজ প্যাকেজার রান:</div>
                  <div className="text-emerald-400">npx electron-builder --win --x64</div>

                  <button
                    onClick={() => copyToClipboard('npm install -D electron electron-builder && npx electron-builder --win --x64', 4)}
                    className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                  >
                    {copiedIndex === 4 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Web & PWA */}
      {activePlatform === 'web' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
              <Globe className="w-5 h-5" />
              <h3>ওয়েব অ্যাপ্লিকেশন ও পিডব্লিউএ (Progressive Web App)</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              দোকানদাররা কোনো অ্যাপ স্টোরে না গিয়েও মোবাইলের ক্রোম ব্রাউজারে প্রবেশ করে এক ক্লিকে <strong>"Add to Home Screen"</strong> করে নিতে পারে। এটি ইনস্টল করা ছাড়াই অ্যাপের মতো ফুলস্ক্রিনে চলে।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Wifi className="w-4 h-4 text-emerald-600" />
                  <span>অফলাইন ক্যাশিং</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  ইন্টারনেট সাময়িক ড্রপ করলেও ক্যাটালগ ও প্রডাক্টের ছবি ক্যাশ থেকে লোড হবে।
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Printer className="w-4 h-4 text-indigo-600" />
                  <span>চালান ইনভয়েস প্রিন্ট</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  ব্রাউজার থেকেই সরাসরি A4 বা POS সাইজে ইনভয়েস ও পিক-লিস্ট প্রিন্ট/PDF সেভ হয়।
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>স্বয়ংক্রিয় আপডেট</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  সার্ভারে কোড বা পণ্যের দাম আপডেট করলেই গ্রাহকরা রিলোডে নতুন রেট পেয়ে যাবে।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Backend & Sync */}
      {activePlatform === 'backend' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
              <Database className="w-5 h-5" />
              <h3>ক্লাউড ডাটাবেজ আর্কিটেকচার (PostgreSQL / Prisma ORM)</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              অ্যান্ড্রয়েড অ্যাপ, উইন্ডোজ ডেস্কটপ এবং ওয়েব পোর্টাল—সবাই একটিমাত্র সেন্ট্রাল ক্লাউড ডাটাবেজের সাথে যুক্ত থাকবে। যখন কোনো দোকানদার মোবাইল থেকে অর্ডার করবেন, সাথে সাথে অ্যাডমিনের উইন্ডোজ পিসিতে বিকট সাইরেন সাউন্ড বাজবে এবং ভ্যান ড্রাইভারের ফোনে পিক-লিস্ট আপডেট হয়ে যাবে।
            </p>

            <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-[11px] space-y-2">
              <div className="text-purple-400 font-bold">// PostgreSQL ও Prisma ডাটাবেজ মডেল:</div>
              <div className="text-slate-400">
                model Shop &#123; id String @id, shopName String, status ClientStatus, creditLimitBdt Float, currentDueBdt Float &#125;
              </div>
              <div className="text-slate-400">
                model Order &#123; id String @id, invoiceNumber String, totalWholesaleBdt Float, paymentMethod PaymentMethod &#125;
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
