"use client"
import React, { useState, useEffect } from 'react';
import { 
  Gavel, 
  Clock, 
  TrendingUp, 
  User, 
  Search, 
  Bell, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Activity,
  Award
} from 'lucide-react';

// --- Types & Mock Data (Unchanged for logic consistency) ---
interface Bid {
  id: string;
  bidderName: string;
  amount: number;
  timestamp: Date;
  isOwnBid?: boolean;
}

interface AuctionItem {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  startingPrice: number;
  endTime: Date;
  image: string;
  bids: Bid[];
  status: 'active' | 'ended' | 'upcoming';
}

const INITIAL_AUCTION: AuctionItem = {
  id: 'auc-101',
  title: "Rare Cyber-Punk Digital Collectible #402",
  description: "A unique 1-of-1 digital artifact from the Neo-Tokyo collection. This piece features interactive neural-link properties.",
  currentBid: 2450.50,
  startingPrice: 1000.00,
  endTime: new Date(Date.now() + 1000 * 60 * 15), 
  image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800",
  status: 'active',
  bids: [
    { id: '1', bidderName: 'CryptoKing', amount: 2450.50, timestamp: new Date(Date.now() - 1000 * 60 * 2) },
    { id: '2', bidderName: 'ArtLover_99', amount: 2300.00, timestamp: new Date(Date.now() - 1000 * 60 * 5) },
    { id: '3', bidderName: 'TechWhiz', amount: 2150.00, timestamp: new Date(Date.now() - 1000 * 60 * 12) },
    { id: '4', bidderName: 'PixelMaster', amount: 2000.00, timestamp: new Date(Date.now() - 1000 * 60 * 15) },
  ]
};

const StatCard = ({ label, value, icon: Icon, colorClass }: { label: string, value: string, icon: any, colorClass: string }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm p-3 rounded-xl border border-slate-700/50 flex items-center gap-3 transition-all">
    <div className={`p-2 rounded-lg ${colorClass}`}>
      <Icon size={16} className="text-white" />
    </div>
    <div>
      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider leading-none mb-1">{label}</p>
      <p className="text-sm font-bold text-white leading-none">{value}</p>
    </div>
  </div>
);

export default function App() {
  const [auction, setAuction] = useState<AuctionItem>(INITIAL_AUCTION);
  const [bidAmount, setBidAmount] = useState<number>(INITIAL_AUCTION.currentBid + 50);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isBidding, setIsBidding] = useState(false);
  const [notifications, setNotifications] = useState<{id: number, text: string}[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = auction.endTime.getTime() - now;
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft('EXPIRED');
      } else {
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [auction.endTime]);

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (bidAmount <= auction.currentBid) return;
    setIsBidding(true);
    setTimeout(() => {
      const newBid: Bid = {
        id: Math.random().toString(36).substr(2, 9),
        bidderName: 'You',
        amount: bidAmount,
        timestamp: new Date(),
        isOwnBid: true
      };
      setAuction(prev => ({ ...prev, currentBid: bidAmount, bids: [newBid, ...prev.bids] }));
      setBidAmount(bidAmount + 50);
      setIsBidding(false);
      addNotification(`Bid placed: $${bidAmount.toLocaleString()}`);
    }, 600);
  };

  const addNotification = (text: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, text }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
  };

  return (
    <div className="h-screen w-full bg-[#0f172a] text-slate-100 flex flex-col overflow-hidden p-4 md:p-6">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-purple-500/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Header - Fixed Height */}
      <header className="relative flex justify-between items-center mb-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg">
            <Gavel size={20} />
          </div>
          <h1 className="text-xl font-black tracking-tight">NEO<span className="text-indigo-400">BID</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-xs focus:outline-none w-48" />
          </div>
          <button className="p-2 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#0f172a]"></span>
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold border border-white/10 cursor-pointer">JD</div>
        </div>
      </header>

      {/* Main Content - Takes remaining height */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left: Preview (Scrollable if needed, but fits content) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col min-h-0 gap-4">
          <div className="bg-slate-800/30 rounded-[2rem] border border-slate-700/50 flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="relative h-2/5 md:h-1/2 shrink-0">
              <img src={auction.image} alt={auction.title} className="w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-2 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span> Live
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1 min-h-0 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase">Collectible</span>
                    <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 uppercase">
                      <ShieldCheck size={10} /> Authenticated
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white">{auction.title}</h2>
                </div>
                <div className="bg-slate-900/50 px-4 py-2 rounded-2xl border border-slate-700/50 text-right">
                   <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Highest Bid</p>
                   <p className="text-2xl font-black text-white">${auction.currentBid.toLocaleString()}</p>
                </div>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-shrink-0">
                {auction.description}
              </p>

              <div className="grid grid-cols-3 gap-3 mt-auto">
                <StatCard label="Ends In" value={timeLeft} icon={Clock} colorClass="bg-amber-500/20 text-amber-500" />
                <StatCard label="Bids" value={`${auction.bids.length}`} icon={TrendingUp} colorClass="bg-indigo-500/20 text-indigo-500" />
                <StatCard label="Bidders" value={(new Set(auction.bids.map(b => b.bidderName))).size.toString()} icon={User} colorClass="bg-emerald-500/20 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Bidding Console (Fixed height/Scrollable history) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col min-h-0 gap-6">
          <div className="bg-slate-800/40 rounded-[2rem] p-6 border border-slate-700/50 flex flex-col flex-1 min-h-0">
            <h3 className="text-sm font-black flex items-center gap-2 text-white mb-6">
              <div className="w-1 h-4 bg-indigo-500 rounded-full"></div>
              Bidding Console
            </h3>

            <form onSubmit={handlePlaceBid} className="space-y-4 shrink-0">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-slate-600">$</span>
                <input 
                  type="number" 
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  className="w-full bg-slate-900/80 border-2 border-slate-700 rounded-xl py-4 pl-10 pr-4 text-xl font-black text-white focus:border-indigo-500/50 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[50, 100, 500].map(incr => (
                  <button key={incr} type="button" onClick={() => setBidAmount(auction.currentBid + incr)} className="py-2 bg-slate-800/50 text-slate-400 font-bold rounded-lg border border-slate-700 text-[10px]">+${incr}</button>
                ))}
              </div>

              <button 
                type="submit"
                disabled={isBidding || bidAmount <= auction.currentBid}
                className="w-full py-4 rounded-xl font-black text-sm bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isBidding ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : 'PLACE BID'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-700/50 flex flex-col flex-1 min-h-0">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Award size={12} className="text-indigo-400" /> Activity
              </h4>
               
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                {auction.bids.map((bid, idx) => (
                  <div key={bid.id} className={`flex items-center gap-3 p-3 rounded-xl border border-transparent ${idx === 0 ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-slate-900/30'}`}>
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-black ${bid.isOwnBid ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {bid.bidderName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="text-[11px] font-bold text-slate-300 truncate">{bid.bidderName}</p>
                        <span className="text-[9px] text-slate-500">{bid.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="text-sm font-black text-white">${bid.amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {notifications.map(n => (
          <div key={n.id} className="bg-white text-slate-900 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in-right">
            <Zap size={14} fill="currentColor" className="text-indigo-600" />
            <span className="text-xs font-black">{n.text}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(120%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  );
}