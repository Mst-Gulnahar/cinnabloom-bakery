"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Trash2, Minus, Plus, X, 
  MapPin, Loader2, Search, Zap, 
  Eraser, AlertTriangle
} from "lucide-react";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface OrderTrackerProps {
  address: string;
  destination: [number, number];
  initialProgress: number;
}

const OrderTracker = dynamic<OrderTrackerProps>(() => import("./OrderTracker"), { 
  ssr: false,
  loading: () => (
    <div className="h-48 w-full bg-[#FDF6E3] animate-pulse rounded-2xl flex flex-col items-center justify-center border-2 border-[#4A2C2A] border-dashed">
      <Loader2 className="animate-spin text-[#4A2C2A] mb-2" size={20} />
      <span className="text-[10px] font-black text-[#4A2C2A] uppercase tracking-widest">Locating Your Bakery Cart...</span>
    </div>
  )
}); 

export interface CartItem {
  _id: string;
  foodId?: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  accent?: string;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void; 
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onClearCart: () => void; 
  total: number;
  userId?: string;
  userEmail?: string;
  userName?: string;
}

// FLOATING RECEIPT MEMO
function FloatingMemo({ items, total, onOpen }: { items: CartItem[], total: number, onOpen: () => void }) {
  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: 8 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      whileHover={{ scale: 1.05, rotate: 0 }}
      onClick={onOpen}
      className="fixed bottom-24 right-6 z-[9990] cursor-pointer group"
    >
      <div className="bg-[#FDF6E3] border-[3px] border-[#4A2C2A] p-4 shadow-[6px_6px_0px_0px_#4A2C2A] rounded-2xl w-52 overflow-hidden relative font-serif">
        <div className="text-[9px] font-black text-[#4A2C2A] uppercase tracking-widest mb-2 border-b-2 border-dashed border-[#4A2C2A]/20 pb-1 flex justify-between items-center">
          <span>Fresh Order</span>
          <ShoppingBag size={12} className="text-[#C84B31]" />
        </div>
        <div className="space-y-1 mb-3 max-h-[80px] overflow-y-auto pr-1 scrollbar-hide">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between text-[10px] font-bold text-[#4A2C2A]/80">
              <span className="truncate max-w-[70%]">{item.qty}x {item.name}</span>
              <span className="text-[#C84B31]">৳{(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-2 border-t-2 border-[#4A2C2A]/20">
          <span className="text-[10px] font-black text-[#4A2C2A] uppercase">TOTAL</span>
          <span className="text-xs font-black text-[#C84B31]">৳{(total + 2.50).toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  );
}

// LOCATION SEARCH
function LocationSearch({ onSelect, disabled }: { onSelect: (addr: string, lat: number, lon: number) => void, disabled?: boolean }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    if (isSelected || query.length < 3 || disabled) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=bd&limit=6&addressdetails=1`
        );
        const data = await res.json();
        setSuggestions(data);
        setShowDropdown(true);
      } catch (err) {
        console.error("Geocoding failed", err);
      } finally {
        setLoading(false);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [query, isSelected, disabled]);

  return (
    <div className="relative space-y-1.5 font-serif">
      <label className="text-[10px] font-black text-[#4A2C2A] uppercase tracking-wider ml-1 flex items-center gap-1">
        <MapPin size={12} className="text-[#C84B31]" /> Delivery Address
      </label>
      <div className="relative">
        <MapPin className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isSelected ? 'text-[#3B7A57]' : 'text-[#4A2C2A]/50'}`} size={16} />
        <input
          type="text"
          disabled={disabled}
          placeholder="Where should we send your rolls?"
          value={query}
          onChange={(e) => { 
            setIsSelected(false); 
            setQuery(e.target.value); 
            if(e.target.value === "") onSelect("", 0, 0); 
          }}
          className={`w-full pl-10 pr-10 py-3 bg-[#FFFDF5] border-[2.5px] border-[#4A2C2A] text-[#4A2C2A] rounded-2xl text-xs font-sans font-bold placeholder-[#4A2C2A]/40 focus:outline-none transition-all shadow-[3px_3px_0px_0px_#4A2C2A] ${isSelected ? 'border-[#3B7A57]' : 'focus:border-[#C84B31]'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {loading && <Loader2 className="animate-spin text-[#4A2C2A]/60" size={14} />}
          {query.length > 0 && !disabled && (
            <button onClick={() => {setQuery(""); setIsSelected(false); onSelect("",0,0);}} className="text-[#4A2C2A]/40 hover:text-[#4A2C2A] p-1"><X size={14}/></button>
          )}
        </div>
      </div>
      <AnimatePresence>
        {showDropdown && !isSelected && suggestions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-[10001] w-full bg-[#FDF6E3] border-[2.5px] border-[#4A2C2A] rounded-2xl shadow-[6px_6px_0px_0px_#4A2C2A] mt-1 overflow-y-auto max-h-[180px] scrollbar-hide">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  const lat = parseFloat(s.lat);
                  const lon = parseFloat(s.lon);
                  const finalLat = (lat > 18 && lat < 28) ? lat : lon;
                  const finalLon = (lon > 85 && lon < 95) ? lon : lat;

                  onSelect(s.display_name, finalLat, finalLon);
                  setQuery(s.display_name);
                  setIsSelected(true);
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2.5 text-[10px] font-sans font-bold text-[#4A2C2A] hover:bg-[#4A2C2A]/10 border-b border-[#4A2C2A]/10 last:border-0 flex items-start gap-2"
              >
                <Search size={12} className="shrink-0 text-[#C84B31] mt-0.5" />
                <span className="leading-tight">{s.display_name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// MAIN CART COMPONENT
export default function Cart({ 
  isOpen, onClose, onOpen, items, onUpdateQuantity, onRemove, onClearCart, total,
  userId, userEmail, userName
}: CartProps) {
  const { user: authUser } = useAuth(); // Context fallback
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [mounted, setMounted] = useState(false);
  const [tempQty, setTempQty] = useState<{ [key: string]: string }>({});
  const [isErrorShake, setIsErrorShake] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derive identity from props or active AuthContext
  const activeEmail = userEmail || authUser?.email;
  const activeUserId = userId || authUser?.id || authUser?._id;
  const activeUserName = userName || authUser?.name || "Bakery Customer";

  useEffect(() => { setMounted(true); }, []);

  const handleManualQtyChange = (id: string, val: string, currentQty: number) => {
    setTempQty(prev => ({ ...prev, [id]: val }));
    if (val === '') return;

    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed < 100) {
      const delta = parsed - currentQty;
      if (delta !== 0) {
        onUpdateQuantity(id, delta);
      }
    }
  };

  const handleQtyBlur = (id: string, currentQty: number) => {
    const rawVal = tempQty[id];
    if (rawVal === undefined) return;

    const parsed = parseInt(rawVal, 10);
    if (isNaN(parsed) || parsed <= 0) {
      setTempQty(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleCheckout = async () => {
    if (!coords || !address || items.length === 0) {
      setIsErrorShake(true);
      setTimeout(() => setIsErrorShake(false), 500);
      return;
    }

    if (!activeEmail) {
      alert("Please log in first to place an order and save it to your account!");
      return;
    }

    setIsSubmitting(true);
    const deliveryFee = 2.50;

    try {
      const formattedItems = items.map(item => ({
        foodId: item.foodId || item._id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        image: item.image
      }));

      const payload = {
        user: activeUserId || undefined,
        userId: activeUserId || undefined,
        userEmail: activeEmail,
        userName: activeUserName,
        items: formattedItems,
        subtotal: total,
        deliveryFee,
        total: total + deliveryFee,
        address,
        destination: coords,
      };

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onClearCart();
        setAddress("");
        setCoords(null);
        onClose();
        
        // Notify order history page to reload immediately
        window.dispatchEvent(new Event("chirp_order_placed"));
        alert("✨ Order Received! Our bakers are getting your fresh cinnamon rolls ready.");
      } else {
        alert(data.message || "Failed to place order.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Could not reach the server. Make sure your Express backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  const deliveryFee = items.length > 0 ? 2.50 : 0;

  return (
    <>
      <AnimatePresence>
        {!isOpen && onOpen && <FloatingMemo items={items} total={total} onOpen={onOpen} />}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={onClose} 
              className="fixed inset-0 bg-[#4A2C2A]/40 backdrop-blur-sm z-[9998] cursor-pointer" 
            />

            {/* Cart Drawer */}
            <motion.div
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-[#FDF6E3] text-[#4A2C2A] font-serif z-[9999] flex flex-col border-l-[3.5px] border-[#4A2C2A] shadow-[-10px_0_30px_rgba(74,44,42,0.2)]"
            >
              {/* Header */}
              <div className="p-6 border-b-[3px] border-[#4A2C2A] flex justify-between items-center bg-[#FDF6E3]">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={22} className="text-[#C84B31]" />
                  <h2 className="text-2xl italic font-bold tracking-tight lowercase">your treat bag</h2>
                </div>
                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <button 
                      onClick={onClearCart} 
                      title="Clear Bag" 
                      className="p-2 hover:bg-[#4A2C2A]/10 rounded-full text-[#4A2C2A] transition-colors"
                    >
                      <Eraser size={18} />
                    </button>
                  )}
                  <button 
                    onClick={onClose} 
                    className="p-2 hover:bg-[#4A2C2A]/10 rounded-full transition-colors"
                  >
                    <X size={22} className="text-[#4A2C2A]" />
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="flex-grow overflow-y-auto p-6 space-y-4 scrollbar-hide bg-[#FDF6E3]">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="opacity-20 mb-4">
                      <ShoppingBag size={70} className="text-[#4A2C2A]" />
                    </motion.div>
                    <p className="italic text-base font-bold text-[#4A2C2A]/60">Your treat bag is empty</p>
                    <p className="text-xs font-sans text-[#4A2C2A]/50 mt-1 max-w-[200px]">Add some gooey cinnamon rolls to start your order!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div 
                        layout 
                        key={item._id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative flex gap-4 bg-[#FFFDF5] p-3.5 rounded-[24px] border-[2.5px] border-[#4A2C2A] shadow-[4px_4px_0px_0px_#4A2C2A] group"
                      >
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-[16px] border border-[#4A2C2A]/20 bg-white/50 p-1">
                          <Image src={item.image} alt={item.name} fill className="object-contain" unoptimized />
                        </div>
                        <div className="flex flex-col justify-between py-0.5 flex-grow">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold italic text-[#4A2C2A] text-base lowercase leading-tight">{item.name}</h3>
                            <button 
                              onClick={() => onRemove(item._id)} 
                              className="text-[#4A2C2A]/30 hover:text-[#C84B31] transition-colors p-0.5"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center bg-[#FDF6E3] border-[2px] border-[#4A2C2A] rounded-full overflow-hidden shadow-[2px_2px_0px_0px_#4A2C2A]">
                              <button 
                                onClick={() => onUpdateQuantity(item._id, -1)} 
                                className="px-2 py-0.5 text-[#4A2C2A] hover:bg-[#4A2C2A]/10 transition-colors"
                              >
                                <Minus size={11} strokeWidth={3} />
                              </button>
                              <input 
                                type="number" 
                                value={tempQty[item._id] ?? item.qty}
                                onChange={(e) => handleManualQtyChange(item._id, e.target.value, item.qty)}
                                onBlur={() => handleQtyBlur(item._id, item.qty)}
                                className="w-7 text-center font-black text-xs font-sans bg-transparent text-[#4A2C2A] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                              />
                              <button 
                                onClick={() => onUpdateQuantity(item._id, 1)} 
                                className="px-2 py-0.5 text-[#4A2C2A] hover:bg-[#4A2C2A]/10 transition-colors"
                              >
                                <Plus size={11} strokeWidth={3} />
                              </button>
                            </div>
                            
                            <span className="font-black text-[#4A2C2A] text-sm">
                              ৳{(item.price * item.qty).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer / Checkout */}
              {items.length > 0 && (
                <div className="p-6 bg-[#FDF6E3] border-t-[3px] border-[#4A2C2A] space-y-4 shadow-[0_-6px_20px_rgba(74,44,42,0.08)]">
                  <LocationSearch onSelect={(addr, lat, lon) => { setAddress(addr); setCoords([lat, lon]); }} />
                  
                  {/* Summary */}
                  <div className="bg-[#FFFDF5] p-4 rounded-2xl border-[2.5px] border-[#4A2C2A] space-y-2 font-sans">
                    <div className="flex justify-between text-xs font-semibold text-[#4A2C2A]/70">
                      <span>Subtotal</span>
                      <span className="font-bold">৳{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-[#4A2C2A]/70">
                      <span>Standard Delivery</span>
                      <span className="font-bold">৳{deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-end pt-2 border-t border-[#4A2C2A]/15 font-serif">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-[#4A2C2A] uppercase tracking-wider">Total</span>
                        <span className="text-2xl font-black text-[#4A2C2A]">৳{(total + deliveryFee).toFixed(2)}</span>
                      </div>
                      <span className="text-[9px] font-sans font-bold text-[#4A2C2A]/50 uppercase tracking-tight">
                        Cash on Delivery
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <motion.button 
                    animate={isErrorShake ? { x: [-5, 5, -5, 5, 0] } : {}}
                    onClick={handleCheckout}
                    disabled={isSubmitting || !coords || !address}
                    className={`w-full py-3.5 rounded-full font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border-[3px] border-[#4A2C2A] ${
                      coords && address && !isSubmitting
                        ? "bg-[#4A2C2A] text-[#FDF6E3] shadow-[5px_5px_0px_0px_#C84B31] hover:translate-y-0.5 active:translate-y-1 active:shadow-none" 
                        : "bg-[#4A2C2A]/10 text-[#4A2C2A]/40 border-[#4A2C2A]/30 cursor-not-allowed"
                    }`}
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin text-[#FDF6E3]" size={16} />
                    ) : coords && address ? (
                      <Zap size={16} fill="currentColor" />
                    ) : (
                      <AlertTriangle size={16} />
                    )}
                    {isSubmitting ? "Placing Order..." : coords && address ? "Place Bakery Order" : "Select Address First"}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}