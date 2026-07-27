"use client";

import React, { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Loader2, Sparkles, Heart, Store } from 'lucide-react';
import Link from 'next/link';

export interface Product {
  _id: string;
  product_name: string;
  product_price: number;
  product_description: string;
  img_url: string;
  category_id?: string;
  is_featured?: number | boolean;
  status?: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        
        // Fetch all foods or query by slug endpoint
        const response = await fetch(`${API_URL}/api/foods`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product (Status: ${response.status})`);
        }

        const rawData = await response.json();
        const items: Product[] = Array.isArray(rawData) ? rawData : rawData.data || [];

        // Helper function to match slug string back to item name
        const createSlug = (name: string) => 
          name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        // Find product matching the slug
        const matchedProduct = items.find(
          (item) => createSlug(item.product_name) === slug
        );

        if (matchedProduct) {
          setProduct(matchedProduct);
        } else {
          setError("Roll not found.");
        }
      } catch (err: any) {
        console.error("Error fetching roll details:", err);
        setError("Could not load the bakery item.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [slug]);

  // Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF6E3] flex flex-col items-center justify-center font-serif text-[#4A2C2A] pt-28">
        <Loader2 className="animate-spin mb-4 text-[#C84B31]" size={40} />
        <p className="uppercase tracking-[0.3em] text-[10px] font-black">Checking the oven...</p>
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FDF6E3] font-serif text-[#4A2C2A] flex flex-col items-center justify-center p-6 pt-32 text-center">
        <h2 className="text-3xl italic font-bold mb-4">Oops! Batch missing.</h2>
        <p className="text-sm opacity-80 mb-6">{error || "This tasty treat could not be found."}</p>
        <Link 
          href="/" 
          className="bg-[#4A2C2A] text-[#FDF6E3] px-6 py-3 rounded-full text-xs uppercase tracking-widest font-black hover:scale-105 transition-all shadow-md border-2 border-[#4A2C2A]"
        >
          Return to Bakery
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6E3] font-serif text-[#4A2C2A] flex flex-col relative overflow-x-hidden">
      {/* Background Decor */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 z-0 bg-repeat"
        style={{ backgroundImage: "url('/images/bg.png')", backgroundSize: '500px auto' }}
      />

      {/* Navigation - Increased Top Padding (pt-28 sm:pt-32) to prevent clipping under fixed layout/headers */}
      <nav className="relative z-50 pt-28 sm:pt-32 px-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link 
          href="/" 
          className="group flex items-center gap-3 hover:opacity-80 transition-all uppercase text-[10px] font-black tracking-widest"
        >
          <div className="w-10 h-10 border-2 border-[#4A2C2A] bg-[#FDF6E3] rounded-full flex items-center justify-center group-hover:bg-[#4A2C2A] group-hover:text-[#FDF6E3] transition-colors shadow-sm">
            <Store size={18} />
          </div>
          <span className="bg-[#FDF6E3]/90 px-3 py-1.5 rounded-full border border-[#4A2C2A]/20 shadow-sm">
            Back to Bakery
          </span>
        </Link>
        
        <div className="w-10 h-10 bg-[#4A2C2A] rounded-full flex items-center justify-center text-[#FDF6E3] shadow-md hover:scale-105 transition-transform cursor-pointer border-2 border-[#4A2C2A]">
          <ShoppingBag size={18} />
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8 md:py-12 flex-grow w-full">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          
          {/* Visual Side */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="bg-white/60 border-[3px] border-[#4A2C2A] rounded-[50px] p-8 md:p-12 aspect-square flex items-center justify-center shadow-[10px_10px_0px_0px_#4A2C2A] relative overflow-hidden">
                <motion.img 
                  animate={{ rotate: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  src={product.img_url} 
                  alt={product.product_name} 
                  className="w-full h-auto drop-shadow-2xl z-10 object-contain max-h-[80%]"
                />
            </div>
            
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-[#C84B31] text-white w-20 h-20 md:w-24 md:h-24 rounded-full flex flex-col items-center justify-center border-[3px] border-[#4A2C2A] shadow-xl rotate-12 z-20">
               <span className="text-[8px] md:text-[10px] uppercase font-black opacity-80">Only</span>
               <span className="text-lg md:text-xl font-black">${Number(product.product_price).toFixed(2)}</span>
            </div>
          </motion.div>

          {/* Info Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 md:space-y-8"
          >
            <div>
              {Boolean(product.is_featured) && (
                <div className="inline-flex items-center gap-2 bg-[#C84B31] text-white border-2 border-[#4A2C2A] px-4 py-1.5 rounded-full text-[9px] uppercase font-black tracking-widest mb-4 md:mb-6 shadow-sm">
                  <Sparkles size={12} /> Baker's Pick ✨
                </div>
              )}
              <h1 className="text-4xl md:text-6xl italic font-bold lowercase tracking-tighter leading-[0.9] mb-4">
                {product.product_name}
              </h1>
              <div className="h-[3px] w-20 bg-[#4A2C2A] opacity-20"></div>
            </div>

            <p className="text-base md:text-xl font-sans font-medium opacity-80 leading-relaxed">
              {product.product_description}
            </p>

            <div className="bg-[#4A2C2A]/5 border-2 border-dashed border-[#4A2C2A]/20 p-5 md:p-6 rounded-3xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-16 h-16 opacity-5 rotate-12 -mr-4 -mt-4">
                 <Store size={60} />
               </div>
               <p className="text-[10px] uppercase font-black tracking-[0.2em] mb-2">Baker's Note:</p>
               <p className="text-sm font-sans italic">"Pairs perfectly with a warm cup of Earl Grey tea and a quiet morning."</p>
            </div>

            <div className="flex gap-4 pt-2">
              <button className="flex-1 bg-[#4A2C2A] text-[#FDF6E3] py-4 md:py-5 rounded-[25px] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-[5px_5px_0px_0px_#C84B31] active:scale-95 border-2 border-[#4A2C2A]">
                <ShoppingBag size={20} strokeWidth={2.5} />
                <span className="uppercase text-xs font-black tracking-[0.2em]">Add to Bag</span>
              </button>
              <button className="w-14 md:w-16 border-[3px] border-[#4A2C2A] rounded-[25px] flex items-center justify-center hover:bg-pink-100 transition-colors bg-[#FDF6E3]">
                <Heart size={20} className="text-[#4A2C2A]" />
              </button>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}