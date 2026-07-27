"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Sparkles, 
  Heart, 
  Wheat, 
  Clock, 
  Smile, 
  Award, 
  ShoppingBag, 
  Coffee 
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const values = [
    {
      icon: Wheat,
      title: "Organic Ingredients",
      desc: "We source 100% organic flour, single-origin cinnamon, and farm-fresh dairy from local partners.",
      accent: "#A0C4DF"
    },
    {
      icon: Clock,
      title: "Baked Fresh Daily",
      desc: "Our ovens fire up at 3:00 AM every single morning so your rolls are piping hot at opening.",
      accent: "#B85042"
    },
    {
      icon: Heart,
      title: "Small-Batch Love",
      desc: "No massive factory lines here. Every single pastry is hand-rolled, proofed, and frosted with care.",
      accent: "#A0C4DF"
    },
    {
      icon: Smile,
      title: "Community First",
      desc: "We donate leftover fresh bakes every evening to local shelters and community pantries.",
      accent: "#B85042"
    }
  ];

  return (
    <div 
      className="min-h-screen font-serif text-[#4A2C2A] relative w-full pb-20"
      style={{ 
        backgroundImage: "linear-gradient(rgba(253, 246, 227, 0.70), rgba(253, 246, 227, 0.70)), url('/images/bg.png')",
        backgroundSize: '400px auto',
        backgroundRepeat: 'repeat',
      }}
    >
      {/* --- HEADER --- */}
      <header className="relative pt-28 md:pt-36 pb-8 px-6">
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
          
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

            <div className="bg-[#A0C4DF] text-[#4A2C2A] border-[2px] border-[#4A2C2A] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Sparkles size={12} /> Our Story & Heritage
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl"
          >
            <span className="uppercase tracking-[0.35em] text-[10px] font-black text-[#B85042] bg-[#B85042]/10 px-4 py-1.5 rounded-full border border-[#B85042]/30 inline-block mb-4">
              Since 2018
            </span>
            <h1 className="text-5xl md:text-7xl italic font-bold tracking-tighter leading-none mb-6">
              baking love into every bloom
            </h1>
            <p className="font-sans text-sm md:text-base font-semibold opacity-85 leading-relaxed max-w-xl mx-auto">
              Welcome to Cinnabloom — a cozy corner bakery dedicated to warm cinnamon rolls, golden crusts, and morning smiles.
            </p>
          </motion.div>
        </div>
      </header>

      {/* --- MAIN STORY SECTION --- */}
      <main className="max-w-6xl mx-auto px-6 pt-6 space-y-16">
        
        {/* Story Card */}
        <section className="bg-[#FDF6E3] border-[3px] border-[#4A2C2A] rounded-[35px] p-8 md:p-12 shadow-[8px_8px_0px_0px_#4A2C2A] relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#B85042] bg-[#B85042]/10 px-3 py-1 rounded-full border border-[#B85042]/20 inline-block">
                How It All Started
              </span>
              <h2 className="text-3xl md:text-4xl italic font-bold lowercase tracking-tight">
                from a small home kitchen to your favorite morning ritual.
              </h2>
              <p className="font-sans text-xs md:text-sm leading-relaxed opacity-85">
                Cinnabloom started with a simple heirloom recipe passed down through three generations: extra pillowy dough, brown sugar swirl, and a touch of wild vanilla bloom. What began as weekend baking pop-ups quickly grew into our dream brick-and-mortar sanctuary.
              </p>
              <p className="font-sans text-xs md:text-sm leading-relaxed opacity-85">
                Today, we stay true to our roots: slow fermentations, no shortcuts, and baking everything fresh every single day with the finest natural ingredients we can find.
              </p>
            </div>

            {/* Decorative Image Container */}
            <div className="relative">
              <div className="w-full aspect-square bg-white rounded-[30px] border-[3px] border-[#4A2C2A] shadow-[6px_6px_0px_0px_#4A2C2A] flex items-center justify-center p-8 overflow-hidden relative">
                <img 
                  src="/images/bakery-story.png" 
                  alt="Cinnabloom Kitchen"
                  className="w-full h-full object-cover rounded-[20px]"
                  onError={(e) => {
                    // Fallback visual if image doesn't exist
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="text-center space-y-2 p-6">
                  <Coffee size={48} className="mx-auto text-[#B85042]" />
                  <p className="font-serif italic text-2xl font-bold">Oven-Fresh Daily</p>
                  <p className="font-sans text-xs font-semibold opacity-75">Warm rolls, specialty coffee & pure cozy vibes.</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-[#A0C4DF] text-[#4A2C2A] px-4 py-2 rounded-2xl border-[2.5px] border-[#4A2C2A] shadow-md rotate-3 text-xs font-black uppercase tracking-wider">
                ✨ Handcrafted Daily
              </div>
            </div>
          </div>
        </section>

        {/* --- OUR CORE VALUES GRID --- */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-3xl md:text-4xl italic font-bold tracking-tight">why our treats bloom different</h3>
            <p className="font-sans text-xs md:text-sm font-semibold opacity-80">Our promise to your tastebuds and community.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6 }}
                  className="bg-[#FDF6E3] border-[3px] border-[#4A2C2A] rounded-[30px] p-6 shadow-[6px_6px_0px_0px_#4A2C2A] flex flex-col justify-between"
                >
                  <div>
                    <div 
                      className="w-12 h-12 rounded-2xl border-[2.5px] border-[#4A2C2A] flex items-center justify-center mb-4 shadow-sm"
                      style={{ backgroundColor: item.accent }}
                    >
                      <Icon size={22} className="text-[#4A2C2A]" />
                    </div>
                    <h4 className="text-xl italic font-bold mb-2">{item.title}</h4>
                    <p className="font-sans text-xs opacity-80 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* --- MEET THE BAKER BADGE --- */}
        <section className="bg-[#4A2C2A] text-[#FDF6E3] rounded-[35px] border-[3px] border-[#4A2C2A] p-8 md:p-12 shadow-[8px_8px_0px_0px_#B85042] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#B85042] text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20">
              <Award size={12} /> Master Baker
            </div>
            <h3 className="text-3xl md:text-4xl italic font-bold">"Baking is slow science mixed with warm heart."</h3>
            <p className="font-sans text-xs md:text-sm opacity-85 leading-relaxed">
               Head Baker & Founder Clara Bloom creates every single recipe from scratch, experimenting with seasonal spices and floral infused glaze glazes.
            </p>
          </div>

          <Link href="/explore">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#FDF6E3] text-[#4A2C2A] border-[3px] border-[#FDF6E3] px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_#B85042] hover:bg-[#A0C4DF] transition-colors flex items-center gap-2 shrink-0"
            >
              <ShoppingBag size={16} /> Explore Full Menu
            </motion.button>
          </Link>
        </section>

      </main>
    </div>
  );
}