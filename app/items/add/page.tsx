"use client";

import React, { useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Plus, Image as ImageIcon, Tag, Utensils, Loader2, Wand2 } from "lucide-react";
import Link from "next/link";

// 🟢 Dynamically uses production backend URL or defaults to localhost in dev
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AddItemPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // AI Generator States
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiLength, setAiLength] = useState<"short" | "medium" | "detailed">("medium");

  const [formData, setFormData] = useState({
    product_name: "",
    product_price: "",
    product_description: "",
    img_url: "",
    category_id: "pastries",
    flavor: "sweet",
    country_of_origin: "",
    is_featured: false,
  });

  // Handler to call the Gemini AI Description Route
  const handleGenerateAIDescription = async () => {
    if (!formData.product_name.trim()) {
      alert("Please enter a Product Name first so the AI knows what to write about!");
      return;
    }

    setIsGeneratingAI(true);
    try {
      const res = await fetch("/api/generate-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.product_name,
          category: formData.category_id,
          flavor: formData.flavor,
          length: aiLength,
        }),
      });

      const data = await res.json();

      if (res.ok && data.description) {
        setFormData((prev) => ({ ...prev, product_description: data.description }));
      } else {
        alert(data.error || "Could not generate AI description.");
      }
    } catch (err) {
      console.error("AI Generation error:", err);
      alert("Network error while calling AI service.");
    } fontally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      product_name: formData.product_name,
      product_price: Number(formData.product_price),
      product_description: formData.product_description,
      img_url: formData.img_url,
      category_id: formData.category_id,
      flavor: formData.flavor || undefined,
      country_of_origin: formData.country_of_origin || undefined,
      is_featured: formData.is_featured,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/foods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/items/manage");
      } else {
        const errorData = await res.json().catch(() => null);
        alert(errorData?.message || `Failed to add item. Status: ${res.status}`);
      }
    } catch (err) {
      console.error("Failed to add item:", err);
      alert("Network error: Could not connect to backend server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div 
        className="min-h-screen font-serif text-[#4A2C2A] bg-[#FDF6E3] relative bg-repeat pt-32 pb-24 px-6"
        style={{ 
          backgroundImage: "url('/images/bg.png')",
          backgroundSize: '400px auto',
        }}
      >
        {/* Soft Cream Overlay */}
        <div className="absolute inset-0 bg-[#FDF6E3]/85 pointer-events-none z-0" />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/items/manage"
              className="inline-flex items-center gap-2 bg-[#FDF6E3] border-[3px] border-[#4A2C2A] px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#4A2C2A] hover:-translate-y-0.5 transition-all"
            >
              <ArrowLeft size={14} /> Back to Inventory
            </Link>

            <span className="bg-[#9EC5D6] text-[#4A2C2A] border-[2px] border-[#4A2C2A] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5">
              <Sparkles size={12} /> Kitchen Secret Vault
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* --- CUTE FORM SECTION --- */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-7 bg-[#FDF6E3] border-[3px] border-[#4A2C2A] rounded-[35px] p-8 md:p-10 shadow-[10px_10px_0px_0px_#4A2C2A] relative overflow-hidden"
            >
              {/* Decorative Ribbon Tag */}
              <div className="absolute -top-1 -right-1 bg-[#C84B31] text-white px-6 py-1.5 rounded-bl-2xl font-black text-[9px] uppercase tracking-widest border-b-2 border-l-2 border-[#4A2C2A]">
                Fresh Recipe 🥐
              </div>

              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold italic tracking-tight text-[#4A2C2A] mb-2">
                  Bake Something New
                </h1>
                <p className="text-xs font-sans font-medium opacity-75">
                  Fill in the sweet details below to publish a new creation to the live menu.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Name */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#4A2C2A] mb-2 flex items-center gap-1.5">
                    <Utensils size={13} className="text-[#C84B31]" /> Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.product_name}
                    onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                    placeholder="e.g. Cardamom Honey Swirl"
                    className="w-full bg-[#FFFDF5] border-[3px] border-[#4A2C2A] rounded-2xl px-4 py-3 text-xs font-sans font-semibold focus:outline-none focus:ring-2 focus:ring-[#C84B31] shadow-[3px_3px_0px_0px_#4A2C2A]"
                  />
                </div>

                {/* Price & Image URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#4A2C2A] mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.product_price}
                      onChange={(e) => setFormData({ ...formData, product_price: e.target.value })}
                      placeholder="6.50"
                      className="w-full bg-[#FFFDF5] border-[3px] border-[#4A2C2A] rounded-2xl px-4 py-3 text-xs font-sans font-semibold focus:outline-none focus:ring-2 focus:ring-[#C84B31] shadow-[3px_3px_0px_0px_#4A2C2A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#4A2C2A] mb-2 flex items-center gap-1.5">
                      <ImageIcon size={13} className="text-[#9EC5D6]" /> Image URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.img_url}
                      onChange={(e) => setFormData({ ...formData, img_url: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-[#FFFDF5] border-[3px] border-[#4A2C2A] rounded-2xl px-4 py-3 text-xs font-sans font-semibold focus:outline-none focus:ring-2 focus:ring-[#C84B31] shadow-[3px_3px_0px_0px_#4A2C2A]"
                    />
                  </div>
                </div>

                {/* Category, Flavor & Origin */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#4A2C2A] mb-2 flex items-center gap-1">
                      <Tag size={12} /> Category *
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full bg-[#FFFDF5] border-[3px] border-[#4A2C2A] rounded-2xl px-3 py-3 text-xs font-sans font-bold focus:outline-none focus:ring-2 focus:ring-[#C84B31] shadow-[3px_3px_0px_0px_#4A2C2A]"
                    >
                      <option value="pastries">Pastries</option>
                      <option value="cakes">Cakes</option>
                      <option value="cookies">Cookies</option>
                      <option value="buns">Buns</option>
                      <option value="drinks">Drinks</option>
                      <option value="dumplings">Dumplings</option>
                      <option value="ramens">Ramens</option>
                      <option value="stew/soup">Stew/Soup</option>
                      <option value="fried">Fried</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#4A2C2A] mb-2">
                      Flavor Profile
                    </label>
                    <select
                      value={formData.flavor}
                      onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
                      className="w-full bg-[#FFFDF5] border-[3px] border-[#4A2C2A] rounded-2xl px-3 py-3 text-xs font-sans font-bold focus:outline-none focus:ring-2 focus:ring-[#C84B31] shadow-[3px_3px_0px_0px_#4A2C2A]"
                    >
                      <option value="sweet">Sweet</option>
                      <option value="savory">Savory</option>
                      <option value="sour">Sour</option>
                      <option value="spicy">Spicy</option>
                      <option value="salty">Salty</option>
                      <option value="tangy">Tangy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#4A2C2A] mb-2">
                      Origin
                    </label>
                    <input
                      type="text"
                      value={formData.country_of_origin}
                      onChange={(e) => setFormData({ ...formData, country_of_origin: e.target.value })}
                      placeholder="e.g. Sweden"
                      className="w-full bg-[#FFFDF5] border-[3px] border-[#4A2C2A] rounded-2xl px-3 py-3 text-xs font-sans font-semibold focus:outline-none focus:ring-2 focus:ring-[#C84B31] shadow-[3px_3px_0px_0px_#4A2C2A]"
                    />
                  </div>
                </div>

                {/* --- DESCRIPTION WITH AI GENERATOR TOOLKIT --- */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#4A2C2A]">
                      Description *
                    </label>

                    {/* AI Toolbar Controls */}
                    <div className="flex items-center gap-2">
                      {/* Length Pills */}
                      <div className="flex items-center bg-[#FFFDF5] border-[2px] border-[#4A2C2A] rounded-full p-0.5 text-[9px] font-black uppercase">
                        {(["short", "medium", "detailed"] as const).map((len) => (
                          <button
                            key={len}
                            type="button"
                            onClick={() => setAiLength(len)}
                            className={`px-2.5 py-1 rounded-full transition-all ${
                              aiLength === len
                                ? "bg-[#4A2C2A] text-[#FDF6E3]"
                                : "text-[#4A2C2A] hover:opacity-70"
                            }`}
                          >
                            {len}
                          </button>
                        ))}
                      </div>

                      {/* Bake with AI Magic Button */}
                      <button
                        type="button"
                        onClick={handleGenerateAIDescription}
                        disabled={isGeneratingAI}
                        className="bg-[#9EC5D6] hover:bg-[#8BB5C6] text-[#4A2C2A] border-[2px] border-[#4A2C2A] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#4A2C2A] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                      >
                        {isGeneratingAI ? (
                          <>
                            <Loader2 size={12} className="animate-spin" /> Baking AI...
                          </>
                        ) : (
                          <>
                            <Wand2 size={12} /> Bake with AI ✨
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    required
                    value={formData.product_description}
                    onChange={(e) => setFormData({ ...formData, product_description: e.target.value })}
                    placeholder="Describe the texture, warm spices, and magic inside, or click 'Bake with AI ✨' above!"
                    className="w-full bg-[#FFFDF5] border-[3px] border-[#4A2C2A] rounded-2xl p-4 text-xs font-sans font-semibold focus:outline-none focus:ring-2 focus:ring-[#C84B31] shadow-[3px_3px_0px_0px_#4A2C2A]"
                  />
                </div>

                {/* Featured Badge Toggle */}
                <div className="flex items-center gap-3 bg-[#9EC5D6]/20 p-4 rounded-2xl border-[2px] border-[#4A2C2A]/30">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-5 h-5 accent-[#C84B31] cursor-pointer"
                  />
                  <label htmlFor="is_featured" className="text-xs font-bold text-[#4A2C2A] cursor-pointer">
                    Highlight as <span className="italic text-[#C84B31]">Baker's Pick ✨</span> on Homepage
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#4A2C2A] text-[#FDF6E3] hover:bg-[#C84B31] py-4 rounded-full text-xs uppercase font-black tracking-widest border-[3px] border-[#4A2C2A] transition-all shadow-[5px_5px_0px_0px_#4A2C2A] active:translate-y-1 active:shadow-none disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus size={16} strokeWidth={3} />
                  {isSubmitting ? "Baking into Database..." : "Add to Kitchen Menu"}
                </button>
              </form>
            </motion.div>

            {/* --- LIVE PREVIEW CARD (RIGHT SIDE) --- */}
            <div className="lg:col-span-5 sticky top-32">
              <div className="mb-3 text-center lg:text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#4A2C2A]/70 italic">
                  — Live Card Preview
                </span>
              </div>

              <div className="bg-[#FDF6E3] border-[3px] border-[#4A2C2A] rounded-[35px] p-6 shadow-[8px_8px_0px_0px_#4A2C2A] relative">
                {formData.is_featured && (
                  <div className="absolute -top-3 -left-3 bg-[#C84B31] text-white px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter border-2 border-[#4A2C2A] rotate-[-5deg] z-20 shadow-sm">
                    Baker's Pick ✨
                  </div>
                )}

                <div className="absolute -top-3 -right-3 bg-[#4A2C2A] text-[#FDF6E3] w-14 h-14 rounded-full flex items-center justify-center font-black text-[10px] rotate-12 border-2 border-[#FDF6E3] shadow-md z-10">
                  ${formData.product_price ? Number(formData.product_price).toFixed(2) : "0.00"}
                </div>

                {/* Image Frame */}
                <div className="w-full aspect-square bg-white/70 rounded-[25px] border-2 border-[#4A2C2A]/10 mb-6 overflow-hidden flex items-center justify-center p-6 relative">
                  {formData.img_url ? (
                    <img
                      src={formData.img_url}
                      alt="Preview"
                      className="w-full h-full object-contain drop-shadow-xl"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="text-center opacity-40 space-y-1">
                      <ImageIcon size={32} className="mx-auto text-[#4A2C2A]" />
                      <p className="text-[10px] font-bold uppercase tracking-wider">Paste Image URL</p>
                    </div>
                  )}
                </div>

                <h4 className="text-2xl italic font-bold lowercase tracking-tighter mb-2 text-[#4A2C2A]">
                  {formData.product_name || "Untitled Creation"}
                </h4>

                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#9EC5D6] text-[#4A2C2A] px-3 py-0.5 rounded-full text-[8px] font-black uppercase border border-[#4A2C2A]">
                    {formData.category_id}
                  </span>
                  {formData.flavor && (
                    <span className="bg-[#FDF6E3] text-[#C84B31] px-3 py-0.5 rounded-full text-[8px] font-black uppercase border border-[#C84B31]">
                      {formData.flavor}
                    </span>
                  )}
                </div>

                <p className="text-xs font-sans font-medium opacity-80 leading-relaxed mb-6 line-clamp-3">
                  {formData.product_description || "Your delicious product description will appear right here..."}
                </p>

                <div className="w-full bg-[#4A2C2A] text-[#FDF6E3] py-3 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest opacity-90">
                  + Add to Bag Sample
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}