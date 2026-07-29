"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Menu, X, LayoutDashboard, PlusCircle, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; 

export default function Header() {
  const router = useRouter();
  const { user, logoutUser: logout } = useAuth(); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [orderCount, setOrderCount] = useState<number>(0);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);

  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin';
  const dashboardPath = '/items/manage';

  // Helper to resolve profile picture across all possible schema property names
  const getUserAvatar = () => {
    if (!user) return null;
    const u = user as any;
    const rawUrl = u.avatar || u.profilePicture || u.photoUrl;
    if (rawUrl && typeof rawUrl === "string" && rawUrl.trim() !== "" && !rawUrl.includes("ui-avatars.com")) {
      return rawUrl;
    }
    return null;
  };

  const userAvatarUrl = getUserAvatar();

  useEffect(() => {
    const syncOrderCount = () => {
      const saved = localStorage.getItem("chirp_history");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setOrderCount(parsed.length);
          }
        } catch (e) {
          setOrderCount(0);
        }
      }
    };

    syncOrderCount();
    window.addEventListener("chirp_order_placed", syncOrderCount);
    return () => window.removeEventListener("chirp_order_placed", syncOrderCount);
  }, []);

  return (
    <header className="w-full fixed top-0 left-0 z-[9999]">

      {/* MAIN NAVBAR - Rounded Container */}
      <nav className="bg-[#FFFDF5]/95 backdrop-blur-md px-6 md:px-10 py-3.5 flex items-center justify-between text-[#4A2C2A] border-b border-[#E8E1D5] shadow-xs">
        
        {/* LOGO */}
        <Link 
          href="/" 
          className="text-3xl md:text-4xl font-black italic tracking-tight hover:opacity-80 transition-all text-[#3E3835]"
        >
          Cinnabloom
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center gap-2 text-[13px] lowercase font-bold tracking-wide">
          <Link href="/" className="px-3.5 py-1.5 rounded-full hover:bg-[#F3EDE2] transition-colors">
            home
          </Link>
          <Link href="/explore" className="px-3.5 py-1.5 rounded-full hover:bg-[#F3EDE2] transition-colors">
            explore menu
          </Link>
          <Link href="/about" className="px-3.5 py-1.5 rounded-full hover:bg-[#F3EDE2] transition-colors">
            about us
          </Link>
          <Link href="/contact" className="px-3.5 py-1.5 rounded-full hover:bg-[#F3EDE2] transition-colors">
            contact
          </Link>

          {/* LOGGED IN NAVIGATION */}
          {isLoggedIn && (
            <Link 
              href={dashboardPath} 
              className="px-3.5 py-1.5 rounded-full bg-[#EBF3F5] text-[#3D6B7B] hover:bg-[#DCEBF0] transition-colors flex items-center gap-1 font-bold"
            >
              <LayoutDashboard size={14} /> dashboard
            </Link>
          )}

          {/* ADMIN-ONLY ACTION */}
          {isLoggedIn && isAdmin && (
            <Link 
              href="/items/add" 
              className="px-3.5 py-1.5 rounded-full bg-[#FDF0F0] text-[#D96B6B] hover:bg-[#FADEDE] transition-colors flex items-center gap-1 font-bold"
            >
              <PlusCircle size={14} /> bake item
            </Link>
          )}

          {/* PUBLIC AUTH LINKS */}
          {!isLoggedIn && (
            <>
              <Link href="/signup" className="px-3.5 py-1.5 rounded-full hover:bg-[#F3EDE2] transition-colors">
                signup
              </Link>
              <Link href="/login" className="px-3.5 py-1.5 rounded-full hover:bg-[#F3EDE2] transition-colors">
                login
              </Link>
            </>
          )}
        </div>

        {/* RIGHT SIDE - ORDER HISTORY & AVATAR */}
        <div className="flex items-center gap-4">

          {/* ORDER HISTORY ICON */}
          <Link 
            href="/order-history" 
            title="Order History & Live Tracker"
            className="relative p-2 rounded-full hover:bg-[#F3EDE2] transition-all group"
          >
            <ShoppingBag size={21} className="group-hover:scale-105 transition-transform text-[#4A2C2A]" />
            {orderCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#D96B6B] text-[#FFFDF5] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {orderCount}
              </span>
            )}
          </Link>

          {/* USER AVATAR OR LOGIN BUTTON */}
          {isLoggedIn ? (
            <div 
              className="relative"
              onMouseEnter={() => setUserDropdownOpen(true)}
              onMouseLeave={() => setUserDropdownOpen(false)}
            >
              <button
                onClick={() => {
                  setUserDropdownOpen(false);
                  router.push('/profile');
                }}
                className="w-9 h-9 rounded-full bg-[#E5E0D8] border-2 border-[#D96B6B] flex items-center justify-center overflow-hidden hover:scale-105 transition-all shadow-xs cursor-pointer"
                title={user?.name || "Account"}
              >
                {userAvatarUrl ? (
                  <img 
                    src={userAvatarUrl} 
                    alt={user?.name || "User"} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-xs font-black text-[#3E3835]">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={16} />}
                  </span>
                )}
              </button>

              {/* USER PROFILE DROPDOWN */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#FFFDF9] border border-[#E8E1D5] rounded-2xl shadow-lg p-2 flex flex-col gap-1 text-xs font-semibold z-50">
                  <Link 
                    href="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="px-3 py-2 border-b border-[#E8E1D5] mb-1 hover:bg-[#F3EDE2] rounded-xl transition-colors block"
                  >
                    <p className="font-bold text-[#3E3835] truncate">{user?.name || "Welcome!"}</p>
                    <p className="text-[10px] text-[#8C857B] font-normal capitalize">{user?.role || "Customer"}</p>
                  </Link>

                  <Link 
                    href="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="px-3 py-2 rounded-xl hover:bg-[#F3EDE2] flex items-center gap-2 text-[#3E3835]"
                  >
                    <UserIcon size={14} /> Profile
                  </Link>

                  <Link 
                    href={dashboardPath}
                    onClick={() => setUserDropdownOpen(false)}
                    className="px-3 py-2 rounded-xl hover:bg-[#F3EDE2] flex items-center gap-2 text-[#3E3835]"
                  >
                    <LayoutDashboard size={14} /> Dashboard
                  </Link>

                  <Link 
                    href="/order-history"
                    onClick={() => setUserDropdownOpen(false)}
                    className="px-3 py-2 rounded-xl hover:bg-[#F3EDE2] flex items-center gap-2 text-[#3E3835]"
                  >
                    <ShoppingBag size={14} /> Orders ({orderCount})
                  </Link>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FDF0F0] text-[#D96B6B] flex items-center gap-2 font-bold cursor-pointer"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/login" 
              className="p-2 rounded-full hover:bg-[#F3EDE2] transition-all text-[#4A2C2A]"
              title="Log In"
            >
              <UserIcon size={21} />
            </Link>
          )}

          {/* MOBILE TOGGLE MENU */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 rounded-full hover:bg-[#F3EDE2] transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* DASHED RIBBON BORDER */}
      <div 
        className="h-2 w-full bg-[#FFFDF5]"
        style={{
          backgroundImage: `radial-gradient(#D96B6B 35%, transparent 35%)`,
          backgroundPosition: '0 0',
          backgroundSize: '16px 16px',
          backgroundRepeat: 'repeat-x'
        }}
      />

      {/* MOBILE DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFDF5] border-b border-[#E8E1D5] px-6 py-6 flex flex-col gap-3 text-center font-bold lowercase text-sm shadow-md">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-1">home</Link>
          <Link href="/explore" onClick={() => setMobileMenuOpen(false)} className="py-1">explore menu</Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="py-1">about us</Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="py-1">contact</Link>
          
          {isLoggedIn && (
            <>
              <div className="h-[1px] w-12 bg-[#E8E1D5] mx-auto my-1" />
              <Link 
                href="/profile" 
                onClick={() => setMobileMenuOpen(false)} 
                className="text-[#4A2C2A] py-1 flex items-center justify-center gap-1.5"
              >
                <UserIcon size={15} /> profile
              </Link>
              <Link 
                href={dashboardPath} 
                onClick={() => setMobileMenuOpen(false)} 
                className="text-[#3D6B7B] py-1 flex items-center justify-center gap-1.5"
              >
                <LayoutDashboard size={15} /> dashboard
              </Link>
              {isAdmin && (
                <Link 
                  href="/items/add" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="text-[#D96B6B] py-1 flex items-center justify-center gap-1.5"
                >
                  <PlusCircle size={15} /> + bake item
                </Link>
              )}
            </>
          )}

          {!isLoggedIn && (
            <>
              <div className="h-[1px] w-12 bg-[#E8E1D5] mx-auto my-1" />
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="py-1">signup</Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="py-1 text-[#D96B6B]">login</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}