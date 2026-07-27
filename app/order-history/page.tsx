"use client";

import { useEffect, useState, useCallback, memo, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Trash2, 
  Map as MapIcon, 
  FileText,
  Zap,
  ShoppingBag,
  Sparkles,
  Loader2
} from "lucide-react";
import RiderChat from "../components/RiderChat";
import { useAuth } from "@/context/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const OrderTracker = dynamic(() => import("../components/OrderTracker"), { 
  ssr: false,
  loading: () => (
    <div className="h-[220px] w-full bg-[#FFFDF9] rounded-2xl flex items-center justify-center border border-[#E5E0D8]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#E5E0D8] border-t-[#EAB308] rounded-full animate-spin" />
        <p className="text-[10px] text-[#A39E93] uppercase font-bold tracking-widest animate-pulse">
          Syncing Telemetry...
        </p>
      </div>
    </div>
  )
});

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  _id?: string;
  orderId: string;
  user?: string;
  userEmail?: string;
  timestamp: number;
  date: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: string;
  status: string;
  destination?: [number, number];
  origin?: [number, number];
  createdAt?: string;
}

const OrderHistoryItem = memo(function OrderHistoryItem({
  order,
  now,
  isActiveMap,
  onToggleMap,
  onDelete,
}: {
  order: Order;
  now: number;
  isActiveMap: boolean;
  onToggleMap: () => void;
  onDelete: (orderId: string, isDelivered: boolean) => void;
}) {
  const progressVal = ((now - order.timestamp) / 120000) * 100;
  const isDelivered = order.status === "Delivered" || progressVal >= 100;

  const chatContext = useMemo(
    () => ({
      orderId: order.orderId,
      address: order.address,
      items: order.items,
      status: isDelivered ? "Delivered" : "In transit",
    }),
    [order.orderId, order.address, order.items, isDelivered]
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -60 }}
      className="relative"
    >
      <div className="bg-[#FFFDF9] border border-[#E5E0D8] rounded-3xl shadow-sm overflow-hidden hover:border-[#D6D0C4] transition-all">
        <div className="p-6">
          {/* Order Top Bar */}
          <div className="flex justify-between items-start mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileText size={13} className="text-[#F472B6]" />
                <span className="text-[10px] font-mono font-bold text-[#A39E93] tracking-wider">
                  {order.orderId}
                </span>
              </div>
              <h3 className="text-[#2C2825] font-bold text-base tracking-tight">
                {order.date}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onDelete(order.orderId, isDelivered)}
                className="p-2 bg-[#FAF7F2] text-[#A39E93] rounded-xl border border-[#E5E0D8] hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all cursor-pointer"
                title="Hide from view"
              >
                <Trash2 size={13} />
              </button>
              <button
                onClick={onToggleMap}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isActiveMap
                    ? "bg-[#EAB308] text-white border-[#EAB308]"
                    : "bg-[#FAF7F2] border-[#E5E0D8] text-[#A39E93] hover:text-[#2C2825]"
                }`}
                title="Toggle map & rider chat"
              >
                <MapIcon size={13} />
              </button>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                  !isDelivered
                    ? "bg-[#FEF9C3] border-[#FEF08A] text-[#854D0E]"
                    : "bg-[#DCFCE7] border-[#BBF7D0] text-[#166534]"
                }`}
              >
                {!isDelivered ? "In Transit" : "Delivered"}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-[#FAF7F2] border border-[#E5E0D8] rounded-2xl p-4 mb-4 space-y-2">
            {order.items?.map((item, i) => (
              <div
                key={i}
                className="flex justify-between text-xs border-b border-[#E5E0D8]/60 pb-1.5 last:border-0 last:pb-0"
              >
                <span className="text-[#4A453E] font-medium">
                  <span className="font-bold text-[#2C2825]">{item.qty}x</span>{" "}
                  {item.name}
                </span>
                <span className="font-mono text-[#A39E93] font-medium">
                  ৳{(item.price * item.qty).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Live Tracker & Rider Chat Integration */}
          <AnimatePresence>
            {isActiveMap && (
              <motion.div
                key={`map-container-${order.orderId}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-4 overflow-hidden rounded-2xl space-y-3"
              >
                <OrderTracker
                  address={order.address}
                  destination={order.destination || [24.3636, 88.6084]}
                  initialProgress={Math.min(progressVal, 100)}
                />
                <RiderChat orderContext={chatContext} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Delivery Address & Total */}
          <div className="mt-5 flex justify-between items-end pt-2">
            <div className="flex items-center gap-2 bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#E5E0D8] max-w-[60%]">
              <MapPin size={12} className="text-[#F472B6] shrink-0" />
              <span className="text-[11px] font-medium truncate text-[#78716C]">
                {order.address}
              </span>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-[#A39E93] tracking-wider">
                Total
              </p>
              <span className="text-2xl font-extrabold text-[#2C2825] tracking-tight">
                ৳{order.total?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default function OrderHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<Order[]>([]);
  const [clearedOrderIds, setClearedOrderIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeMaps, setActiveMaps] = useState<Record<string, boolean>>({});
  const [now, setNow] = useState(Date.now());
  const router = useRouter();

  const userId = user?.id || user?._id;

  useEffect(() => {
    const userIdentifier = user?.email || userId;
    if (userIdentifier) {
      const savedCleared = localStorage.getItem(`cleared_orders_${userIdentifier}`);
      if (savedCleared) {
        try {
          setClearedOrderIds(JSON.parse(savedCleared));
        } catch (e) {
          setClearedOrderIds([]);
        }
      }
    }
  }, [user?.email, userId]);

  const loadLocalHistory = useCallback(() => {
    if (typeof window === "undefined" || (!user?.email && !userId)) return;
    const saved = localStorage.getItem("chirp_history");
    if (saved) {
      try {
        const parsed: Order[] = JSON.parse(saved);
        const userOnly = parsed.filter(
          (o) =>
            (user?.email && o.userEmail?.toLowerCase() === user.email.toLowerCase()) ||
            (userId && o.user === userId)
        );
        setHistory(userOnly.sort((a, b) => b.timestamp - a.timestamp));
      } catch (e) {
        setHistory([]);
      }
    }
  }, [user?.email, userId]);

  const fetchOrders = useCallback(async () => {
    if (!user?.email && !userId) {
      setHistory([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      let res;
      if (user?.email) {
        res = await fetch(`${API_BASE_URL}/api/orders/user/${encodeURIComponent(user.email)}`);
      } else {
        res = await fetch(`${API_BASE_URL}/api/orders?userId=${encodeURIComponent(String(userId))}`);
      }

      const data = await res.json();

      if (data.success && Array.isArray(data.orders)) {
        const normalizedOrders: Order[] = data.orders.map((item: any) => {
          const createdTime = item.createdAt ? new Date(item.createdAt).getTime() : Date.now();
          return {
            ...item,
            orderId: item.orderId || item._id,
            timestamp: item.timestamp || createdTime,
            date:
              item.date ||
              new Date(createdTime).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
          };
        });

        normalizedOrders.sort((a, b) => b.timestamp - a.timestamp);
        setHistory(normalizedOrders);
      } else {
        loadLocalHistory();
      }
    } catch (error) {
      console.warn("Could not reach backend API, falling back to local storage.", error);
      loadLocalHistory();
    } finally {
      setLoading(false);
    }
  }, [user?.email, userId, loadLocalHistory]);

  useEffect(() => {
    fetchOrders();
    const timer = setInterval(() => setNow(Date.now()), 1000);
    window.addEventListener("chirp_order_placed", fetchOrders);
    return () => {
      clearInterval(timer);
      window.removeEventListener("chirp_order_placed", fetchOrders);
    };
  }, [fetchOrders]);

  const deleteOrderLocally = useCallback(
    (orderId: string, isDelivered: boolean) => {
      if (!isDelivered) {
        alert("Active delivery in progress. Cannot hide this receipt right now.");
        return;
      }
      if (confirm("Hide this order from your history? (Order will remain saved in database)")) {
        setClearedOrderIds((prev) => {
          const newCleared = [...prev, orderId];
          const userIdentifier = user?.email || userId;
          if (userIdentifier) {
            localStorage.setItem(
              `cleared_orders_${userIdentifier}`,
              JSON.stringify(newCleared)
            );
          }
          return newCleared;
        });
      }
    },
    [user?.email, userId]
  );

  const wipeCompletedHistoryLocally = () => {
    const deliveredIds = visibleHistory
      .filter((order) => {
        const progressVal = ((now - order.timestamp) / 120000) * 100;
        return order.status === "Delivered" || progressVal >= 100;
      })
      .map((o) => o.orderId);

    if (deliveredIds.length === 0) {
      alert("No completed orders to clear.");
      return;
    }

    if (confirm("Clear all completed orders from view? Active deliveries will stay.")) {
      const newCleared = [...clearedOrderIds, ...deliveredIds];
      setClearedOrderIds(newCleared);
      const userIdentifier = user?.email || userId;
      if (userIdentifier) {
        localStorage.setItem(`cleared_orders_${userIdentifier}`, JSON.stringify(newCleared));
      }
    }
  };

  const visibleHistory = history.filter((o) => !clearedOrderIds.includes(o.orderId));

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6 pt-24 pb-32 font-sans text-[#4A453E]">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex justify-between items-end border-b border-[#E5E0D8] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-[#EAB308]" />
              <p className="text-[10px] text-[#A39E93] uppercase font-bold tracking-[0.3em]">
                {user?.name ? `${user.name}'s Receipts` : "Session Receipts"}
              </p>
            </div>
            <h1 className="text-3xl font-extrabold text-[#2C2825] tracking-tight">
              Order <span className="text-[#F472B6]">History</span>
            </h1>
          </div>
          {visibleHistory.length > 0 && (
            <button
              onClick={wipeCompletedHistoryLocally}
              className="px-4 py-2 bg-[#FFFDF9] text-[#78716C] border border-[#E5E0D8] text-[11px] font-bold tracking-wide rounded-xl hover:bg-[#F472B6] hover:text-white hover:border-[#F472B6] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Trash2 size={12} />
              Clear Past
            </button>
          )}
        </header>

        {/* Loading Indicator */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#FFFDF9] rounded-3xl border border-[#E5E0D8]">
            <Loader2 className="w-8 h-8 text-[#EAB308] animate-spin mb-2" />
            <p className="text-xs text-[#A39E93] font-medium">Fetching your orders from server...</p>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-8">
            {visibleHistory.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center bg-[#FFFDF9] rounded-3xl border border-[#E5E0D8] shadow-sm"
              >
                <div className="w-20 h-20 bg-[#FAF7F2] rounded-full flex items-center justify-center mb-5 border border-[#E5E0D8]">
                  <ShoppingBag size={30} className="text-[#A39E93]" />
                </div>
                <h2 className="text-lg font-bold text-[#2C2825] tracking-tight mb-1">
                  No Past Orders Found
                </h2>
                <p className="text-xs text-[#A39E93] mb-6 max-w-[220px]">
                  Your fresh orders and active deliveries will show up right here.
                </p>
                <button
                  onClick={() => router.push("/explore")}
                  className="px-6 py-3 bg-[#EAB308] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#D97706] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Zap size={14} className="fill-white" />
                  Browse Menu
                </button>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                {visibleHistory.map((order) => (
                  <OrderHistoryItem
                    key={order.orderId || order._id}
                    order={order}
                    now={now}
                    isActiveMap={!!activeMaps[order.orderId]}
                    onToggleMap={() =>
                      setActiveMaps((p) => ({ ...p, [order.orderId]: !p[order.orderId] }))
                    }
                    onDelete={deleteOrderLocally}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        )}
      </div>
    </div>
  );
}