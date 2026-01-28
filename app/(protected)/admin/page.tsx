"use client"
import React, { useState, useRef } from 'react';
import { 
  Gavel, 
  LayoutDashboard, 
  PackagePlus, 
  List, 
  History, 
  TrendingUp, 
  Box, 
  CheckCircle2, 
  Search, 
  Plus, 
  MoreVertical,
  ArrowUpRight,
  Clock,
  Trash2,
  Calendar,
  X,
  Image as ImageIcon
} from 'lucide-react';

// --- Type Definitions (Updated to match Backend Schema) ---
interface Item {
  id: string;
  title: string;
  description: string;
  minBidPrice: number;
  currentHighestBid: number;
  totalBids: number;
  status: 'UPCOMING' | 'LIVE' | 'CLOSED' | 'EXPIRED';
  startTime: string;
  endTime: string;
  autoClose: boolean;
}

interface Bid {
  id: string;
  itemId: string;
  bidder: string;
  amount: number;
  time: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'items' | 'history'>('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'LIVE' | 'CLOSED'>('all');

  // --- Mock Data ---
  const [items, setItems] = useState<Item[]>([
    { 
      id: '1', 
      title: 'Vintage Rolex Daytona', 
      description: 'A rare 1970s timepiece in pristine condition.', 
      minBidPrice: 15000, 
      currentHighestBid: 18500, 
      totalBids: 12, 
      status: 'LIVE', 
      startTime: '2023-10-01T10:00', 
      endTime: '2023-10-05T10:00',
      autoClose: true 
    },
    { 
      id: '2', 
      title: '1964 Ferrari 250 GTO', 
      description: 'One of the most sought-after cars in history.', 
      minBidPrice: 500000, 
      currentHighestBid: 720000, 
      totalBids: 45, 
      status: 'LIVE', 
      startTime: '2023-10-02T12:00', 
      endTime: '2023-10-10T12:00',
      autoClose: true
    },
    { 
      id: '3', 
      title: 'Bored Ape Yacht Club #44', 
      description: 'Premium digital collectible on Ethereum.', 
      minBidPrice: 45, 
      currentHighestBid: 62, 
      totalBids: 8, 
      status: 'CLOSED', 
      startTime: '2023-09-01T10:00', 
      endTime: '2023-09-05T10:00',
      autoClose: true
    },
  ]);

  const bids: Bid[] = [
    { id: 'b1', itemId: '1', bidder: 'John Smith', amount: 18500, time: '2 mins ago' },
    { id: 'b2', itemId: '1', bidder: 'Sarah Lane', amount: 18200, time: '10 mins ago' },
    { id: 'b3', itemId: '2', bidder: 'CryptoWhale', amount: 720000, time: '1 min ago' },
  ];

  // --- Dashboard Stats Calculations ---
  const totalBidsCount = items.reduce((acc, curr) => acc + curr.totalBids, 0);
  const activeItemsCount = items.filter(i => i.status === 'LIVE').length;
  const closedItemsCount = items.filter(i => i.status === 'CLOSED').length;
  const totalVolume = items.reduce((acc, curr) => acc + curr.currentHighestBid, 0);

  // --- Form Logic for New Item ---
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    minBidPrice: '',
    startTime: '',
    endTime: '',
    autoClose: true,
    status: 'UPCOMING' as Item['status']
  });
  
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const item: Item = {
      id: Math.random().toString(36).substr(2, 9),
      title: newItem.title,
      description: newItem.description,
      minBidPrice: Number(newItem.minBidPrice),
      currentHighestBid: Number(newItem.minBidPrice),
      totalBids: 0,
      status: newItem.status,
      startTime: newItem.startTime,
      endTime: newItem.endTime,
      autoClose: newItem.autoClose
    };
    setItems([item, ...items]);
    setNewItem({ title: '', description: '', minBidPrice: '', startTime: '', endTime: '', autoClose: true, status: 'UPCOMING' });
    setShowAddModal(false);
  };

  const filteredItems = items.filter(item => {
    if (filter === 'LIVE') return item.status === 'LIVE';
    if (filter === 'CLOSED') return item.status === 'CLOSED';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#121214] border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Gavel className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold">Admin<span className="text-indigo-400">Panel</span></h1>
        </div>

        <nav className="space-y-2 flex-1">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-800/50'}`}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>
          <button onClick={() => setActiveTab('items')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'items' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-800/50'}`}>
            <Box className="w-4 h-4" /> Item Management
          </button>
          <button onClick={() => setActiveTab('history')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-800/50'}`}>
            <History className="w-4 h-4" /> Global Bid History
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold">AD</div>
            <div>
              <p className="text-sm font-bold">Admin User</p>
              <p className="text-[10px] text-slate-500 uppercase font-black">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {activeTab === 'dashboard' && 'Market Overview'}
              {activeTab === 'items' && 'Item Management'}
              {activeTab === 'history' && 'Bid Logs'}
            </h2>
            <p className="text-slate-500 text-sm">Managing the digital auction floor.</p>
          </div>
          {activeTab === 'items' && (
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-900/20">
              <Plus className="w-4 h-4" /> Add New Item
            </button>
          )}
        </div>

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={<Box className="text-indigo-400" />} label="Active Items" value={activeItemsCount} trend="+3 from last week" />
              <StatCard icon={<TrendingUp className="text-emerald-400" />} label="Total Bids" value={totalBidsCount} trend="+12% activity" />
              <StatCard icon={<CheckCircle2 className="text-purple-400" />} label="Sold Items" value={closedItemsCount} trend="85% clearance" />
              <StatCard icon={<ArrowUpRight className="text-orange-400" />} label="Total Value" value={`$${(totalVolume/1000).toFixed(1)}k`} trend="Market cap" />
            </div>

            {/* Main Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Bids List */}
              <div className="lg:col-span-2 bg-[#121214] border border-slate-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-400" /> Recent Bid History
                  </h3>
                  <button onClick={() => setActiveTab('history')} className="text-xs font-bold text-indigo-400 hover:underline transition-all">View All</button>
                </div>
                <div className="space-y-4">
                  {bids.map(bid => (
                    <div key={bid.id} className="flex items-center justify-between p-3 rounded-xl bg-[#16161a] border border-slate-800/50 hover:border-slate-700 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{bid.bidder}</p>
                          <p className="text-[11px] text-slate-500">on {items.find(i => i.id === bid.itemId)?.title}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-400">+${bid.amount.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-500 flex items-center justify-end gap-1">
                          <Clock className="w-3 h-3" /> {bid.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="bg-[#121214] border border-slate-800 rounded-2xl p-6">
                <h3 className="font-bold mb-6">Market Health</h3>
                <div className="space-y-6">
                  <HealthBar label="Engagement" value={78} color="bg-indigo-500" />
                  <HealthBar label="Inventory Flux" value={45} color="bg-purple-500" />
                  <HealthBar label="Clearance Rate" value={92} color="bg-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Item Management View */}
        {activeTab === 'items' && (
          <div className="space-y-6">
            <div className="flex gap-2 p-1 bg-[#121214] border border-slate-800 rounded-xl w-fit">
              <FilterBtn label="All Items" active={filter === 'all'} onClick={() => setFilter('all')} count={items.length} />
              <FilterBtn label="Live" active={filter === 'LIVE'} onClick={() => setFilter('LIVE')} count={items.filter(i => i.status === 'LIVE').length} />
              <FilterBtn label="Closed" active={filter === 'CLOSED'} onClick={() => setFilter('CLOSED')} count={items.filter(i => i.status === 'CLOSED').length} />
            </div>

            <div className="bg-[#121214] border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#16161a] border-b border-slate-800 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                    <th className="px-6 py-4">Item Title</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Current Highest Bid</th>
                    <th className="px-6 py-4">End Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/20 transition-colors group text-sm">
                      <td className="px-6 py-4">
                        <p className="font-bold text-white">{item.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 max-w-[200px]">{item.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                          item.status === 'LIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-white">${item.currentHighestBid.toLocaleString()}</td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">{new Date(item.endTime).toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-500 hover:text-white transition-colors"><MoreVertical className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredItems.length === 0 && (
                <div className="p-20 text-center">
                  <div className="inline-flex p-4 rounded-full bg-slate-800/50 mb-4">
                    <Search className="w-8 h-8 text-slate-500" />
                  </div>
                  <p className="text-slate-400 font-medium">No items found matching this filter.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Global Bid History View */}
        {activeTab === 'history' && (
          <div className="bg-[#121214] border border-slate-800 rounded-2xl p-8">
            <div className="max-w-4xl">
               <h3 className="text-xl font-bold mb-6">Complete Bid Ledger</h3>
               <div className="space-y-1">
                 {[...bids, ...bids, ...bids].map((bid, i) => (
                    <div key={i} className="group flex items-center justify-between py-4 border-b border-slate-800 last:border-0 hover:bg-white/[0.02] px-4 -mx-4 rounded-lg transition-all">
                        <div className="flex gap-4 items-center">
                          <span className="text-xs font-mono text-slate-600 w-8">{String(i+1).padStart(2, '0')}</span>
                          <div>
                            <span className="text-sm font-bold text-indigo-400">{bid.bidder}</span>
                            <span className="text-sm text-slate-400 mx-2">placed a bid of</span>
                            <span className="text-sm font-bold text-white">${bid.amount.toLocaleString()}</span>
                            <span className="text-xs text-slate-500 ml-2">on {items.find(it => it.id === bid.itemId)?.title}</span>
                          </div>
                        </div>
                        <span className="text-xs text-slate-500 font-medium italic">{bid.time}</span>
                    </div>
                 ))}
               </div>
            </div>
          </div>
        )}

      </main>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121214] border border-slate-800 rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">List New Item</h3>
                <p className="text-xs text-slate-500 mt-1">Fill in the details to create a new auction asset.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddItem} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Item Title</label>
                <input 
                  type="text" 
                  value={newItem.title}
                  onChange={e => setNewItem({...newItem, title: e.target.value})}
                  className="w-full bg-[#1a1a1e] border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition-all"
                  placeholder="Vintage Watch, Rare Painting..."
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Description</label>
                <textarea 
                  value={newItem.description}
                  onChange={e => setNewItem({...newItem, description: e.target.value})}
                  className="w-full bg-[#1a1a1e] border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none min-h-[80px] transition-all"
                  placeholder="Provide detailed information about the asset..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Min Bid Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Min Bid Price ($)</label>
                  <input 
                    type="number" 
                    value={newItem.minBidPrice}
                    onChange={e => setNewItem({...newItem, minBidPrice: e.target.value})}
                    className="w-full bg-[#1a1a1e] border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition-all"
                    placeholder="1.00"
                    required
                  />
                </div>
                {/* Status Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Initial Status</label>
                  <select 
                    value={newItem.status}
                    onChange={e => setNewItem({...newItem, status: e.target.value as Item['status']})}
                    className="w-full bg-[#1a1a1e] border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="UPCOMING">Upcoming</option>
                    <option value="LIVE">Live Now</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Time */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Start Date & Time</label>
                  <input 
                    type="datetime-local" 
                    value={newItem.startTime}
                    onChange={e => setNewItem({...newItem, startTime: e.target.value})}
                    className="w-full bg-[#1a1a1e] border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
                {/* End Time */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">End Date & Time</label>
                  <input 
                    type="datetime-local" 
                    value={newItem.endTime}
                    onChange={e => setNewItem({...newItem, endTime: e.target.value})}
                    className="w-full bg-[#1a1a1e] border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Auto Close Toggle */}
              <div className="flex items-center justify-between p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-indigo-400">Auto Close</p>
                  <p className="text-[10px] text-slate-500">Automatically end auction at End Time</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setNewItem({...newItem, autoClose: !newItem.autoClose})}
                  className={`w-12 h-6 rounded-full transition-all relative ${newItem.autoClose ? 'bg-indigo-600' : 'bg-slate-800'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${newItem.autoClose ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 rounded-xl border border-slate-800 text-sm font-bold hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-900/20">
                  Create Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-components ---

const StatCard = ({ icon, label, value, trend }: any) => (
  <div className="bg-[#121214] border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 bg-slate-800/50 rounded-xl border border-slate-700/50 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{trend}</span>
    </div>
    <p className="text-2xl font-black text-white">{value}</p>
    <p className="text-xs text-slate-500 font-medium">{label}</p>
  </div>
);

const HealthBar = ({ label, value, color }: any) => (
  <div>
    <div className="flex justify-between text-xs mb-2">
      <span className="text-slate-400 font-medium">{label}</span>
      <span className="text-white font-bold">{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

const FilterBtn = ({ label, active, onClick, count }: any) => (
  <button 
    onClick={onClick}
    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
      active ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
    }`}
  >
    {label}
    <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${active ? 'bg-white/20' : 'bg-slate-800 text-slate-600'}`}>
      {count}
    </span>
  </button>
);

export default App;