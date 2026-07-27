"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: 'general', message: '' });
    }, 4000);
  };

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
              <Sparkles size={12} /> We'd Love To Chat
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl"
          >
            <span className="uppercase tracking-[0.35em] text-[10px] font-black text-[#B85042] bg-[#B85042]/10 px-4 py-1.5 rounded-full border border-[#B85042]/30 inline-block mb-4">
              Get In Touch
            </span>
            <h1 className="text-5xl md:text-7xl italic font-bold tracking-tighter leading-none mb-4">
              say hello to cinnabloom
            </h1>
            <p className="font-sans text-xs md:text-sm font-semibold opacity-85 leading-relaxed max-w-md mx-auto">
              Questions about special catering orders, custom flavor boxes, or just want to tell us your favorite roll? Drop us a note!
            </p>
          </motion.div>
        </div>
      </header>

      {/* --- MAIN CONTENT GRID --- */}
      <main className="max-w-6xl mx-auto px-6 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- LEFT: CONTACT INFO CARDS (5 Cols) --- */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Shop Location Card */}
          <div className="bg-[#FDF6E3] border-[3px] border-[#4A2C2A] rounded-[30px] p-6 shadow-[6px_6px_0px_0px_#4A2C2A] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#A0C4DF] rounded-2xl border-[2px] border-[#4A2C2A] flex items-center justify-center shadow-sm">
                <MapPin size={20} className="text-[#4A2C2A]" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#B85042]">VISIT OUR BAKERY</span>
                <h3 className="text-xl italic font-bold">124 Baker Street, Bloom District</h3>
              </div>
            </div>
            <p className="font-sans text-xs opacity-80 pl-13">
              Right next to the central park fountain. Smells like cinnamon from two blocks away!
            </p>
          </div>

          {/* Operating Hours Card */}
          <div className="bg-[#FDF6E3] border-[3px] border-[#4A2C2A] rounded-[30px] p-6 shadow-[6px_6px_0px_0px_#4A2C2A] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#B85042] text-white rounded-2xl border-[2px] border-[#4A2C2A] flex items-center justify-center shadow-sm">
                <Clock size={20} />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#B85042]">OVEN HOURS</span>
                <h3 className="text-xl italic font-bold">Fresh Bakes Daily</h3>
              </div>
            </div>
            <div className="font-sans text-xs opacity-85 space-y-1.5 pl-1">
              <div className="flex justify-between border-b border-[#4A2C2A]/10 pb-1">
                <span>Mon – Fri:</span>
                <span className="font-bold">7:00 AM – 6:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-[#4A2C2A]/10 pb-1">
                <span>Sat – Sun:</span>
                <span className="font-bold">8:00 AM – 4:00 PM</span>
              </div>
            </div>
          </div>

          {/* Quick Contact Methods */}
          <div className="bg-[#FDF6E3] border-[3px] border-[#4A2C2A] rounded-[30px] p-6 shadow-[6px_6px_0px_0px_#4A2C2A] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#A0C4DF] rounded-2xl border-[2px] border-[#4A2C2A] flex items-center justify-center shadow-sm">
                <Phone size={20} className="text-[#4A2C2A]" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#B85042]">DIRECT CALL OR EMAIL</span>
                <h3 className="text-xl italic font-bold">(555) 839-2253</h3>
              </div>
            </div>
            <p className="font-sans text-xs opacity-80 flex items-center gap-2">
              <Mail size={14} className="text-[#B85042]" /> hello@cinnabloom.com
            </p>
          </div>

        </div>

        {/* --- RIGHT: INTERACTIVE CONTACT FORM (7 Cols) --- */}
        <div className="lg:col-span-7">
          <div className="bg-[#FDF6E3] border-[3px] border-[#4A2C2A] rounded-[35px] p-8 md:p-10 shadow-[8px_8px_0px_0px_#4A2C2A] relative">
            
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare size={18} className="text-[#B85042]" />
              <h3 className="text-2xl italic font-bold">send a message</h3>
            </div>

            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#A0C4DF]/30 border-[2.5px] border-[#4A2C2A] rounded-2xl p-8 text-center space-y-3"
              >
                <CheckCircle2 size={40} className="mx-auto text-[#B85042]" />
                <h4 className="text-2xl italic font-bold">Message Freshly Delivered!</h4>
                <p className="font-sans text-xs font-semibold opacity-85">
                  Thank you! Our baking crew will get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5">
                    Your Name
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Clara Bloom"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white border-[2.5px] border-[#4A2C2A] rounded-2xl px-4 py-3 text-xs font-sans font-bold focus:outline-none focus:ring-2 focus:ring-[#A0C4DF] shadow-[3px_3px_0px_0px_#4A2C2A]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    required
                    placeholder="clara@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white border-[2.5px] border-[#4A2C2A] rounded-2xl px-4 py-3 text-xs font-sans font-bold focus:outline-none focus:ring-2 focus:ring-[#A0C4DF] shadow-[3px_3px_0px_0px_#4A2C2A]"
                  />
                </div>

                {/* Subject Selector */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5">
                    Inquiry Type
                  </label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-white border-[2.5px] border-[#4A2C2A] rounded-2xl px-4 py-3 text-xs font-sans font-bold focus:outline-none focus:ring-2 focus:ring-[#A0C4DF] shadow-[3px_3px_0px_0px_#4A2C2A] cursor-pointer"
                  >
                    <option value="general">General Question</option>
                    <option value="catering">Custom Event / Catering Box</option>
                    <option value="feedback">Bakery Feedback</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5">
                    Your Message
                  </label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Tell us what's on your mind or what special treats you're looking for..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-white border-[2.5px] border-[#4A2C2A] rounded-2xl p-4 text-xs font-sans font-bold focus:outline-none focus:ring-2 focus:ring-[#A0C4DF] shadow-[3px_3px_0px_0px_#4A2C2A] resize-none"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full bg-[#4A2C2A] text-[#FDF6E3] py-4 rounded-2xl border-[2.5px] border-[#4A2C2A] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#B85042] hover:bg-[#382120] transition-colors"
                >
                  <Send size={15} /> Send Message
                </motion.button>
              </form>
            )}

          </div>
        </div>

      </main>
    </div>
  );
}