"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Trash2, Eye, RefreshCw, Package, Sparkles } from "lucide-react";

interface IFoodItem {
  _id: string;
  product_name: string;
  product_price: number;
  product_description: string;
  img_url: string;
  category_id: string;
  flavor?: string;
  country_of_origin?: string;
  is_featured?: boolean;
}

// 🟢 Dynamically uses production backend URL or defaults to localhost in dev
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Helper to convert product name to URL-friendly slug matching routing standards
const createSlug = (name: string): string =>
  encodeURIComponent(
    name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
  );

export default function ManageItemsPage() {
  const [items, setItems] = useState<IFoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchItems = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/foods`);
      if (!res.ok) throw new Error(`HTTP Error status: ${res.status}`);

      const data = await res.json();

      let list: IFoodItem[] = [];
      if (Array.isArray(data)) list = data;
      else if (Array.isArray(data.foods)) list = data.foods;
      else if (Array.isArray(data.data)) list = data.data;

      setItems(list);
    } catch (err: any) {
      console.error("Error fetching items:", err);
      setFetchError("Could not reach backend server. Please verify network or API status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this treat from your active menu?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/foods/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setItems((prev) => prev.filter((item) => item._id !== id));
      } else {
        const errData = await res.json().catch(() => null);
        alert(errData?.message || "Failed to remove item.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting item. Network request failed.");
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
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#9EC5D6] text-[#4A2C2A] border-[2px] border-[#4A2C2A] px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-3 shadow-sm">
                <Package size={12} /> Live Kitchen Inventory
              </div>
              <h1 className="text-3xl md:text-5xl font-bold italic tracking-tight text-[#4A2C2A]">
                Manage Bakery Menu
              </h1>
            </div>

            <Link
              href="/items/add"
              className="inline-flex items-center justify-center gap-2 bg-[#C84B31] text-white px-7 py-3.5 rounded-full text-[10px] uppercase font-black tracking-widest border-[3px] border-[#4A2C2A] shadow-[5px_5px_0px_0px_#4A2C2A] hover:bg-[#4A2C2A] hover:text-[#FDF6E3] transition-all"
            >
              <Plus size={16} strokeWidth={3} />
              <span>+ Add New Item</span>
            </Link>
          </div>

          {/* Main Card Container */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FDF6E3] border-[3px] border-[#4A2C2A] rounded-[35px] overflow-hidden shadow-[10px_10px_0px_0px_#4A2C2A]"
          >
            {loading ? (
              <div className="p-16 text-center space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#C84B31]" />
                <p className="text-xs font-sans font-bold opacity-70">Fetching freshest inventory from database...</p>
              </div>
            ) : fetchError ? (
              <div className="p-12 text-center space-y-4">
                <p className="text-xs font-bold text-[#C84B31]">{fetchError}</p>
                <button
                  onClick={fetchItems}
                  className="px-6 py-2.5 bg-[#4A2C2A] text-[#FDF6E3] rounded-full text-[10px] font-black uppercase tracking-widest border-[2px] border-[#4A2C2A] cursor-pointer"
                >
                  Retry Connection
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="p-16 text-center space-y-4">
                <Sparkles size={36} className="mx-auto text-[#9EC5D6]" />
                <p className="text-sm font-semibold opacity-80">Your recipe vault is currently empty!</p>
                <Link
                  href="/items/add"
                  className="inline-block text-xs text-[#C84B31] font-bold underline hover:opacity-80"
                >
                  Bake your first item now
                </Link>
              </div>
            ) : (
              /* --- INTERNAL SCROLL CONTAINER WITH STICKY HEADER --- */
              <div className="max-h-[550px] overflow-y-auto overflow-x-auto">
                <table className="w-full text-left text-xs font-sans text-[#4A2C2A] relative border-collapse">
                  <thead className="bg-[#4A2C2A] text-[#FDF6E3] text-[9px] uppercase font-black tracking-widest sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="py-4 px-6 bg-[#4A2C2A]">Treat</th>
                      <th className="py-4 px-6 bg-[#4A2C2A]">Product Name</th>
                      <th className="py-4 px-6 bg-[#4A2C2A]">Category</th>
                      <th className="py-4 px-6 bg-[#4A2C2A]">Price</th>
                      <th className="py-4 px-6 text-right bg-[#4A2C2A]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#4A2C2A]/15">
                    {items.map((item) => {
                      const productUrl = `/details/${createSlug(item.product_name)}`;

                      return (
                        <tr key={item._id} className="hover:bg-[#9EC5D6]/15 transition-colors">
                          <td className="py-4 px-6">
                            <img
                              src={item.img_url || "/images/star.png"}
                              alt={item.product_name}
                              className="w-12 h-12 object-contain bg-white/80 p-1.5 rounded-2xl border-2 border-[#4A2C2A]/30 shadow-sm"
                            />
                          </td>
                          <td className="py-4 px-6 font-bold text-sm">
                            {item.product_name}
                            {item.is_featured && (
                              <span className="ml-2 text-[8px] bg-[#C84B31] text-white px-2 py-0.5 rounded-full uppercase font-black">
                                Pick ✨
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <span className="bg-[#9EC5D6] text-[#4A2C2A] border border-[#4A2C2A] px-3 py-1 rounded-full text-[9px] font-black uppercase">
                              {item.category_id}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-black text-[#C84B31] text-sm">
                            ${Number(item.product_price).toFixed(2)}
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <Link
                              href={productUrl}
                              className="px-3.5 py-2 rounded-full border-[2px] border-[#4A2C2A] bg-[#FFFDF5] text-[9px] font-black uppercase hover:bg-[#4A2C2A] hover:text-[#FDF6E3] transition-all inline-flex items-center gap-1 shadow-sm"
                            >
                              <Eye size={12} /> View
                            </Link>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="px-3.5 py-2 rounded-full bg-[#C84B31] text-white text-[9px] font-black uppercase border-[2px] border-[#4A2C2A] hover:bg-[#4A2C2A] transition-all inline-flex items-center gap-1 shadow-sm cursor-pointer"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}