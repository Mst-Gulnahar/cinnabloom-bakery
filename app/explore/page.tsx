"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Plus, 
  Eye, 
  Loader2, 
  Search, 
  ArrowLeft, 
  ShoppingBag, 
  Check, 
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  RotateCcw
} from 'lucide-react'; 
import Link from 'next/link';
import Cart, { CartItem } from '../components/Cart'; 
import { useAuth } from '../../context/AuthContext';

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

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ExplorePage() {
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- CART STATE MANAGEMENT ---
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [addedItemAnimation, setAddedItemAnimation] = useState<string | null>(null);

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
        console.error("Explore fetch error:", err);
        setError("Could not load our full treat selection. Please verify the backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchBackendData();
  }, []);

  // --- CART HANDLERS ---
  const handleAddToCart = (product: Product) => {
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

  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const createSlug = (name: string): string => 
    name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  // --- FILTER & SORT LOGIC ---
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchesCategory = activeCat ? p.category_id === activeCat : true;
      const matchesSearch = 
        p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.product_description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.product_price - b.product_price;
      if (sortBy === 'price-desc') return b.product_price - a.product_price;
      if (sortBy === 'name-asc') return a.product_name.localeCompare(b.product_name);
      return (Number(b.is_featured) || 0) - (Number(a.is_featured) || 0);
    });
  }, [products, activeCat, searchQuery, sortBy]);

  const resetFilters = () => {
    setActiveCat(null);
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div 
  className="min-h-screen font-serif text-[#4A2C2A] relative w-full pb-20"
  style={{ 
    // Reduced overlay opacity to 0.70 so the background pattern is clearly visible
    backgroundImage: "linear-gradient(rgba(253, 246, 227, 0.70), rgba(253, 246, 227, 0.70)), url('/images/bg.png')",
    backgroundSize: '400px auto',
    backgroundRepeat: 'repeat',
  }}
>
      
      {/* --- FLOATING BOTTOM-RIGHT CART TRIGGER --- */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCartOpen(true)}
          className="relative bg-[#4A2C2A] text-[#FDF6E3] p-4 rounded-full border-[3px] border-[#FDF6E3] shadow-2xl flex items-center justify-center hover:bg-[#382120] transition-colors"
          aria-label="Open cart"
        >
          <ShoppingBag size={24} />
          {totalCartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#B85042] text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#FDF6E3] shadow-md">
              {totalCartCount}
            </span>
          )}
        </motion.button>
      </div>

      {/* --- HEADER BANNER --- */}
      <header className="relative pt-28 md:pt-36 pb-8 px-6">
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
          
          {/* Top Bar Navigation */}
          <div className="w-full flex justify-between items-center mb-8">
            <Link href="/">
              <motion.button 
                whileHover={{ x: -4 }}
                className="inline-flex items-center gap-2 bg-[#FDF6E3] border-[3px] border-[#4A2C2A] px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#4A2C2A] hover:bg-[#A0C4DF]/20 transition-all"
              >
                <ArrowLeft size={16} strokeWidth={3} />
                <span>Back to Bakery</span>
              </motion.button>
            </Link>

            {/* Faded Sky Blue Tag */}
            <div className="bg-[#A0C4DF] text-[#4A2C2A] border-[2px] border-[#4A2C2A] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Sparkles size={12} /> Full Menu Library
            </div>
          </div>

          {/* Page Title */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl"
          >
            <span className="uppercase tracking-[0.35em] text-[10px] font-black text-[#B85042] bg-[#B85042]/10 px-4 py-1.5 rounded-full border border-[#B85042]/30 inline-block mb-4">
              Freshly Baked Daily
            </span>
            <h1 className="text-5xl md:text-7xl italic font-bold tracking-tighter leading-none mb-4">
              explore all treats
            </h1>
            <p className="font-sans text-xs md:text-sm font-semibold opacity-85 leading-relaxed max-w-md mx-auto">
              Browse our complete oven-fresh inventory, search special flavors, and filter by your favorite cozy categories.
            </p>
          </motion.div>
        </div>
      </header>

      {/* --- MAIN CONTENT & FILTER CONTROLS --- */}
      <main className="max-w-7xl mx-auto px-6 pt-6">

        {/* --- CONTROLS PANEL --- */}
        <div className="bg-[#FDF6E3] border-[3px] border-[#4A2C2A] rounded-[35px] p-6 mb-12 shadow-[8px_8px_0px_0px_#4A2C2A] space-y-6">
          
          {/* Row 1: Search Box + Sort Dropdown */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Search Input */}
            <div className="relative w-full md:w-[420px]">
              <input
                type="text"
                placeholder="Search by treat name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-[3px] border-[#4A2C2A] rounded-full py-3 pl-12 pr-6 text-xs font-sans font-bold placeholder-[#4A2C2A]/50 focus:outline-none focus:ring-2 focus:ring-[#A0C4DF] transition-all shadow-[3px_3px_0px_0px_#4A2C2A]"
              />
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A2C2A]" />
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <div className="flex items-center gap-2 bg-[#FDF6E3] border-[2.5px] border-[#4A2C2A] px-4 py-2.5 rounded-full shadow-[3px_3px_0px_0px_#4A2C2A]">
                <ArrowUpDown size={14} className="text-[#4A2C2A]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#4A2C2A]">SORT:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-xs font-sans font-bold text-[#4A2C2A] focus:outline-none cursor-pointer pr-1"
                >
                  <option value="featured">Baker's Picks First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Alphabetical (A-Z)</option>
                </select>
              </div>

              {(searchQuery || activeCat || sortBy !== 'featured') && (
                <button
                  onClick={resetFilters}
                  className="bg-[#B85042] text-white border-[2px] border-[#4A2C2A] p-2.5 rounded-full hover:bg-[#A34336] transition-colors shadow-[2px_2px_0px_0px_#4A2C2A] flex items-center justify-center"
                  title="Reset filters"
                >
                  <RotateCcw size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Category Filter Buttons */}
          {categories.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <SlidersHorizontal size={13} className="text-[#B85042]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#B85042]">CATEGORIES</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => setActiveCat(null)}
                  className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border-[2.5px] border-[#4A2C2A] ${
                    activeCat === null 
                    ? 'bg-[#4A2C2A] text-[#FDF6E3] shadow-none translate-y-0.5' 
                    : 'bg-white text-[#4A2C2A] shadow-[3px_3px_0px_0px_#4A2C2A] hover:bg-[#A0C4DF]/20 hover:-translate-y-0.5'
                  }`}
                >
                  ALL ITEMS ({products.length})
                </button>
                
                {categories.map((cat) => {
                  const count = products.filter(p => p.category_id === cat.category_id).length;
                  const isActive = activeCat === cat.category_id;

                  return (
                    <button
                      key={cat.category_id}
                      onClick={() => setActiveCat(cat.category_id)}
                      className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border-[2.5px] border-[#4A2C2A] ${
                        isActive 
                        ? 'bg-[#4A2C2A] text-[#FDF6E3] shadow-none translate-y-0.5' 
                        : 'bg-white text-[#4A2C2A] shadow-[3px_3px_0px_0px_#4A2C2A] hover:bg-[#A0C4DF]/20 hover:-translate-y-0.5'
                      }`}
                    >
                      {cat.category_name} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* --- PRODUCT COUNT STATUS --- */}
        {!loading && !error && (
          <div className="flex justify-between items-center mb-6 px-2">
            <p className="text-xs font-sans font-bold text-[#4A2C2A]/70 uppercase tracking-wider">
              SHOWING <span className="text-[#B85042] font-black">{filteredAndSortedProducts.length}</span> DELICIOUS TREATS
            </p>
          </div>
        )}

        {/* --- LOADING STATE --- */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-[#4A2C2A]" />
            <p className="italic text-sm font-semibold opacity-70">Gathering every single sweet treat from the oven...</p>
          </div>
        )}

        {/* --- ERROR STATE --- */}
        {error && !loading && (
          <div className="text-center py-16 bg-[#FDF6E3] border-[3px] border-[#B85042] rounded-[30px] p-8 max-w-md mx-auto shadow-[6px_6px_0px_0px_#B85042]">
            <p className="text-sm font-bold text-[#B85042] mb-2">Oops!</p>
            <p className="text-xs font-sans opacity-80">{error}</p>
          </div>
        )}

        {/* --- UNLIMITED PRODUCT GRID --- */}
        {!loading && !error && (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode='popLayout'>
              {filteredAndSortedProducts.map((roll) => {
                const productUrl = `/details/${createSlug(roll.product_name)}`;
                const isAdded = addedItemAnimation === roll.product_id;

                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={roll.product_id}
                    whileHover={{ y: -8 }}
                    className="bg-[#FDF6E3] border-[3px] border-[#4A2C2A] rounded-[35px] p-6 shadow-[8px_8px_0px_0px_#4A2C2A] relative group h-full flex flex-col z-10"
                  >
                    {/* Featured Muted Red Badge */}
                    {Boolean(roll.is_featured) && (
                      <div className="absolute -top-3 -left-3 bg-[#B85042] text-white px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter border-2 border-[#4A2C2A] rotate-[-5deg] z-20 shadow-sm flex items-center gap-1">
                        <Star size={10} fill="white" strokeWidth={0} /> Baker's Pick
                      </div>
                    )}

                    {/* Price Badge in Faded Sky Blue */}
                    <div className="absolute -top-3 -right-3 bg-[#A0C4DF] text-[#4A2C2A] w-14 h-14 rounded-full flex items-center justify-center font-black text-[11px] rotate-12 border-2 border-[#4A2C2A] shadow-md z-10">
                      ${roll.product_price.toFixed(2)}
                    </div>

                    {/* Image Box */}
                    <Link href={productUrl} className="w-full aspect-square bg-white rounded-[25px] border-2 border-[#4A2C2A]/15 mb-6 overflow-hidden flex items-center justify-center p-8 cursor-pointer relative group-hover:border-[#4A2C2A] transition-colors">
                      <motion.img 
                        whileHover={{ scale: 1.08, rotate: 3 }}
                        src={roll.img_url} 
                        alt={roll.product_name}
                        className="w-full h-full drop-shadow-xl object-contain transition-transform duration-300"
                      />
                    </Link>

                    {/* Category Label */}
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#B85042] bg-[#B85042]/10 px-3 py-1 rounded-full border border-[#B85042]/20 self-start mb-2">
                      {roll.category_id.replace('cat-', '').replace(/-/g, ' ')}
                    </span>

                    <h4 className="text-2xl italic font-bold lowercase tracking-tighter mb-2 text-[#4A2C2A]">
                      {roll.product_name}
                    </h4>
                    
                    <p className="text-xs font-sans font-medium opacity-80 leading-relaxed mb-8 line-clamp-2">
                      {roll.product_description}
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-auto space-y-3">
                      <button 
                        onClick={() => handleAddToCart(roll)}
                        className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm border-2 border-[#4A2C2A] ${
                          isAdded 
                            ? 'bg-[#B85042] text-white' 
                            : 'bg-[#4A2C2A] text-[#FDF6E3] hover:bg-[#382120]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={16} strokeWidth={3} />
                            <span className="uppercase text-[10px] font-black tracking-widest">Added to Bag!</span>
                          </>
                        ) : (
                          <>
                            <Plus size={16} strokeWidth={3} />
                            <span className="uppercase text-[10px] font-black tracking-widest">Add to Bag</span>
                          </>
                        )}
                      </button>
                      
                      <Link 
                        href={productUrl} 
                        className="w-full border-2 border-[#4A2C2A]/30 text-[#4A2C2A] py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#A0C4DF]/20 transition-all uppercase text-[9px] font-black tracking-[0.2em]"
                      >
                        <Eye size={14} /> View Details
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
        
        {/* Empty State */}
        {!loading && !error && filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-24 bg-[#FDF6E3] border-[3px] border-dashed border-[#4A2C2A]/30 rounded-[35px] max-w-lg mx-auto p-8">
            <p className="italic text-xl font-bold mb-3">No treats match your recipe!</p>
            <p className="text-xs font-sans font-medium opacity-70 mb-6">Try searching for something else or reset your filter selection.</p>
            <button
              onClick={resetFilters}
              className="bg-[#4A2C2A] text-[#FDF6E3] px-6 py-2.5 rounded-full text-[10px] uppercase font-black tracking-widest shadow-[4px_4px_0px_0px_#B85042]"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>

      {/* --- CART DRAWER COMPONENT --- */}
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