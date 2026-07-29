"use client";
import React, { useEffect, useState } from 'react';

interface FullscreenLoaderProps {
  /** Optional delay in ms to keep the splash visible for visual impact */
  minLoadingTime?: number;
  /** Optional prop for fullScreen mode */
  fullScreen?: boolean;
  /** Optional custom text label */
  label?: string;
}

export default function FullscreenLoader({ 
  minLoadingTime = 1200,
  fullScreen = true,
  label = "Organizing the bakery..."
}: FullscreenLoaderProps) {
  const [mounted, setMounted] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handlePageLoad = () => {
      setIsFadingOut(true);
      const unmountTimeout = setTimeout(() => {
        setMounted(false);
        document.body.style.overflow = '';
      }, 600);
      
      return () => clearTimeout(unmountTimeout);
    };

    if (document.readyState === 'complete') {
      const visualDelay = setTimeout(handlePageLoad, minLoadingTime);
      return () => clearTimeout(visualDelay);
    } else {
      window.addEventListener('load', handlePageLoad);
      return () => window.removeEventListener('load', handlePageLoad);
    }
  }, [minLoadingTime]);

  if (!mounted) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes cosmic-orbit {
          0% { transform: rotate(0deg); filter: blur(4px); }
          50% { transform: rotate(180deg); filter: blur(8px); opacity: 0.85; }
          100% { transform: rotate(360deg); filter: blur(4px); }
        }
        @keyframes core-pulse {
          0%, 100% { transform: scale(1); filter: blur(3px); opacity: 0.95; }
          50% { transform: scale(1.15); filter: blur(6px); opacity: 0.7; }
        }
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
      `}} />

      {/* Backdrop */}
      <div 
        className={`${
          fullScreen ? 'fixed inset-0 w-screen h-screen' : 'relative w-full h-full min-h-[300px]'
        } bg-[#D0E3EA] flex flex-col items-center justify-center z-[99999] transition-opacity duration-600 ease-out select-none pointer-events-auto ${
          isFadingOut ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="relative w-24 h-24 flex items-center justify-center">
          
          {/* Outer Ring */}
          <div 
            className="absolute inset-0 rounded-full border-2 border-t-[#3D2B1F] border-r-transparent border-b-[#3D2B1F]/20 border-l-transparent"
            style={{
              animation: 'cosmic-orbit 3s infinite linear',
            }}
          />

          {/* Inner Ring */}
          <div 
            className="absolute w-[80%] h-[80%] rounded-full border-[3px] border-t-transparent border-r-[#C27B66] border-b-transparent border-l-[#C27B66]/40"
            style={{
              animation: 'cosmic-orbit 1.8s infinite linear reverse',
            }}
          />

          {/* Core */}
          <div 
            className="absolute w-4 h-4 bg-[#FDF6E3] rounded-full shadow-[0_0_20px_6px_rgba(194,123,102,0.4)]"
            style={{
              animation: 'core-pulse 2s infinite ease-in-out',
            }}
          />
        </div>

        {/* Minimal Typographic Anchor */}
        <div className="mt-8 flex flex-col items-center gap-1.5">
          <span 
            className="text-[11px] font-bold text-[#3D2B1F] tracking-[0.35em] uppercase font-sans opacity-85"
          >
            {label}
          </span>

          <div className="w-14 h-[2px] bg-[#EBE1D1] relative overflow-hidden rounded-full">
            <div 
              className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-[#C27B66] to-transparent translate-x-[-100%]" 
              style={{ animation: 'shimmer 1.5s infinite linear' }}
            />
          </div>
        </div>
      </div>
    </>
  );
}