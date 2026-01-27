"use client"
import React, { useState, useRef } from 'react';
import { Mail, Lock, User, Gavel, ArrowRight, Eye, EyeOff, CheckCircle, ShieldCheck, Camera, X } from 'lucide-react';
import Link from 'next/link';

// Type Definitions
interface FormData {
  email: string;
  password: string;
  fullName: string;
}

interface Message {
  type: '' | 'success' | 'error';
  text: string;
}

const App: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    fullName: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>({ type: '', text: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size must be less than 2MB' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (): void => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (formData.email && formData.password && formData.fullName) {
        setMessage({
          type: 'success',
          text: 'Account created successfully! Please verify your email.'
        });
      } else {
        setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-4 font-sans text-slate-200">
      <div className="max-w-4xl w-full bg-[#121214] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        
        {/* Left Side: Brand & Visuals */}
        <div className="md:w-5/12 bg-[#16161a] p-6 md:p-8 text-white flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-800">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
                <Gavel className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">BidMaster <span className="text-indigo-400">Pro</span></h1>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight mb-4">
              The future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">
                Digital Auctions
              </span>
            </h2>
            <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
              Join thousands of collectors in the world's most transparent bidding ecosystem.
            </p>
          </div>

          <div className="relative z-10 mt-8 space-y-4">
            <div className="flex items-center gap-3 text-[13px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Industry-leading encryption</span>
            </div>
            <div className="flex items-center gap-3 text-[13px] text-slate-400">
              <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Real-time bidding sync</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-7/12 p-6 md:p-10 flex flex-col justify-center bg-[#121214]">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-6 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-1">Get Started</h3>
              <p className="text-slate-500 text-sm">Create your account to start bidding</p>
            </div>

            {message.text && (
              <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 border ${
                message.type === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                <span className="text-xs font-medium">{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Compact Image Upload */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative cursor-pointer shrink-0">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-16 h-16 rounded-full border border-dashed border-slate-700 bg-[#1a1a1e] flex items-center justify-center overflow-hidden hover:border-indigo-500 transition-all"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(); }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 rounded-full shadow-lg hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                </div>
                <div className="text-left">
                  <p className="text-[13px] font-semibold text-slate-300">Profile Photo</p>
                  <p className="text-[11px] text-slate-500">Max 2MB</p>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2 bg-[#1a1a1e] border border-slate-800 rounded-lg text-sm text-white focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-300 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2 bg-[#1a1a1e] border border-slate-800 rounded-lg text-sm text-white focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 bg-[#1a1a1e] border border-slate-800 rounded-lg text-sm text-white focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 mt-4"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="text-sm">Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-slate-500 text-[13px]">
                Already have an account?{' '}
                <Link href={"/login"} className="text-indigo-400 font-bold hover:underline">Log in</Link>
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-800/50">
              <div className="flex justify-center items-center gap-6 grayscale opacity-20 contrast-125 scale-75">
                <span className="font-serif text-lg font-black text-white">CHRISTIE'S</span>
                <span className="font-sans text-lg font-black text-white italic">Sotheby's</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;