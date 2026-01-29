"use client";

import { useState, useEffect } from "react";

import {
  Gavel,
  TrendingUp,
  Search,
  Bell,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store-hook";
import Image from "next/image";
import { Item, Status } from "@/features/item/item.slice";
import { getItemAction, listItemAction } from "@/features/item/item.action";
import { getSocket } from "@/lib/socket";

export default function App() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.item.items);
  const user = useAppSelector((state) => state.user);
  const [view, setView] = useState<"home" | "details">("home");

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<Status>(Status.ALL);

  useEffect(() => {
    dispatch(listItemAction(filter));
  }, [filter]);
      useEffect(() => {
      const socket = getSocket();
  
      socket.on("connect", () => {
        console.log("Connected to server:", socket.id);
      });
  
      socket.on("disconnect", () => {
        console.log("Disconnected from server");
      });
  
      socket.on("connect_error", (err) => {
        console.error("Connection error:", err.message);
      });
  
      return () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("connect_error");
      };
    }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-indigo-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-purple-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 p-4 md:p-8">
        <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="cursor-pointer" onClick={() => setView("home")}>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-white">
              <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
                <Gavel size={28} />
              </div>
              NEO<span className="text-indigo-400">BID</span>
            </h1>
            <p className="text-slate-400 mt-1 font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              {view === "home"
                ? "Discover Live Opportunities"
                : "Auction Control Room"}
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {view === "home" && (
              <div className="relative group flex-1 md:flex-none">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-72 pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                />
              </div>
            )}
            <button className="p-3 bg-slate-800/50 border border-slate-700 rounded-2xl hover:bg-slate-700 hover:border-slate-600 relative transition-all text-slate-300">
              <Bell size={22} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-[#0f172a]"></span>
            </button>
            <Image
              width={"500"}
              height={500}
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold border border-white/10 shadow-xl cursor-pointer hover:scale-105 transition-transform"
              style={{ overflow: "hidden" }}
              src={user.image}
              alt="user image"
            ></Image>
          </div>
        </header>

        <HomePage
          auctions={items}
          activeFilter={filter}
          setFilter={setFilter}
          onSelectItem= {async (id: string) => {
            await  dispatch(getItemAction(id));
            router.push(`items/${id}`);
          }}
        />
      </div>
    </div>
  );
}

function HomePage({ auctions, onSelectItem, activeFilter, setFilter }: any) {
  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-slate-800/20 p-2 rounded-3xl border border-slate-700/30 backdrop-blur-sm">
        <div className="flex gap-2">
          {["ALL", "LIVE", "UPCOMING", "EXPIRED", "CLOSED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-2xl text-sm font-black transition-all uppercase tracking-widest ${
                activeFilter === f
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 px-4 text-slate-500 text-sm font-bold">
          <Filter size={18} />
          <span>Showing {auctions?.length} Results</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {auctions?.map((item: Item) => (
          <div
            key={item.id}
            onClick={() => onSelectItem(item.id)}
            className="group bg-slate-800/30 rounded-[2rem] border border-slate-700/50 overflow-hidden hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer flex flex-col"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={item.image}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={item.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <div className="absolute top-4 left-4 flex gap-2">
                {item.status === Status.LIVE && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>{" "}
                    Live
                  </span>
                )}
                {item.status === Status.UPCOMING && (
                  <span className="bg-blue-500/90 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-400/30 shadow-lg">
                    Upcoming
                  </span>
                )}
                {item.status === Status.EXPIRED && (
                  <span className="bg-amber-500/90 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-400/30">
                    Expired
                  </span>
                )}
                {item.status === Status.CLOSED && (
                  <span className="bg-slate-700/90 text-slate-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-600/50">
                    Closed
                  </span>
                )}
              </div>
              <div className="absolute bottom-4 right-4 text-white font-black text-xl">
                ${item.minBidPrice.toLocaleString()}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase">
                  {item.description}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-indigo-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-400 text-sm line-clamp-2 mb-6">
                {item.description}
              </p>

              <div className="mt-auto pt-6 border-t border-slate-700/50 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-black uppercase">
                    Current Bids
                  </span>
                  <span className="font-bold text-white flex items-center gap-1">
                    <TrendingUp size={14} className="text-emerald-500" />{" "}
                    {/* {item.bids.length} */}
                  </span>
                </div>
                <button className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/20 group-hover:bg-indigo-500 transition-colors">
                  <ArrowUpRight size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {auctions.length === 0 && (
        <div className="text-center py-24 bg-slate-800/20 rounded-[3rem] border border-dashed border-slate-700">
          <Search size={48} className="mx-auto text-slate-700 mb-4" />
          <h3 className="text-xl font-bold text-slate-500">
            No auctions found matching your search.
          </h3>
        </div>
      )}
    </div>
  );
}
