"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Eye } from 'lucide-react'; 
import Link from 'next/link';
import Image from 'next/image';

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
  is_featured?: number;
}

const MOCK_CATEGORIES: Category[] = [
  { category_id: "cat-1", category_name: "Cinnamon Rolls" },
  { category_id: "cat-2", category_name: "Pastries & Buns" },
  { category_id: "cat-3", category_name: "Gluten-Free" },
  { category_id: "cat-4", category_name: "Artisan Drinks" },
];

const MOCK_PRODUCTS: Product[] = [
  {
    product_id: "prod-1",
    product_name: "Classic Honey Swirl",
    product_price: 5.99,
    product_description: "Signature brown sugar cinnamon roll glazed with wild honey glaze and vanilla bean cloud.",
    img_url: "/images/roll-1.png",
    category_id: "cat-1",
    is_featured: 1,
  },
  {
    product_id: "prod-2",
    product_name: "Midnight Bloom Berry",
    product_price: 6.49,
    product_description: "Infused with organic blackberry coulis, dark chocolate drizzle, and candied petals.",
    img_url: "/images/roll-2.png",
    category_id: "cat-1",
    is_featured: 1,
  },
  {
    product_id: "prod-3",
    product_name: "Golden Cardamom Bun",
    product_price: 4.99,
    product_description: "Scandinavian-style braided cardamom bun baked to golden perfection with coarse sugar.",
    img_url: "/images/roll-3.png",
    category_id: "cat-2",
    is_featured: 0,
  },
];

// CONTINUOUS LINEAR ARC PATHS (NO MID-WAY SLOWDOWNS)
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

export default function HomePage() {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories] = useState<Category[]>(MOCK_CATEGORIES);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [loading] = useState<boolean>(false);

  const filteredProducts = activeCat 
    ? products.filter((p) => p.category_id === activeCat)
    : products;

  const createSlug = (name: string): string => 
    name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  return (
    <div className="min-h-screen font-serif text-[#4A2C2A] bg-[#FDF6E3]">
      
      {/* Invisible SVG definition for responsive clipPath */}
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
          <clipPath id="wave-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.02 C 0.15,0.04 0.35,-0.01 0.5,0.02 C 0.65,0.05 0.85,0.00 1,0.02 L 1,1 L 0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* --- HERO SECTION --- */}
      <header className="relative min-h-[75vh] flex flex-col items-center justify-center overflow-hidden px-6 z-10 pb-20 md:pb-28">
        {/* HIGH-QUALITY HERO IMAGE CONTAINER */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.png"
            alt="Cinnabloom Fresh Cinnamon Rolls"
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover object-center"
            style={{
              imageRendering: '-webkit-optimize-contrast',
              transform: 'translateZ(0)',
            }}
          />
          <div className="absolute inset-0 bg-[#FDF6E3]/10 z-10" />
        </div>

        {/* --- SHOOTING STARS LAYER --- */}
        <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden">
          {SHOOTING_STARS.map((star) => (
            <motion.div
              key={star.id}
              initial={{
                left: star.xPath[0],
                top: star.yPath[0],
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                left: star.xPath,
                top: star.yPath,
                opacity: [0, 1, 1, 1, 0],
                scale: [0.8, 1, 1, 1, 0.8],
              }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                repeatDelay: 2,
                delay: star.delay,
                ease: "linear",
              }}
              className="absolute flex items-center justify-center"
            >
              {/* SPARKLE DUST TRAIL */}
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
                  animate={{
                    opacity: [0, 0.9, 0],
                    scale: [0.5, 1.4, 0.2],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: idx * 0.1,
                  }}
                />
              ))}

              {/* STAR HEAD */}
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

        {/* --- ANIMATED HERO BANNER --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: [0, -10, 0] // Smooth up and down floating motion
          }}
          transition={{ 
            opacity: { duration: 0.8 },
            y: { repeat: Infinity, duration: 4.5, ease: "easeInOut" }
          }}
          className="relative z-20 text-center bg-[#FDF6E3]/95 p-8 md:p-12 rounded-[35px] border-[3px] border-[#4A2C2A] shadow-xl max-w-xl my-auto"
        >
          <p className="uppercase tracking-[0.4em] text-[9px] font-black mb-3">Unroll the magic with</p>
          <h2 className="text-5xl md:text-7xl italic mb-8 tracking-tighter leading-none">Cinnabloom</h2>
          <button className="bg-[#4A2C2A] text-[#FDF6E3] px-10 py-3 rounded-full text-[10px] uppercase tracking-widest font-black hover:scale-105 transition-all shadow-md">
            Magic Awaits
          </button>
          
          <img 
            src="/images/bow.png" 
            className="absolute -top-12 -right-12 w-32 h-32 rotate-12 drop-shadow-md hidden md:block" 
            alt="sticker" 
          />
        </motion.div>
      </header>

      {/* --- MAIN BODY WITH CONTINUOUS BACKGROUND & WAVE TOP --- */}
      <main 
        className="relative z-20 -mt-16 md:-mt-24 bg-repeat pt-16 md:pt-20"
        style={{ 
          backgroundImage: "url('/images/bg.png')",
          backgroundSize: '500px auto',
          clipPath: 'url(#wave-clip)',
          WebkitClipPath: 'url(#wave-clip)',
        }}
      >
        <div className="absolute inset-0 bg-[#FDF6E3]/60 pointer-events-none z-0" />

        <div className="relative z-10">
          <section className="pb-24 pt-32 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col items-center mb-8">
              <h3 className="text-4xl italic font-bold lowercase tracking-tighter">flavor library</h3>
              <div className="h-[2px] w-12 bg-[#4A2C2A] mt-2 opacity-30"></div>
            </div>

            {/* --- FILTER SYSTEM --- */}
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

            {/* --- CARDS GRID --- */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <AnimatePresence mode='popLayout'>
                {filteredProducts.map((roll) => {
                  const productUrl = `/details/${createSlug(roll.product_name)}/${roll.product_id}`;
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
                      {roll.is_featured === 1 && (
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
                          className="w-full h-auto drop-shadow-xl object-contain"
                        />
                      </Link>

                      <h4 className="text-2xl italic font-bold lowercase tracking-tighter mb-2">{roll.product_name}</h4>
                      <p className="text-xs font-sans font-medium opacity-80 leading-relaxed mb-8 line-clamp-2">
                        {roll.product_description}
                      </p>

                      <div className="mt-auto space-y-3">
                        <button className="w-full bg-[#4A2C2A] text-[#FDF6E3] py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#4A2C2A]/90 transition-all active:scale-95 shadow-sm">
                          <Plus size={16} strokeWidth={3} />
                          <span className="uppercase text-[10px] font-black tracking-widest">Add to Bag</span>
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
            
            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-20 opacity-50">
                <p className="italic text-lg">No treats found in this category yet...</p>
              </div>
            )}
          </section>

          {/* --- KIT SECTION --- */}
          <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ rotate: -1.5 }}
                whileHover={{ rotate: 0 }}
                className="bg-[#FDF6E3] p-10 border-[3px] border-[#4A2C2A] rounded-[45px] shadow-[12px_12px_0px_0px_#4A2C2A]"
              >
                <h3 className="text-xl uppercase font-black mb-6 tracking-tight leading-tight">Your Shortcut to Homemade Happiness</h3>
                <p className="leading-relaxed font-sans text-sm font-medium opacity-90 mb-8">
                  Baking warm, gooey cinnamon rolls has never been easier. With our all-natural cinnamon roll mix, you get everything you need.
                </p>
                <button className="border-[3px] border-[#4A2C2A] px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#4A2C2A] hover:text-white transition-all shadow-[4px_4px_0px_0px_#4A2C2A]">
                  I WANT A KIT
                </button>
              </motion.div>
              <div className="relative flex justify-center mt-12 md:mt-0">
                <motion.img 
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  src="/images/pot.png" 
                  alt="Cinnabell Kit" 
                  className="w-4/5 h-auto drop-shadow-2xl relative z-10" 
                />
              </div>
            </div>
          </section>

          {/* --- WHY CHOOSE US --- */}
          <section className="py-24 text-center">
            <h3 className="text-3xl font-bold uppercase mb-16 italic tracking-tighter">Why Choose Us</h3>
            <div className="flex flex-wrap justify-center gap-16 px-6">
              {['All Natural', 'Easy to Make', 'Makes a Dozen'].map((feature, i) => (
                <motion.div key={i} whileHover={{ scale: 1.05 }} className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-[#FDF6E3] border-[3px] border-[#4A2C2A] flex items-center justify-center shadow-[6px_6px_0px_0px_#4A2C2A]" 
                        style={{ borderRadius: i % 2 === 0 ? '30% 70% 70% 30% / 30% 30% 70% 70%' : '70% 30% 30% 70% / 70% 70% 30% 30%' }}>
                      <div className="w-14 h-14 bg-[#4A2C2A]/5 rounded-full border-2 border-dashed border-[#4A2C2A]/30 flex items-center justify-center font-bold text-xl">
                        {i + 1}
                      </div>
                  </div>
                  <p className="mt-6 font-black uppercase text-[9px] tracking-[0.2em]">{feature}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* --- TESTIMONIALS --- */}
          <section className="py-24 px-6 pb-20">
            <h3 className="text-center text-3xl font-bold uppercase mb-16 italic tracking-tighter">Sweet Words</h3>
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-[#FDF6E3] p-8 border-[3px] border-[#4A2C2A] rounded-[28px] text-center shadow-[6px_6px_0px_0px_#4A2C2A]">
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#4A2C2A" strokeWidth={0} />)}
                  </div>
                  <p className="text-xs font-sans italic mb-8 leading-relaxed font-semibold opacity-80">
                    "I've never considered myself much of a baker, but Cinnabloom made it so easy!"
                  </p>
                  <p className="font-black text-[9px] uppercase tracking-[0.2em]">— Verified Baker</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}