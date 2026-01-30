"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  Gavel,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store-hook";
import { signInAction } from "@/features/user/user.action";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { redirect, useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const App: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    const result = await dispatch(
      signInAction({ email: data.email, password: data.password }),
    );
    
    if (result.meta.requestStatus === 'fulfilled') {
      const userRole = result.payload.data.user.role;
      if (userRole === 'ADMIN') {
        router.replace('/admin');
      } else {
        router.replace('/home');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-4 md:p-8 font-sans text-slate-200">
      <div className="max-w-5xl w-full bg-[#121214] border border-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        <div className="md:w-1/2 bg-[#16161a] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
                <Gavel className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                BidMaster <span className="text-indigo-400">Pro</span>
              </h1>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              The future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">
                Digital Auctions
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-sm leading-relaxed">
              Join thousands of collectors and investors in the world's most
              transparent bidding ecosystem.
            </p>
          </div>

          <div className="relative z-10 mt-12 space-y-6">
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <span>Secured by industry-leading encryption</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700">
                <CheckCircle className="w-5 h-5 text-indigo-400" />
              </div>
              <span>Real-time bidding synchronization</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-[#121214]">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10 text-center md:text-left">
              <h3 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h3>
              <p className="text-slate-500">
                Enter your credentials to access your dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="name@company.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-[#1a1a1e] border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-[#1a1a1e] border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-indigo-400 font-bold hover:text-indigo-300 hover:underline underline-offset-4 transition-all"
                >
                  Sign up for free
                </Link>
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-800/50">
              <p className="text-center text-[10px] text-slate-600 leading-relaxed uppercase tracking-[0.2em] font-bold mb-6">
                Institutional Partners
              </p>
              <div className="flex justify-center items-center gap-8 grayscale opacity-30 contrast-125">
                <span className="font-serif text-lg font-black text-white">
                  CHRISTIE'S
                </span>
                <span className="font-sans text-lg font-black text-white italic">
                  Sotheby's
                </span>
                <span className="font-sans text-lg font-black text-white">
                  Artnet
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
