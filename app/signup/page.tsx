"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { 
  User, 
  Mail, 
  Lock, 
  Image as ImageIcon, 
  ArrowRight, 
  Loader2, 
  Sparkles, 
  Eye, 
  EyeOff, 
  AlertCircle 
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

// 🟢 Dynamically uses production backend URL or defaults to localhost in dev
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SignupPage() {
  const { loginUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  // --- MANUAL FORM SIGNUP ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          profileImage: formData.profileImage.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create account.");
      }

      loginUser(data.token, data.user);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- GOOGLE OAUTH SUCCESS HANDLER ---
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("No Google credential received.");
      }

      const decoded: any = jwtDecode(credentialResponse.credential);

      const googleUserData = {
        id: decoded.sub,
        name: decoded.name || "Google User",
        email: decoded.email,
        profileImage: decoded.picture,
        role: "user",
      };

      // Send Google credential data to backend
      const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential, user: googleUserData }),
      });

      if (res.ok) {
        const data = await res.json();
        loginUser(data.token, data.user);
      } else {
        // Fallback state if backend route fails
        loginUser(credentialResponse.credential, googleUserData);
      }
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setError("Google Sign-In failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    setError("Google Sign-In was cancelled or failed.");
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 font-sans bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('/images/bg.png')`,
        backgroundColor: '#D0E3EA' // Faded sky blue fallback
      }}
    >
      {/* Soft Overlay Tint */}
      <div className="absolute inset-0 bg-[#D0E3EA]/40 backdrop-blur-[2px]" />

      {/* Main Glassmorphic Card */}
      <div className="relative w-full max-w-md bg-[#FAF7F2]/90 backdrop-blur-md border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 shadow-xl">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-[#D0E3EA]/50 px-3.5 py-1 rounded-full border border-[#B0CEDB] mb-3">
            <Sparkles size={13} className="text-[#D96B6B]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A7A88]">Join the Bakery</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#3E3835]">Create Account</h1>
          <p className="text-xs text-[#7A736E] mt-1">Start saving your favorite sweet treats ✨</p>
        </div>

        {/* Muted Red Error Box */}
        {error && (
          <div className="mb-4 p-3 bg-[#FDF0F0] border border-[#F2C2C2] text-[#D96B6B] rounded-xl text-xs font-medium text-center shadow-sm flex items-center justify-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* --- GOOGLE SIGNUP BUTTON --- */}
        <div className="mb-5 flex flex-col items-center">
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              shape="circle"
              width="100%"
              text="signup_with"
            />
          </div>

          {/* Divider */}
          <div className="relative w-full my-5 flex items-center justify-center">
            <div className="w-full border-t border-[#E5E0D8]"></div>
            <span className="absolute bg-[#FAF7F2] px-3 text-[10px] font-bold uppercase tracking-wider text-[#7A736E]">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-[#3E3835] mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Jane Doe"
                className="w-full text-xs pl-9 pr-4 py-2.5 bg-[#FFFDF9] border border-[#E5E0D8] rounded-xl text-[#3E3835] focus:outline-none focus:border-[#5A7A88] transition-all placeholder:text-[#A39E93]"
              />
              <User size={14} className="absolute left-3 top-3 text-[#A39E93]" />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-[#3E3835] mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="baker@cinnabloom.com"
                className="w-full text-xs pl-9 pr-4 py-2.5 bg-[#FFFDF9] border border-[#E5E0D8] rounded-xl text-[#3E3835] focus:outline-none focus:border-[#5A7A88] transition-all placeholder:text-[#A39E93]"
              />
              <Mail size={14} className="absolute left-3 top-3 text-[#A39E93]" />
            </div>
          </div>

          {/* Avatar Image URL (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#3E3835]">Avatar Image URL</label>
              <span className="text-[10px] font-semibold text-[#A39E93]">Optional</span>
            </div>
            <div className="relative">
              <input
                type="url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                placeholder="https://example.com/avatar.png"
                className="w-full text-xs pl-9 pr-4 py-2.5 bg-[#FFFDF9] border border-[#E5E0D8] rounded-xl text-[#3E3835] focus:outline-none focus:border-[#5A7A88] transition-all placeholder:text-[#A39E93]"
              />
              <ImageIcon size={14} className="absolute left-3 top-3 text-[#A39E93]" />
            </div>
          </div>

          {/* Passwords Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-[#3E3835] mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full text-xs pl-9 pr-8 py-2.5 bg-[#FFFDF9] border border-[#E5E0D8] rounded-xl text-[#3E3835] focus:outline-none focus:border-[#5A7A88] transition-all placeholder:text-[#A39E93]"
                />
                <Lock size={14} className="absolute left-3 top-3 text-[#A39E93]" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-3 text-[#A39E93] hover:text-[#3E3835] focus:outline-none"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-[#3E3835] mb-1">Confirm</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full text-xs pl-9 pr-8 py-2.5 bg-[#FFFDF9] border border-[#E5E0D8] rounded-xl text-[#3E3835] focus:outline-none focus:border-[#5A7A88] transition-all placeholder:text-[#A39E93]"
                />
                <Lock size={14} className="absolute left-3 top-3 text-[#A39E93]" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-3 text-[#A39E93] hover:text-[#3E3835] focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* CTA Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#D96B6B] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#C25858] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-4 cursor-pointer"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                Sign Up <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-[#7A736E] mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-[#D96B6B] font-bold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}