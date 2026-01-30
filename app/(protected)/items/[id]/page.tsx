"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Gavel,
  Clock,
  TrendingUp,
  User,
  Bell,
  ShieldCheck,
  Award,
  LogOut,
  Mail,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store-hook";
import { createBidAction } from "@/features/bid/bid.action";
import { getItemAction } from "@/features/item/item.action";
import { getSocket } from "@/lib/socket";
import {
  changeCurrentItemStatus,
  changeStatus,
  setCurrentItem,
  Status,
} from "@/features/item/item.slice";
import { logout } from "@/features/user/user.slice";
import { useRouter } from "next/navigation";

const StatCard = ({
  label,
  value,
  icon: Icon,
  colorClass,
}: {
  label: string;
  value: string;
  icon: any;
  colorClass: string;
}) => (
  <div className="bg-slate-800/50 backdrop-blur-sm p-3 rounded-xl border border-slate-700/50 flex items-center gap-3 transition-all">
    <div className={`p-2 rounded-lg ${colorClass}`}>
      <Icon size={16} className="text-white" />
    </div>
    <div>
      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider leading-none mb-1">
        {label}
      </p>
      <p className="text-sm font-bold text-white leading-none">{value}</p>
    </div>
  </div>
);

export default function App({ params }: { params: { id: string } }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const socket = getSocket();
  const auction = useAppSelector((state) => state.item.currentItem);
  const { isLoading } = useAppSelector((state) => state.bid);
  const currentUserId = useAppSelector((state) => state.user.id);
  const user = useAppSelector((state) => state.user);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  useEffect(() => {
    if (!auction) return;
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(auction.endTime).getTime() - now;
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("EXPIRED");
      } else {
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [auction.endTime]);

  useEffect(() => {
    (async function returnId() {
      const allParams = await params;
      await dispatch(getItemAction(allParams.id));
    })();
  }, []);

  useEffect(() => {
    setBidAmount(Number(auction?.currentHighestBid ?? 0) + 50);
  }, [auction]);

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    const allParams = await params;
    if (!auction || Number(bidAmount) <= Number(auction.currentHighestBid))
      return;
    await dispatch(
      createBidAction({ itemId: allParams.id, bidAmount: Number(bidAmount) }),
    );
  };

  useEffect(() => {
    (async function () {
      const allParams = await params;
      socket.emit("join-auction", { auctionId: allParams.id });
    })();

    const handleNewBid = (data: any) => {
      dispatch(setCurrentItem(data));
      setBidAmount(Number(data.bid.bidAmount));
    };
    socket.on("item-status-changed", (data) => {
      dispatch(changeCurrentItemStatus(data));
    });

    socket.on("new-bid", handleNewBid);

    return () => {
      socket.off("new-bid", handleNewBid);
      socket.off("item-status-changed");
    };
  }, []);

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
          <h1 className="text-xl font-black tracking-tight">
            BidMaster<span className="text-indigo-400">Pro</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#0f172a]"></span>
          </button>
          <div className="relative" ref={profileMenuRef}>
            <div 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold border border-white/10 cursor-pointer hover:scale-105 transition-transform"
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-4 border-b border-slate-700">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="w-4 h-4 text-indigo-400" />
                    <p className="text-sm font-bold text-white">{user.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    dispatch(logout());
                    router.push('/');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Takes remaining height */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Left: Preview (Scrollable if needed, but fits content) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col min-h-0 gap-4">
          <div className="bg-slate-800/30 rounded-[2rem] border border-slate-700/50 flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="relative h-2/5 md:h-1/2 shrink-0">
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={auction?.image}
                  alt={auction?.title}
                  className="h-full object-cover opacity-90"
                />
              </div>
              <div
                className={`absolute top-4 left-4 text-white px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-2 uppercase tracking-widest ${
                  auction.status === Status.UPCOMING
                    ? "bg-blue-500"
                    : auction.status === Status.EXPIRED
                      ? "bg-gray-500"
                      : auction.status === Status.CLOSED
                        ? "bg-slate-700"
                        : "bg-red-500"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 bg-white rounded-full ${
                    auction.status === Status.UPCOMING
                      ? "animate-pulse"
                      : auction.status === Status.EXPIRED
                        ? "animate-bounce"
                        : auction.status === Status.CLOSED
                          ? "opacity-50"
                          : "animate-ping"
                  }`}
                ></span>{" "}
                {auction.status}
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1 min-h-0 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase">
                      Collectible
                    </span>
                    <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 uppercase">
                      <ShieldCheck size={10} /> Authenticated
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white">
                    {auction.title}
                  </h2>
                </div>
                <div className="bg-slate-900/50 px-4 py-2 rounded-2xl border border-slate-700/50 text-right">
                  <p className="text-[10px] text-slate-500 font-black uppercase mb-1">
                    Highest Bid{" "}
                    {auction?.currentWinner?.name
                      ? `By :  ${auction.currentWinner.name}`
                      : "None"}
                  </p>
                  <p className="text-2xl font-black text-white text-center">
                    {auction?.currentHighestBid &&
                      Number(auction?.currentHighestBid).toLocaleString()}
                  </p>
                </div>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-shrink-0">
                {auction?.description}
              </p>

              <div className="grid grid-cols-3 gap-3 mt-auto">
                <StatCard
                  label="Ends In"
                  value={timeLeft}
                  icon={Clock}
                  colorClass="bg-amber-500/20 text-amber-500"
                />
                <StatCard
                  label="Bids"
                  value={`${auction?.bids?.length}`}
                  icon={TrendingUp}
                  colorClass="bg-indigo-500/20 text-indigo-500"
                />
                <StatCard
                  label="Bidders"
                  value={new Set(
                    auction?.bids?.map((b) => b?.user?.name),
                  ).size.toString()}
                  icon={User}
                  colorClass="bg-emerald-500/20 text-emerald-500"
                />
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
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-slate-600">
                  $
                </span>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  className="w-full bg-slate-900/80 border-2 border-slate-700 rounded-xl py-4 pl-10 pr-4 text-xl font-black text-white focus:border-indigo-500/50 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[50, 100, 500].map((incr) => (
                  <button
                    key={incr}
                    type="button"
                    onClick={() =>
                      setBidAmount(
                        Number(auction?.currentHighestBid ?? 0) + incr,
                      )
                    }
                    className="py-2 bg-slate-800/50 text-slate-400 font-bold rounded-lg border border-slate-700 text-[10px]"
                  >
                    +${incr}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={
                  isLoading ||
                  Number(bidAmount) <= Number(auction.currentHighestBid)
                }
                className="w-full py-4 rounded-xl font-black text-sm bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  "PLACE BID"
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-700/50 flex flex-col flex-1 min-h-0">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Award size={12} className="text-indigo-400" /> Activity
              </h4>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                {auction?.bids?.map((bid, idx) => (
                  <div
                    key={bid.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border border-transparent ${idx === 0 ? "bg-indigo-500/10 border-indigo-500/20" : "bg-slate-900/30"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-black ${bid.user.id === currentUserId ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400"}`}
                    >
                      {bid.user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="text-[11px] font-bold text-slate-300 truncate">
                          {bid.user.name}
                        </p>
                        <span className="text-[9px] text-slate-500">
                          {new Date(bid.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm font-black text-white">
                        ${Number(bid.bidAmount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
