"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className="w-full fixed top-0 left-0 z-[9999] shadow-sm">

      {/* 2. MAIN NAVBAR */}
      <nav className="bg-[#FFFDF5] px-6 md:px-12 py-4 flex items-center justify-between text-[#4A2C2A]">
        
        {/* LOGO */}
        <Link href="/" className="text-3xl md:text-4xl font-bold italic tracking-tighter hover:opacity-80 transition-opacity">
          Cinnabloom
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center gap-8 text-[11px] lowercase tracking-wide font-medium">
          <Link href="/" className="hover:opacity-70 transition-opacity">home</Link>
          <Link href="/explore" className="hover:opacity-70 transition-opacity">explore menu</Link>
          <Link href="/about" className="hover:opacity-70 transition-opacity">about us</Link>
          <Link href="/contact" className="hover:opacity-70 transition-opacity">contact</Link>

          {/* PROTECTED ROUTES */}
          {isLoggedIn && (
            <>
              <Link href="/items/add" className="text-red-700 font-bold hover:underline">
                + bake item
              </Link>
              <Link href="/items/manage" className="hover:opacity-70 transition-opacity">
                manage
              </Link>
            </>
          )}
        </div>

        {/* RIGHT SIDE ICONS & AUTH */}
        <div className="flex items-center gap-5">
          <div className="hidden sm:flex items-center gap-3 pr-2 border-r border-[#4A2C2A]/15">
            {/* Native Instagram SVG replacing the broken import */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="cursor-pointer hover:opacity-70 transition-opacity"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
            <Search size={18} className="cursor-pointer hover:opacity-70 transition-opacity" />
          </div>

          <div className="relative cursor-pointer group">
            <ShoppingBag size={19} className="group-hover:scale-105 transition-transform" />
            <span className="absolute -top-1 -right-1.5 bg-[#C84B31] text-[#FFFDF5] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
          </div>

          {isLoggedIn ? (
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="text-[11px] lowercase underline font-medium hover:opacity-70"
            >
              logout
            </button>
          ) : (
            <Link href="/login" className="hover:opacity-70 transition-opacity">
              <User size={19} />
            </Link>
          )}

          {/* MOBILE TOGGLE */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* 3. DASHED RIBBON BORDER */}
      <div 
        className="h-2 w-full bg-[#FFFDF5]"
        style={{
          backgroundImage: `radial-gradient(#C84B31 35%, transparent 35%)`,
          backgroundPosition: '0 0',
          backgroundSize: '16px 16px',
          backgroundRepeat: 'repeat-x'
        }}
      />

      {/* MOBILE DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFDF5] border-b border-[#4A2C2A]/20 px-6 py-6 flex flex-col gap-4 text-center font-medium lowercase text-sm">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>home</Link>
          <Link href="/explore" onClick={() => setMobileMenuOpen(false)}>explore menu</Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)}>about us</Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>contact</Link>
          {isLoggedIn && (
            <>
              <Link href="/items/add" onClick={() => setMobileMenuOpen(false)} className="text-red-700">
                + bake item
              </Link>
              <Link href="/items/manage" onClick={() => setMobileMenuOpen(false)}>
                manage
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}