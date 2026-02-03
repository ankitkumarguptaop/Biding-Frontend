import React, { useEffect, useState } from "react";
import {
  Bell,
  X,
  CheckCheck,
  MessageSquare,
  MoreHorizontal,
  Circle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store-hook";
import {
  listNotificationsAction,
  markAllReadAction,
  markReadAction,
} from "@/features/notification/notification.action";

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("all");
  const dispatch = useAppDispatch();
  const { notifications, totalCount } = useAppSelector(
    (state) => state.notification,
  );

  const markAllRead = async () => {
    await dispatch(markAllReadAction());
    dispatch(listNotificationsAction());
  };

  const markReadNotification = async (id: string) => {
    await dispatch(markReadAction(id));
    dispatch(listNotificationsAction());
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.isRead;
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  useEffect(() => {
    dispatch(listNotificationsAction());
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-slate-800/50 border border-slate-700 rounded-2xl hover:bg-slate-700 hover:border-slate-600 relative transition-all text-slate-300"
      >
        <Bell size={22} />
        {notifications.filter((n) => !n.isRead).length > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0f172a] px-1">
            {notifications.filter((n) => !n.isRead).length}
          </span>
        )}
      </button>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans"
          onClick={() => setIsOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />

          {/* Dialog */}
          <div
            className="relative bg-slate-900 w-full max-w-md rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden border border-slate-800 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-slate-100">
                  Notifications
                </h2>
                {notifications.filter((n) => !n.isRead).length > 0 && (
                  <span className="bg-indigo-500/20 text-indigo-400 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border border-indigo-500/30">
                    {notifications.filter((n) => !n.isRead).length} New
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={markAllRead}
                  className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck size={18} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex px-4 bg-slate-900 border-b border-slate-800">
              {["all", "unread"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 -mb-[1px] ${
                    activeTab === tab
                      ? "text-indigo-400 border-indigo-500"
                      : "text-slate-500 border-transparent hover:text-slate-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="max-h-[480px] overflow-y-auto custom-scrollbar bg-slate-900">
              {filteredNotifications && filteredNotifications.length > 0 ? (
                <div className="divide-y divide-slate-800/50">
                  {filteredNotifications?.map((notification) => (
                    <div
                      onClick={() => {
                        !notification.isRead &&
                          markReadNotification(notification.id);
                      }}
                      key={notification.id}
                      className={`group relative flex gap-4 p-4 transition-colors hover:bg-slate-800/40 ${
                        !notification.isRead ? "bg-indigo-500/[0.04]" : ""
                      }`}
                    >
                      {/* Icon Placeholder */}
                      <div className="relative flex-shrink-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/5 shadow-inner ${!notification.isRead ? "bg-indigo-500/20 text-indigo-400" : "bg-slate-800 text-slate-500"}`}
                        >
                          <MessageSquare size={18} />
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm leading-relaxed ${!notification.isRead ? "text-slate-200" : "text-slate-400"}`}
                        >
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-tight">
                            {formatDate(notification.createdAt)}
                          </span>
                          {!notification.isRead && (
                            <Circle
                              size={5}
                              className="fill-indigo-500 text-indigo-500"
                            />
                          )}
                        </div>
                      </div>

                      {/* Action Section */}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 px-6 text-center">
                  <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
                    <Bell size={28} className="text-slate-600" />
                  </div>
                  <h3 className="text-slate-300 font-semibold">Inbox Zero</h3>
                  <p className="text-sm text-slate-500 mt-2 max-w-[200px] mx-auto">
                    No notifications found. You're all caught up!
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 text-center">
              <button className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors py-2 px-4 rounded-lg hover:bg-slate-800 w-full">
                Dismiss All
              </button>
            </div>
          </div>

          <style
            dangerouslySetInnerHTML={{
              __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `,
            }}
          />
        </div>
      )}
    </>
  );
};

export default Notifications;
