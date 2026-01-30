"use client";
import React, { useState, useRef } from "react";
import {
  Mail,
  Lock,
  User,
  Gavel,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle,
  ShieldCheck,
  Camera,
  X,
} from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "@/store/store-hook";
import { signUpAction } from "@/features/user/user.action";
import { redirect } from "next/navigation";
const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name is too long"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  image: z
    .any()
    .optional()
    .refine(
      (files) => {
        if (!files || files?.length === 0) return true;
        return files[0]?.size <= 2 * 1024 * 1024;
      },
      {
        message: "Image size must be less than 2MB",
      },
    )
    .refine(
      (files) => {
        if (!files || files?.length === 0) return true;
        return ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          files[0]?.type,
        );
      },
      {
        message: "Only .jpg, .jpeg, .png and .webp formats are supported",
      },
    ),
});

type SignupFormData = z.infer<typeof signupSchema>;

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLoading = useAppSelector((state) => state.user.isLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue("image", e.target.files);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (): void => {
    setImagePreview(null);
    setSelectedFile(null);
    setValue("image", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: SignupFormData): Promise<void> => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);

    if (selectedFile) {
      formData.append("image", selectedFile);
      console.log("Image file added:", selectedFile.name);
    } else {
      console.log("No image file selected");
    }

    const res = await dispatch(signUpAction(formData));
    if (res.meta.requestStatus === 'fulfilled') {
      reset();
      setImagePreview(null);
      setSelectedFile(null);
      setValue("image", undefined);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      const userRole = res.payload.role;
      if (userRole === 'ADMIN') {
        redirect('/admin');
      } else {
        redirect('/home');
      }
    }
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
              <h1 className="text-xl font-bold tracking-tight">
                BidMaster <span className="text-indigo-400">Pro</span>
              </h1>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight mb-4">
              The future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">
                Digital Auctions
              </span>
            </h2>
            <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
              Join thousands of collectors in the world's most transparent
              bidding ecosystem.
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
              <h3 className="text-2xl font-bold text-white mb-1">
                Get Started
              </h3>
              <p className="text-slate-500 text-sm">
                Create your account to start bidding
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative cursor-pointer shrink-0">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-16 h-16 rounded-full border border-dashed border-slate-700 bg-[#1a1a1e] flex items-center justify-center overflow-hidden hover:border-indigo-500 transition-all"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 rounded-full shadow-lg hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  <input
                    type="file"
                    {...register("image", {
                      onChange: handleImageChange,
                    })}
                    ref={fileInputRef}
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                  />
                </div>
                <div className="text-left">
                  <p className="text-[13px] font-semibold text-slate-300">
                    Profile Photo
                  </p>
                  <p className="text-[11px] text-slate-500">Max 2MB</p>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    {...register("name")}
                    placeholder="Name "
                    className="w-full pl-10 pr-4 py-2 bg-[#1a1a1e] border border-slate-800 rounded-lg text-sm text-white focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2 bg-[#1a1a1e] border border-slate-800 rounded-lg text-sm text-white focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-medium text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 bg-[#1a1a1e] border border-slate-800 rounded-lg text-sm text-white focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.password.message}
                  </p>
                )}
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
                Already have an account?{" "}
                <Link
                  href={"/"}
                  className="text-indigo-400 font-bold hover:underline"
                >
                  Log in
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-800/50">
              <div className="flex justify-center items-center gap-6 grayscale opacity-20 contrast-125 scale-75">
                <span className="font-serif text-lg font-black text-white">
                  CHRISTIE'S
                </span>
                <span className="font-sans text-lg font-black text-white italic">
                  Sotheby's
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
