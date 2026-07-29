"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Eye, Loader2, Search, ArrowRight, ShoppingBag, Check, ChevronDown, Sparkles, Clock, Flame, Cookie, Users, PackageCheck, Gift, Tag, Quote } from 'lucide-react'; 
import Link from 'next/link';
import Image from 'next/image';
import Cart, { CartItem } from './components/Cart'; 
import { useAuth } from '../context/AuthContext';

export interface Category {
  category_id: string;
  category_name: string;
}

export interface Product {
  product_id: string;
  product_name: string;
  product_price: number;
  product_description: string;
  img_url: string;
  category_id: string;
  is_featured?: boolean | number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const SHOOTING_STARS = [
  {
    id: 1,
    img: "/images/star.png",
    xPath: ["-20vw", "50vw", "120vw"],
    yPath: ["5vh", "38vh", "80vh"],
    duration: 7,
    delay: 0,
    size: "w-10 h-10",
    isRightToLeft: false,
  },
  {
    id: 2,
    img: "/images/star-2.png",
    xPath: ["120vw", "50vw", "-20vw"],
    yPath: ["8vh", "40vh", "85vh"],
    duration: 8,
    delay: 3.5,
    size: "w-12 h-12",
    isRightToLeft: true,
  },
  {
    id: 3,
    img: "/images/star-3.png",
    xPath: ["-20vw", "45vw", "120vw"],
    yPath: ["15vh", "45vh", "90vh"],
    duration: 6.5,
    delay: 6.8,
    size: "w-9 h-9",
    isRightToLeft: false,
  },
];

const BAKERY_FAQS = [
  {
    question: "When is the best time to visit or order for hot, fresh rolls?",
    answer: "Our main oven drops happen daily at 8:00 AM and 1:00 PM. If you order for pick-up during these windows, your rolls will be fresh out of the pan!"
  },
  {
    question: "How long do Cinnabloom rolls stay fresh at home?",
    answer: "At room temperature, they stay soft for 3 days in an airtight box. Pop them in the microwave for 15 seconds to recreate that gooey oven-fresh texture."
  },
  {
    question: "Do you have options for dietary restrictions (Vegan / Nut-Free)?",
    answer: "Yes! All our standard cinnamon rolls are 100% peanut and tree-nut free. We also feature daily vegan brioche options labeled in our Flavor Library."
  },
  {
    question: "How far in advance should I order catering party boxes?",
    answer: "For orders over 30 pieces or custom event towers, we recommend placing your order at least 48 hours in advance so our bakers can prepare fresh dough batches."
  },
  {
    question: "Can I freeze the rolls for later?",
    answer: "Definitely. Freeze them un-iced for up to 1 month. When ready, thaw at room temperature and warm in a 350°F (175°C) oven for 5 minutes before icing."
  }
];

const FROSTINGS = [
  { id: 'cream-cheese', name: 'Classic Cream Cheese', price: 0.00 },
  { id: 'salted-caramel', name: 'Salted Bourbon Caramel', price: 0.75 },
  { id: 'espresso-glaze', name: 'Dark Roast Espresso', price: 0.75 },
  { id: 'matcha-cream', name: 'Uji Matcha Drizzle', price: 1.00 },
];

const TOPPINGS = [
  { id: 'pecans', name: 'Toasted Pecans', price: 0.50 },
  { id: 'cookie-crumbs', name: 'Biscoff Cookie Crumbs', price: 0.50 },
  { id: 'sea-salt', name: 'Maldon Flake Salt', price: 0.25 },
  { id: 'berries', name: 'Freeze-Dried Strawberries', price: 0.75 },
];

const MYSTERY_OFFERS = [
  { code: "SWEET15", text: "15% OFF Your Entire Order!" },
  { code: "FREEGLAZE", text: "Free Extra Dip Icing Included!" },
  { code: "FREESHIP", text: "Free Local Bakery Delivery!" }
];

const BAKERY_REVIEWS = [
  {
    name: "Samantha L.",
    role: "Regular Sweet Tooth",
    text: "The Espresso Glaze roll completely redefined my weekend mornings. Perfectly soft and gooey in the center!",
    stars: 5,
    tag: "Verified Buyer"
  },
  {
    name: "David K.",
    role: "Event Organizer",
    text: "We ordered 4 party boxes for our office launch event. Arrived piping warm and every single roll was gone in 10 minutes.",
    stars: 5,
    tag: "Catering Customer"
  },
  {
    name: "Elena R.",
    role: "Pastry Enthusiast",
    text: "You can genuinely taste the Ceylon cinnamon quality. The classic cream cheese icing is not overly sweet—just perfection.",
    stars: 5,
    tag: "Local Foodie"
  }
];

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [selectedFrosting, setSelectedFrosting] = useState(FROSTINGS[0]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>(['pecans']);

  const [revealedOffer, setRevealedOffer] = useState<{ code: string; text: string } | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [addedItemAnimation, setAddedItemAnimation] = useState<string | null>(null);

  // --- FORCE RESET BODY OVERFLOW ON PAGE MOUNT ---
  useEffect(() => {
    document.body.style.overflow = "unset";
  }, []);

  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/foods`);
        if (!response.ok) {
          throw new Error(`Failed to fetch foods: ${response.statusText}`);
        }
        
        const rawData = await response.json();
        const items = Array.isArray(rawData) ? rawData : rawData.data || [];

        const mappedProducts: Product[] = items.map((item: any) => ({
          product_id: item._id || item.product_id,
          product_name: item.product_name,
          product_price: Number(item.product_price) || 0,
          product_description: item.product_description,
          img_url: item.img_url,
          category_id: item.category_id || 'general',
          is_featured: item.is_featured,
        }));

        setProducts(mappedProducts);

        const uniqueCategories = Array.from(
          new Set(mappedProducts.map((p) => p.category_id))
        ).map((catId) => ({
          category_id: catId,
          category_name: catId.replace('cat-', '').replace(/-/g, ' ').toUpperCase(),
        }));

        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Backend fetch error:", err);
        setError("Could not load the bakery menu. Make sure the server is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchBackendData();
  }, []);

  const handleAddToCart = (product: Product) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.foodId === product.product_id);
      if (existing) {
        return prevItems.map((item) =>
          item.foodId === product.product_id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [
        ...prevItems,
        {
          _id: product.product_id,
          foodId: product.product_id,
          name: product.product_name,
          price: product.product_price,
          image: product.img_url,
          qty: 1,
          accent: "#4A2C2A",
        },
      ];
    });

    setAddedItemAnimation(product.product_id);
    setTimeout(() => setAddedItemAnimation(null), 1200);
  };

  const handleCustomOrder = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    const customProduct: Product = {
      product_id: `custom-${Date.now()}`,
      product_name: `Custom Roll (${selectedFrosting.name})`,
      product_price: calculatedCustomPrice,
      product_description: `Customized with ${selectedFrosting.name} and ${selectedToppings.length} topping(s).`,
      img_url: '/images/hero.png',
      category_id: 'custom'
    };

    handleAddToCart(customProduct);
    setIsCartOpen(true);
  };

  const toggleTopping = (toppingId: string) => {
    if (selectedToppings.includes(toppingId)) {
      setSelectedToppings(selectedToppings.filter((id) => id !== toppingId));
    } else {
      setSelectedToppings([...selectedToppings, toppingId]);
    }
  };

  const calculatedCustomPrice = 5.50 + selectedFrosting.price + selectedToppings.reduce((acc, tId) => {
    const t = TOPPINGS.find((item) => item.id === tId);
    return acc + (t ? t.price : 0);
  }, 0);

  const handleRevealOffer = () => {
    if (!revealedOffer) {
      const randomOffer = MYSTERY_OFFERS[Math.floor(Math.random() * MYSTERY_OFFERS.length)];
      setRevealedOffer(randomOffer);
    }
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item._id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  const handleClearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCat ? p.category_id === activeCat : true;
    const matchesSearch = p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.product_description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayedProducts = filteredProducts.slice(0, 6);
  const createSlug = (name: string): string => name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  return (
    <div className="min-h-screen font-serif text-[#4A2C2A] bg-[#FDF6E3]">
      
      {/* SVG Clip Path */}
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
          <clipPath id="wave-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.008 C 0.15,0.016 0.35,0.000 0.5,0.008 C 0.65,0.016 0.85,0.000 1,0.008 L 1,1 L 0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCartOpen(true)}
          className="relative bg-[#4A2C2A] text-[#FDF6E3] p-4 rounded-full border-2 border-[#FDF6E3] shadow-2xl flex items-center justify-center hover:bg-[#382120] transition-colors"
          aria-label="Open cart"
        >
          <ShoppingBag size={24} />
          {totalCartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#C84B31] text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#FDF6E3] shadow-md">
              {totalCartCount}
            </span>
          )}
        </motion.button>
      </div>

      {/* Hero Header */}
      <header className="relative min-h-[75vh] flex flex-col items-center justify-center overflow-hidden px-6 z-10 pb-24 md:pb-28">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.png"
            alt="Cinnabloom Fresh Cinnamon Rolls"
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover object-center"
            style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
          />
          <div className="absolute inset-0 bg-[#FDF6E3]/10 z-10" />
        </div>

        {/* Shooting Stars Animation */}
        <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden">
          {SHOOTING_STARS.map((star) => (
            <motion.div
              key={star.id}
              initial={{ left: star.xPath[0], top: star.yPath[0], opacity: 0, scale: 0.8 }}
              animate={{
                left: star.xPath,
                top: star.yPath,
                opacity: [0, 1, 1, 1, 0],
                scale: [0.8, 1, 1, 1, 0.8],
              }}
              transition={{ duration: star.duration, repeat: Infinity, repeatDelay: 2, delay: star.delay, ease: "linear" }}
              className="absolute flex items-center justify-center"
            >
              {[-12, -28, -48, -70, -96].map((offset, idx) => (
                <motion.div
                  key={idx}
                  className="absolute rounded-full bg-[#FFFDF5]"
                  style={{
                    [star.isRightToLeft ? 'left' : 'right']: `${Math.abs(offset)}px`,
                    width: `${Math.max(2, 6 - idx)}px`,
                    height: `${Math.max(2, 6 - idx)}px`,
                    boxShadow: '0 0 10px 3px rgba(255, 245, 210, 0.9)',
                  }}
                  animate={{ opacity: [0, 0.9, 0], scale: [0.5, 1.4, 0.2] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: idx * 0.1 }}
                />
              ))}
              <motion.img
                src={star.img}
                alt="Shooting star"
                className={`${star.size} drop-shadow-[0_0_16px_rgba(255,255,255,0.95)] relative z-10`}
                animate={{ rotate: star.isRightToLeft ? -360 : 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -10, 0] }}
          transition={{ opacity: { duration: 0.8 }, y: { repeat: Infinity, duration: 4.5, ease: "easeInOut" } }}
          className="relative z-20 text-center bg-[#FDF6E3]/95 p-8 md:p-12 rounded-[35px] border-[3px] border-[#4A2C2A] shadow-xl max-w-xl my-auto"
        >
          <p className="uppercase tracking-[0.4em] text-[9px] font-black mb-3">Unroll the magic with</p>
          <h2 className="text-5xl md:text-7xl italic mb-8 tracking-tighter leading-none">Cinnabloom</h2>
          <button className="bg-[#4A2C2A] text-[#FDF6E3] px-10 py-3 rounded-full text-[10px] uppercase tracking-widest font-black hover:scale-105 transition-all shadow-md">
            Magic Awaits
          </button>
          <img src="/images/bow.png" className="absolute -top-12 -right-12 w-32 h-32 rotate-12 drop-shadow-md hidden md:block" alt="sticker" />
        </motion.div>
      </header>

      {/* Main Content */}
      <main 
        className="relative z-20 -mt-20 md:-mt-24 bg-repeat pt-20 md:pt-28 pb-16"
        style={{ 
          backgroundImage: "url('/images/bg.png')",
          backgroundSize: '500px auto',
          clipPath: 'url(#wave-clip)',
          WebkitClipPath: 'url(#wave-clip)',
        }}
      >
        <div className="absolute inset-0 bg-[#FDF6E3]/60 pointer-events-none z-0" />

        <div className="relative z-10">

          {/* Flavor Library */}
          <section className="pb-24 pt-12 md:pt-16 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col items-center mb-8">
              <h3 className="text-4xl italic font-bold lowercase tracking-tighter">flavor library</h3>
              <div className="h-[2px] w-12 bg-[#4A2C2A] mt-2 opacity-30"></div>
            </div>

            <div className="max-w-md mx-auto mb-8 relative">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search cozy treats & flavors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FDF6E3] border-[3px] border-[#4A2C2A] rounded-full py-3 pl-12 pr-6 text-xs font-sans font-semibold placeholder-[#4A2C2A]/50 focus:outline-none shadow-[4px_4px_0px_0px_#4A2C2A] transition-all"
                />
                <Search size={18} className="absolute left-4 text-[#4A2C2A]/70" />
              </div>
            </div>

            {categories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 mb-16">
                <button
                  onClick={() => setActiveCat(null)}
                  className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border-[3px] border-[#4A2C2A] ${
                    activeCat === null 
                    ? 'bg-[#4A2C2A] text-[#FDF6E3] shadow-none translate-y-1' 
                    : 'bg-[#FDF6E3] text-[#4A2C2A] shadow-[4px_4px_0px_0px_#4A2C2A] hover:-translate-y-0.5'
                  }`}
                >
                  All Treats
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.category_id}
                    onClick={() => setActiveCat(cat.category_id)}
                    className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border-[3px] border-[#4A2C2A] ${
                      activeCat === cat.category_id 
                      ? 'bg-[#4A2C2A] text-[#FDF6E3] shadow-none translate-y-1' 
                      : 'bg-[#FDF6E3] text-[#4A2C2A] shadow-[4px_4px_0px_0px_#4A2C2A] hover:-translate-y-0.5'
                    }`}
                  >
                    {cat.category_name}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-[#4A2C2A]" />
                <p className="italic text-sm font-semibold opacity-70">Baking the freshest rolls from backend...</p>
              </div>
            )}

            {error && !loading && (
              <div className="text-center py-16 bg-[#FDF6E3] border-[3px] border-[#C84B31] rounded-[30px] p-8 max-w-md mx-auto shadow-[6px_6px_0px_0px_#C84B31]">
                <p className="text-sm font-bold text-[#C84B31] mb-2">Oops!</p>
                <p className="text-xs font-sans opacity-80">{error}</p>
              </div>
            )}

            {!loading && !error && (
              <>
                <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <AnimatePresence mode='popLayout'>
                    {displayedProducts.map((roll) => {
                      const productUrl = `/details/${createSlug(roll.product_name)}`;
                      const isAdded = addedItemAnimation === roll.product_id;

                      return (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          key={roll.product_id}
                          whileHover={{ y: -8 }}
                          className="bg-[#FDF6E3] border-[3px] border-[#4A2C2A] rounded-[35px] p-6 shadow-[8px_8px_0px_0px_#4A2C2A] relative group h-full flex flex-col z-10"
                        >
                          {Boolean(roll.is_featured) && (
                            <div className="absolute -top-3 -left-3 bg-[#C84B31] text-white px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter border-2 border-[#4A2C2A] rotate-[-5deg] z-20 shadow-sm">
                              Baker's Pick ✨
                            </div>
                          )}

                          <div className="absolute -top-3 -right-3 bg-[#4A2C2A] text-[#FDF6E3] w-14 h-14 rounded-full flex items-center justify-center font-black text-[10px] rotate-12 border-2 border-[#FDF6E3] shadow-md z-10">
                            ${roll.product_price.toFixed(2)}
                          </div>

                          <Link href={productUrl} className="w-full aspect-square bg-white/70 rounded-[25px] border-2 border-[#4A2C2A]/10 mb-6 overflow-hidden flex items-center justify-center p-8 cursor-pointer">
                            <motion.img 
                              whileHover={{ scale: 1.08, rotate: 3 }}
                              src={roll.img_url} 
                              alt={roll.product_name}
                              className="w-full h-full drop-shadow-xl object-contain"
                            />
                          </Link>

                          <h4 className="text-2xl italic font-bold lowercase tracking-tighter mb-2">{roll.product_name}</h4>
                          <p className="text-xs font-sans font-medium opacity-80 leading-relaxed mb-8 line-clamp-2">
                            {roll.product_description}
                          </p>

                          <div className="mt-auto space-y-3">
                            <button 
                              onClick={() => handleAddToCart(roll)}
                              className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm ${
                                isAdded 
                                  ? 'bg-[#C84B31] text-white' 
                                  : 'bg-[#4A2C2A] text-[#FDF6E3] hover:bg-[#4A2C2A]/90'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check size={16} strokeWidth={3} />
                                  <span className="uppercase text-[10px] font-black tracking-widest">Added!</span>
                                </>
                              ) : (
                                <>
                                  <Plus size={16} strokeWidth={3} />
                                  <span className="uppercase text-[10px] font-black tracking-widest">Add to Bag</span>
                                </>
                              )}
                            </button>
                            
                            <Link href={productUrl} className="w-full border-2 border-[#4A2C2A]/20 text-[#4A2C2A] py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#4A2C2A]/5 transition-all uppercase text-[9px] font-black tracking-[0.2em]">
                              <Eye size={14} /> View Details
                            </Link>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>

                <div className="mt-16 text-center">
                  <Link href="/explore">
                    <button className="inline-flex items-center gap-3 bg-[#FDF6E3] text-[#4A2C2A] border-[3px] border-[#4A2C2A] px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_#4A2C2A] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#4A2C2A] active:translate-y-0.5 active:shadow-none transition-all">
                      <span>Explore All Treats</span>
                      <ArrowRight size={16} strokeWidth={3} />
                    </button>
                  </Link>
                </div>
              </>
            )}
          </section>

          {/* Roll Customizer */}
          <section className="py-24 px-6 border-t-[3px] border-[#4A2C2A]/10 bg-[#FDF6E3]/50">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <span className="bg-[#C84B31] text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                  Interactive Kitchen
                </span>
                <h3 className="text-4xl italic font-bold lowercase tracking-tighter mt-3">build your dream roll</h3>
                <p className="text-xs font-sans uppercase font-bold tracking-[0.2em] opacity-60 mt-1">Pick your glaze & toppings for instant baking</p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center bg-[#FDF6E3] p-8 md:p-12 border-[3px] border-[#4A2C2A] rounded-[40px] shadow-[10px_10px_0px_0px_#4A2C2A]">
                
                <div className="flex flex-col items-center justify-center bg-white/60 p-8 rounded-[30px] border-2 border-[#4A2C2A]/10 text-center relative overflow-hidden">
                  <Sparkles className="absolute top-4 right-4 text-[#C84B31] animate-pulse" size={24} />
                  <motion.div 
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 6 }}
                    className="w-48 h-48 relative mb-6 flex items-center justify-center"
                  >
                    <Cookie className="w-full h-full text-[#4A2C2A]" strokeWidth={1.2} />
                  </motion.div>
                  <h4 className="text-2xl italic font-bold">Custom Roll Base</h4>
                  <p className="text-xs font-sans opacity-70 mt-1">Warm Brioche Roll + Ceylon Cinnamon</p>
                  
                  <div className="mt-6 pt-4 border-t border-[#4A2C2A]/10 w-full flex items-center justify-between">
                    <span className="text-xs font-sans font-bold uppercase tracking-wider">Estimated Price:</span>
                    <span className="text-2xl font-black text-[#C84B31]">${calculatedCustomPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-sans font-black uppercase tracking-widest mb-3">1. Select Icing / Frosting</label>
                    <div className="grid grid-cols-1 gap-2">
                      {FROSTINGS.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setSelectedFrosting(f)}
                          className={`p-3 rounded-2xl text-xs font-sans font-semibold flex items-center justify-between border-2 transition-all ${
                            selectedFrosting.id === f.id
                              ? 'bg-[#4A2C2A] text-[#FDF6E3] border-[#4A2C2A]'
                              : 'bg-white/80 border-[#4A2C2A]/20 hover:border-[#4A2C2A]'
                          }`}
                        >
                          <span>{f.name}</span>
                          <span>{f.price === 0 ? 'Free' : `+$${f.price.toFixed(2)}`}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-black uppercase tracking-widest mb-3">2. Add Extra Crunch & Toppings</label>
                    <div className="grid grid-cols-2 gap-2">
                      {TOPPINGS.map((t) => {
                        const isSelected = selectedToppings.includes(t.id);
                        return (
                          <button
                            key={t.id}
                            onClick={() => toggleTopping(t.id)}
                            className={`p-3 rounded-2xl text-xs font-sans font-semibold flex flex-col border-2 transition-all text-left ${
                              isSelected
                                ? 'bg-[#C84B31] text-white border-[#C84B31]'
                                : 'bg-white/80 border-[#4A2C2A]/20 hover:border-[#4A2C2A]'
                            }`}
                          >
                            <span>{t.name}</span>
                            <span className="opacity-80 text-[10px]">+${t.price.toFixed(2)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button 
                    onClick={handleCustomOrder}
                    className="w-full bg-[#4A2C2A] text-[#FDF6E3] py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-98 transition-all shadow-md"
                  >
                    Order Custom Batch
                  </button>
                </div>

              </div>
            </div>
          </section>

          {/* Schedule */}
          <section className="py-24 px-6 border-t-[3px] border-[#4A2C2A]/10">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 items-stretch">
                
                <div className="bg-[#4A2C2A] text-[#FDF6E3] p-8 rounded-[35px] border-[3px] border-[#4A2C2A] shadow-[6px_6px_0px_0px_#C84B31] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[#C84B31] font-black uppercase text-[10px] tracking-widest mb-4">
                      <Flame size={18} /> Daily Hot Drops
                    </div>
                    <h3 className="text-3xl italic font-bold lowercase tracking-tighter mb-4">Fresh Out Of The Oven</h3>
                    <p className="font-sans text-xs opacity-80 leading-relaxed">
                      We bake in small staggered batches throughout the day. Set your timer for hot rolls!
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-sans uppercase font-semibold">Next Batch Drop:</span>
                    <span className="font-black text-lg text-[#FDF6E3] bg-[#C84B31] px-3 py-1 rounded-full">1:00 PM</span>
                  </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { time: "08:00 AM", title: "Morning Brioche Batch", desc: "Classic Cinnamon Rolls with Vanilla Bean Glaze." },
                    { time: "11:00 AM", title: "Savory & Specialty Drop", desc: "Pecan Caramel Sticky Buns fresh from the pan." },
                    { time: "01:00 PM", title: "Afternoon Sweet Drop", desc: "Espresso Glazed & Dark Chocolate Swirls." },
                    { time: "04:00 PM", title: "Sunset Celebration Batch", desc: "Warm Mini-Bites for evening tea & coffee." }
                  ].map((slot, i) => (
                    <div key={i} className="bg-[#FDF6E3] p-6 border-[3px] border-[#4A2C2A] rounded-[28px] shadow-[4px_4px_0px_0px_#4A2C2A]">
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-[#C84B31] mb-2">
                        <Clock size={14} /> {slot.time}
                      </div>
                      <h4 className="text-lg italic font-bold tracking-tight mb-1">{slot.title}</h4>
                      <p className="text-xs font-sans opacity-70 leading-relaxed font-medium">{slot.desc}</p>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </section>

          {/* Mystery Scratch Offer */}
          <section className="py-24 px-6 border-t-[3px] border-[#4A2C2A]/10 bg-[#FDF6E3]/50">
            <div className="max-w-4xl mx-auto text-center">
              <span className="bg-[#4A2C2A] text-[#FDF6E3] px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 mb-3">
                <Gift size={12} /> Daily Baker's Luck
              </span>
              <h3 className="text-4xl italic font-bold lowercase tracking-tighter mb-2">reveal your secret offer</h3>
              <p className="text-xs font-sans uppercase font-bold tracking-[0.2em] opacity-60 mb-12">Tap below to scratch and unlock today's sweet code</p>

              <div className="bg-[#FDF6E3] border-[3px] border-[#4A2C2A] rounded-[40px] p-8 md:p-12 shadow-[10px_10px_0px_0px_#4A2C2A] max-w-lg mx-auto">
                <AnimatePresence mode="wait">
                  {!revealedOffer ? (
                    <motion.div 
                      key="unrevealed"
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      onClick={handleRevealOffer}
                      className="bg-[#C84B31] text-white p-10 rounded-[30px] border-2 border-dashed border-white cursor-pointer hover:rotate-1 transition-transform relative overflow-hidden group"
                    >
                      <Sparkles size={32} className="mx-auto mb-3 animate-spin" />
                      <p className="text-lg italic font-bold">Tap To Reveal Your Perk</p>
                      <p className="text-[10px] font-sans uppercase font-black tracking-widest mt-1 opacity-80">Click here to scratch</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="revealed"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white/80 p-8 rounded-[30px] border-2 border-[#4A2C2A]/20"
                    >
                      <div className="inline-flex items-center gap-2 text-[#C84B31] font-black text-xs uppercase tracking-wider mb-2">
                        <Tag size={16} /> Promo Unlocked!
                      </div>
                      <h4 className="text-3xl italic font-bold text-[#4A2C2A] mb-2">{revealedOffer.text}</h4>
                      <div className="bg-[#4A2C2A] text-[#FDF6E3] py-2 px-6 rounded-full inline-block font-mono font-bold text-sm tracking-widest my-3 shadow-inner">
                        {revealedOffer.code}
                      </div>
                      <p className="text-[10px] font-sans opacity-60 font-semibold">Apply code at checkout on your next order!</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>

          {/* Catering & Party Boxes */}
          <section className="py-24 px-6 border-t-[3px] border-[#4A2C2A]/10">
            <div className="max-w-6xl mx-auto bg-[#FDF6E3] border-[3px] border-[#4A2C2A] rounded-[45px] p-8 md:p-14 shadow-[12px_12px_0px_0px_#4A2C2A] grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 text-[#C84B31] font-black uppercase text-[10px] tracking-widest mb-3">
                  <Users size={16} /> Catering & Events
                </div>
                <h3 className="text-4xl italic font-bold lowercase tracking-tighter mb-6">Sweeten Your Next Event</h3>
                <p className="font-sans text-xs opacity-80 leading-relaxed font-medium mb-8">
                  From office breakfasts to wedding dessert bars, our custom party boxes and mini roll towers bring warmth to any celebration.
                </p>

                <div className="space-y-3 font-sans text-xs font-bold mb-8">
                  <div className="flex items-center gap-3">
                    <PackageCheck size={18} className="text-[#C84B31]" />
                    <span>Customizable Mini Roll Party Trays (12, 24, 48 pcs)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <PackageCheck size={18} className="text-[#C84B31]" />
                    <span>Individual Gift Box Branding Available</span>
                  </div>
                </div>

                <button className="bg-[#4A2C2A] text-[#FDF6E3] px-8 py-3.5 rounded-full text-[10px] uppercase font-black tracking-widest hover:bg-[#382120] transition-colors shadow-md">
                  Request Catering Menu
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/70 p-6 rounded-[25px] border-2 border-[#4A2C2A]/10 text-center flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-[#4A2C2A]">50+</span>
                  <span className="text-[10px] font-sans uppercase font-bold opacity-60 mt-1">Rolls / Box</span>
                </div>
                <div className="bg-white/70 p-6 rounded-[25px] border-2 border-[#4A2C2A]/10 text-center flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-[#4A2C2A]">100%</span>
                  <span className="text-[10px] font-sans uppercase font-bold opacity-60 mt-1">Fresh Guarantee</span>
                </div>
                <div className="col-span-2 bg-[#4A2C2A]/5 p-6 rounded-[25px] border-2 border-[#4A2C2A]/10 text-center">
                  <p className="text-xs font-sans font-bold italic">"The cinnamon roll tower was the star of our corporate brunch!"</p>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-24 px-6 border-t-[3px] border-[#4A2C2A]/10 bg-[#FDF6E3]/60">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <span className="bg-[#C84B31] text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                  Community Raves
                </span>
                <h3 className="text-4xl italic font-bold lowercase tracking-tighter mt-3">what cinnamon lovers say</h3>
                <p className="text-xs font-sans uppercase font-bold tracking-[0.2em] opacity-60 mt-1">Real reviews from our bakery family</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {BAKERY_REVIEWS.map((rev, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -6 }}
                    className="bg-[#FDF6E3] border-[3px] border-[#4A2C2A] p-8 rounded-[35px] shadow-[6px_6px_0px_0px_#4A2C2A] flex flex-col justify-between relative"
                  >
                    <Quote className="text-[#C84B31]/20 absolute top-6 right-6" size={40} />
                    <div>
                      <div className="flex gap-1 text-[#C84B31] mb-4">
                        {[...Array(rev.stars)].map((_, i) => (
                          <Star key={i} size={14} fill="#C84B31" stroke="none" />
                        ))}
                      </div>
                      <p className="text-xs font-sans font-medium opacity-85 leading-relaxed italic mb-6">
                        "{rev.text}"
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#4A2C2A]/10 flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-sm italic">{rev.name}</h5>
                        <p className="text-[10px] font-sans opacity-60 font-semibold">{rev.role}</p>
                      </div>
                      <span className="bg-[#4A2C2A]/10 text-[#4A2C2A] text-[8px] font-black uppercase px-2.5 py-1 rounded-full">
                        {rev.tag}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Accordion */}
          <section className="py-24 px-6 border-t-[3px] border-[#4A2C2A]/10 bg-[#FDF6E3]/40">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                <h3 className="text-4xl italic font-bold lowercase tracking-tighter">bakery faq</h3>
                <p className="text-xs font-sans uppercase font-bold tracking-[0.2em] opacity-60 mt-1">Everything you need to know about our rolls</p>
              </div>

              <div className="space-y-4">
                {BAKERY_FAQS.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div 
                      key={index} 
                      className="bg-[#FDF6E3] border-[3px] border-[#4A2C2A] rounded-[25px] overflow-hidden shadow-[4px_4px_0px_0px_#4A2C2A] transition-all"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full p-6 text-left font-bold flex items-center justify-between gap-4 focus:outline-none"
                      >
                        <span className="text-lg italic tracking-tight">{faq.question}</span>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown size={20} className="text-[#4A2C2A]" />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <div className="px-6 pb-6 text-xs font-sans font-medium leading-relaxed opacity-80 border-t border-[#4A2C2A]/10 pt-4">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Cart Component Drawer */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpen={() => setIsCartOpen(true)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
        onClearCart={handleClearCart}
        total={cartTotal}
        userEmail={user?.email || "guest@cinnabloom.com"}
        userName={user?.name || "Guest Baker"}
      />
    </div>
  );
}