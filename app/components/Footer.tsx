"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export default function Footer() {
  const { user } = useAuth();

  // Helper to safely resolve user avatar image across all possible schema fields
  const getUserAvatar = () => {
    if (!user) return null;
    const u = user as any;
    const rawUrl = u.avatar || u.profilePicture || u.photoUrl || u.avatarUrl || u.image;
    if (rawUrl && typeof rawUrl === "string" && rawUrl.trim() !== "" && !rawUrl.includes("ui-avatars.com")) {
      return rawUrl;
    }
    return null;
  };

  const userAvatar = getUserAvatar();

  // Helper for initial fallback if image fails or isn't present
  const userInitial = user?.name 
    ? user.name.charAt(0).toUpperCase() 
    : user?.email 
      ? user.email.charAt(0).toUpperCase() 
      : "B";

  // Social icon list mapping to /images/<icon-name>.png
  const socialIcons = [
    { name: "Instagram", icon: "/images/ig.png", alt: "IG" },
    { name: "TikTok", icon: "/images/tk.png", alt: "TK" },
    { name: "YouTube", icon: "/images/yt.png", alt: "YT" },
    { name: "Pinterest", icon: "/images/pin.png", alt: "PIN" },
  ];

  return (
    <footer className="relative bg-[#4A2C2A] text-[#FDF6E3] pt-24 pb-12 overflow-hidden mt-12">
      
      {/* --- TOP ARCH CUTOUT TRANSITION --- */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none pointer-events-none -translate-y-[99%]">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-16 md:h-24 text-[#4A2C2A] fill-current"
        >
          <path d="M0,0 C150,90 350,-40 500,65 C650,170 900,-20 1200,40 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      {/* --- DECORATIVE FLOATING STICKERS --- */}
      <motion.div 
        animate={{ rotate: [12, 18, 12], y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute top-8 right-10 md:right-20 opacity-20 pointer-events-none hidden md:block"
      >
        <div className="w-24 h-24 border-2 border-dashed border-[#FDF6E3] rounded-full flex items-center justify-center font-black text-[10px] uppercase text-center p-2 tracking-widest">
          Freshly Baked Daily
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- TOP ROW: NEWSLETTER ARCH BANNER --- */}
        <div className="bg-[#FDF6E3] text-[#4A2C2A] rounded-[40px] p-8 md:p-12 border-[3px] border-[#4A2C2A] shadow-[8px_8px_0px_0px_#C84B31] mb-20 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-2 max-w-lg text-center md:text-left">
            <span className="bg-[#C84B31] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block">
              Warm Inbox Club ✨
            </span>
            <h4 className="text-3xl md:text-4xl italic font-bold tracking-tighter lowercase">
              get fresh recipes & secret drops
            </h4>
            <p className="text-xs font-sans font-semibold opacity-80">
              No spam, just cozy recipes, baking hacks, and exclusive discount drops.
            </p>
          </div>

          <div className="w-full md:w-auto flex-1 max-w-md">
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="enter your cozy email..." 
                className="w-full bg-[#FDF6E3] border-[3px] border-[#4A2C2A] rounded-full px-6 py-3 text-xs font-sans font-semibold placeholder-[#4A2C2A]/50 focus:outline-none shadow-[4px_4px_0px_0px_#4A2C2A]"
              />
              <button className="bg-[#4A2C2A] text-[#FDF6E3] px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-black border-[2px] border-[#4A2C2A] hover:bg-[#C84B31] transition-all shadow-[4px_4px_0px_0px_#4A2C2A] whitespace-nowrap">
                Join In
              </button>
            </form>
          </div>
        </div>

        {/* --- MIDDLE ROW: BRAND, AUTH & NAVIGATION GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#FDF6E3]/15">
          
          {/* BRAND, USER STATUS & SHORT BIO */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-4">
              <h2 className="text-4xl italic font-bold tracking-tighter">Cinnabloom</h2>
              
              {/* --- DYNAMIC AUTH STATUS / AVATAR WITH LINK TO PROFILE --- */}
              {user ? (
                <Link href="/profile">
                  <div className="flex items-center gap-2 bg-[#FDF6E3]/10 border border-[#FDF6E3]/30 px-3 py-1.5 rounded-full hover:bg-[#FDF6E3]/20 transition-all cursor-pointer">
                    {userAvatar ? (
                      <Image
                        src={userAvatar}
                        alt={user.name || "User Profile"}
                        width={28}
                        height={28}
                        className="rounded-full object-cover border border-[#FDF6E3] w-7 h-7"
                        unoptimized
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#C84B31] text-[#FDF6E3] flex items-center justify-center font-black text-xs border border-[#FDF6E3]">
                        {userInitial}
                      </div>
                    )}
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FDF6E3] pr-1">
                      {user.name ? user.name.split(" ")[0] : "Baker"}
                    </span>
                  </div>
                </Link>
              ) : (
                <Link href="/login">
                  <button className="bg-[#C84B31] text-white hover:bg-[#FDF6E3] hover:text-[#4A2C2A] px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-black border border-[#FDF6E3]/20 transition-all shadow-sm">
                    Log In
                  </button>
                </Link>
              )}
            </div>

            <p className="text-xs font-sans opacity-70 leading-relaxed max-w-sm">
              Crafting gooey, golden perfection for your quiet mornings and cozy gatherings. Made with all-natural ingredients and a touch of magic.
            </p>

            {/* --- FULL-BLEED SOCIAL MEDIA IMAGE ICONS --- */}
            <div className="flex items-center gap-3 pt-2">
              {socialIcons.map((social) => (
                <a 
                  key={social.name} 
                  href="#"
                  aria-label={social.name}
                  className="relative w-10 h-10 rounded-full overflow-hidden transition-all hover:scale-110 shadow-sm block"
                >
                  <Image 
                    src={social.icon} 
                    alt={social.alt} 
                    fill
                    className="object-cover"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="md:col-span-3 space-y-4">
            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-[#C84B31]">Explore Menu</p>
            <ul className="space-y-2.5 text-xs font-sans font-semibold opacity-80">
              <li><Link href="/explore" className="hover:text-[#C84B31] transition-colors">Explore Menu</Link></li>
              <li><Link href="/contact" className="hover:text-[#C84B31] transition-colors">Contact</Link></li>
              <li><Link href="/about" className="hover:text-[#C84B31] transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* COZY HELP & HOURS */}
          <div className="md:col-span-4 space-y-4">
            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-[#C84B31]">Bakery Hours & Care</p>
            <div className="bg-[#FDF6E3]/5 p-5 rounded-2xl border border-[#FDF6E3]/10 space-y-2">
              <p className="text-[11px] font-sans font-bold">Oven Hours:</p>
              <p className="text-xs font-sans opacity-70">Tue – Sun: 7:00 AM – 4:00 PM</p>
              <p className="text-[11px] font-sans font-bold pt-2">Questions?</p>
              <p className="text-xs font-sans opacity-70">hello@cinnabloom.com</p>
            </div>
          </div>

        </div>

        {/* --- BOTTOM ROW: COPYRIGHT & LEGAL --- */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] font-sans opacity-60 gap-4">
          <p>© {new Date().getFullYear()} Cinnabloom Bakery. All rights unrolled with love.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Treat</Link>
            <Link href="/faq" className="hover:underline">Baking FAQ</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}