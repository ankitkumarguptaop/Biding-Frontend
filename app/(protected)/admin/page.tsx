"use client";
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Gavel,
  LayoutDashboard,
  History,
  TrendingUp,
  Box,
  CheckCircle2,
  Search,
  Plus,
  MoreVertical,
  ArrowUpRight,
  Clock,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store-hook";
import { createItemAction, listItemAction } from "@/features/item/item.action";
import { Status } from "@/features/item/item.slice";
import { listBidAction } from "@/features/bid/bid.action";
import Image from "next/image";
import { getSocket } from "@/lib/socket";

const createItemSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title is too long"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    minBidPrice: z
      .string()
      .min(1, "Minimum bid price is required")
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Price must be a positive number",
      }),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    status: z.enum(["UPCOMING", "LIVE", "CLOSED", "EXPIRED"]),
  })
  .refine(
    (data) => {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      return end > start;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  );

type CreateItemFormData = z.infer<typeof createItemSchema>;

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { bids, totalCount } = useAppSelector((state) => state.bid);
  const [activeTab, setActiveTab] = useState<"dashboard" | "items" | "history">(
    "dashboard",
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const items = useAppSelector((state) => state.item.items);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateItemFormData>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      title: "",
      description: "",
      minBidPrice: "",
      startTime: "",
      endTime: "",
      status: "UPCOMING",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setImageError("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setImageError("Please select a valid image file");
        return;
      }
      setImageFile(file);
      setImageError("");
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: CreateItemFormData) => {
    if (!imageFile) {
      setImageError("Item image is required");
      return;
    }

    setImageError("");
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("minBidPrice", data.minBidPrice);
    formData.append("startTime", data.startTime);
    formData.append("endTime", data.endTime);
    formData.append("status", data.status);
    formData.append("image", imageFile);

    try {
      await dispatch(createItemAction(formData)).unwrap();

      reset();
      removeImage();
      setShowAddModal(false);
    } catch (error) {
      console.error("Failed to create item:", error);
    }
  };
  const [filter, setFilter] = useState<Status>(Status.ALL);

  useEffect(() => {
    dispatch(listItemAction(filter));
  }, [filter]);

  useEffect(() => {
    dispatch(listBidAction());
  }, []);


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
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-64 bg-[#121214] border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Gavel className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold">
            Admin<span className="text-indigo-400">Panel</span>
          </h1>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "dashboard" ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" : "text-slate-400 hover:bg-slate-800/50"}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab("items")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "items" ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" : "text-slate-400 hover:bg-slate-800/50"}`}
          >
            <Box className="w-4 h-4" /> Item Management
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "history" ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" : "text-slate-400 hover:bg-slate-800/50"}`}
          >
            <History className="w-4 h-4" /> Global Bid History
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold">
              AD
            </div>
            <div>
              <p className="text-sm font-bold">Admin User</p>
              <p className="text-[10px] text-slate-500 uppercase font-black">
                Super Admin
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {activeTab === "dashboard" && "Market Overview"}
              {activeTab === "items" && "Item Management"}
              {activeTab === "history" && "Bid Logs"}
            </h2>
            <p className="text-slate-500 text-sm">
              Managing the digital auction floor.
            </p>
          </div>
          {activeTab === "items" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-900/20"
            >
              <Plus className="w-4 h-4" /> Add New Item
            </button>
          )}
        </div>

        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<Box className="text-indigo-400" />}
                label="Active Items"
                value={10}
              />
              <StatCard
                icon={<TrendingUp className="text-emerald-400" />}
                label="Total Bids"
                value={totalCount}
                trend="+12% activity"
              />
              <StatCard
                icon={<CheckCircle2 className="text-purple-400" />}
                label="Sold Items"
                value={2}
                trend="85% clearance"
              />
              <StatCard
                icon={<ArrowUpRight className="text-orange-400" />}
                label="Total Value"
                value={`$${(100000 / 1000).toFixed(1)}k`}
                trend="Market cap"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-[#121214] border border-slate-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-400" /> Recent Bid
                    History
                  </h3>
                  <button
                    onClick={() => setActiveTab("history")}
                    className="text-xs font-bold text-indigo-400 hover:underline transition-all"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {bids?.length > 0 &&
                    bids
                      .filter((bid, i) => i < 6)
                      ?.map((bid) => (
                        <div
                          key={bid.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-[#16161a] border border-slate-800/50 hover:border-slate-700 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                              <Image
                                width={200}
                                height={200}
                                src={bid.item.image}
                                objectFit="contain"
                                alt={"Item Image"}
                                className="text-slate-500"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">
                                {bid.user.name}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                on {bid.item.title}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-emerald-400">
                              +${bid.bidAmount.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-slate-500 flex items-center justify-end gap-1">
                              <Clock className="w-3 h-3" />{" "}
                              {new Date(bid.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
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
                  <HealthBar
                    label="Engagement"
                    value={78}
                    color="bg-indigo-500"
                  />
                  <HealthBar
                    label="Inventory Flux"
                    value={45}
                    color="bg-purple-500"
                  />
                  <HealthBar
                    label="Clearance Rate"
                    value={92}
                    color="bg-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Item Management View */}
        {activeTab === "items" && (
          <div className="space-y-6">
            <div className="flex gap-2 p-1 bg-[#121214] border border-slate-800 rounded-xl w-fit">
              <FilterBtn
                label="All Items"
                active={filter === "ALL"}
                onClick={() => setFilter(Status.ALL)}
                count={items.length}
              />
              <FilterBtn
                label="Live"
                active={filter === "LIVE"}
                onClick={() => setFilter(Status.LIVE)}
                count={items.filter((i) => i.status === "LIVE").length}
              />
              <FilterBtn
                label="Closed"
                active={filter === "CLOSED"}
                onClick={() => setFilter(Status.CLOSED)}
                count={items.filter((i) => i.status === "CLOSED").length}
              />
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
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-800/20 transition-colors group text-sm"
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-white">{item.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 max-w-[200px]">
                          {item.description}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                            item.status === "LIVE"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-slate-800 text-slate-400 border-slate-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-white">
                        ${item.currentHighestBid.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                        {new Date(item.endTime).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-500 hover:text-white transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {items.length === 0 && (
                <div className="p-20 text-center">
                  <div className="inline-flex p-4 rounded-full bg-slate-800/50 mb-4">
                    <Search className="w-8 h-8 text-slate-500" />
                  </div>
                  <p className="text-slate-400 font-medium">
                    No items found matching this filter.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Global Bid History View */}
        {activeTab === "history" && (
          <div className="bg-[#121214] border border-slate-800 rounded-2xl p-8">
            <div className="max-w-4xl">
              <h3 className="text-xl font-bold mb-6">Complete Bid Ledger</h3>
              <div className="space-y-1">
                {[...bids].map((bid, i) => (
                  <div
                    key={i}
                    className="group flex items-center justify-between py-4 border-b border-slate-800 last:border-0 hover:bg-white/[0.02] px-4 -mx-4 rounded-lg transition-all"
                  >
                    <div className="flex gap-4 items-center">
                      <span className="text-xs font-mono text-slate-600 w-8">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <span className="text-sm font-bold text-indigo-400">
                          {bid.user.name + " " + bid.user.email}
                        </span>
                        <span className="text-sm text-slate-400 mx-2">
                          placed a bid of
                        </span>
                        <span className="text-sm font-bold text-white">
                          ${bid.bidAmount.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500 ml-2">
                          on {bid.item.title}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 font-medium italic">
                      {new Date(bid.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
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
                <p className="text-xs text-slate-500 mt-1">
                  Fill in the details to create a new auction asset.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Item Title
                </label>
                <input
                  type="text"
                  {...register("title")}
                  className="w-full bg-[#1a1a1e] border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition-all"
                  placeholder="Vintage Watch, Rare Painting..."
                />
                {errors.title && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  className="w-full bg-[#1a1a1e] border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none min-h-[80px] transition-all"
                  placeholder="Provide detailed information about the asset..."
                />
                {errors.description && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Item Image <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  {imagePreview ? (
                    <div className="relative w-full h-48 bg-[#1a1a1e] border border-slate-800 rounded-xl overflow-hidden group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-2 right-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold transition-all opacity-0 group-hover:opacity-100"
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-48 bg-[#1a1a1e] border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-indigo-500 transition-all group"
                    >
                      <div className="p-3 bg-slate-800/50 rounded-xl group-hover:bg-indigo-500/10 transition-all">
                        <ImageIcon className="w-8 h-8 text-slate-500 group-hover:text-indigo-400 transition-all" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-400 group-hover:text-indigo-400 transition-all">
                          Click to upload image
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                {imageError && (
                  <p className="text-red-400 text-xs mt-1">{imageError}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Min Bid Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Min Bid Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("minBidPrice")}
                    className="w-full bg-[#1a1a1e] border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition-all"
                    placeholder="1.00"
                  />
                  {errors.minBidPrice && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.minBidPrice.message}
                    </p>
                  )}
                </div>
                {/* Status Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Initial Status
                  </label>
                  <select
                    {...register("status")}
                    className="w-full bg-[#1a1a1e] border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="UPCOMING">Upcoming</option>
                    <option value="LIVE">Live Now</option>
                  </select>
                  {errors.status && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.status.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Time */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    {...register("startTime")}
                    className="w-full bg-[#1a1a1e] border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition-all"
                  />
                  {errors.startTime && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.startTime.message}
                    </p>
                  )}
                </div>
                {/* End Time */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    {...register("endTime")}
                    className="w-full bg-[#1a1a1e] border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition-all"
                  />
                  {errors.endTime && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.endTime.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setShowAddModal(false);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-800 text-sm font-bold hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Create Item"}
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
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        {trend}
      </span>
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
      <div
        className={`h-full ${color} rounded-full transition-all duration-1000`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const FilterBtn = ({ label, active, onClick, count }: any) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
      active
        ? "bg-indigo-600 text-white shadow-lg"
        : "text-slate-500 hover:text-slate-300"
    }`}
  >
    {label}
    <span
      className={`px-1.5 py-0.5 rounded-md text-[9px] ${active ? "bg-white/20" : "bg-slate-800 text-slate-600"}`}
    >
      {count}
    </span>
  </button>
);

export default App;
