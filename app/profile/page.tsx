"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import {
  LogOut,
  Paintbrush,
  Eye,
  EyeOff,
  Lock,
  SlidersHorizontal,
  ShieldAlert,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

interface ArtistProfile {
  name: string;
  photoUrl?: string;
  profilePicture?: string;
  avatar?: string;
  role?: string;
}

interface ToastState {
  text: string;
  type: "success" | "error" | "loading";
  icon?: string;
}

export default function ProfilePage() {
  const { user, loading: isLoading, logoutUser: logout, setUser } = useAuth() as any;
  const router = useRouter();
  const params = useParams();

  const profileArtistId = params?.id || user?._id || user?.id;
  const isOwner = Boolean(user && (user._id === profileArtistId || user.id === profileArtistId));

  // Check if the current user logged in via Google
  const isGoogleAccount = Boolean(
    user?.provider === "google" ||
    user?.isGoogleUser ||
    user?.googleId ||
    user?.authProvider === "google"
  );

  const [formData, setFormData] = useState({
    name: "",
    photoUrl: "",
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [publicArtistInfo, setPublicArtistInfo] = useState<ArtistProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState<ToastState | null>(null);

  const triggerToast = (text: string, type: "success" | "error" | "loading", duration = 3000) => {
    setToastMessage({ text, type });
    if (type !== "loading") {
      setTimeout(() => {
        setToastMessage((current) => (current?.text === text ? null : current));
      }, duration);
    }
  };

  // Sync state when user object resolves or updates
  useEffect(() => {
    if (user && isOwner) {
      const savedDbImage = user.profilePicture || user.photoUrl || user.avatar || "";
      setFormData({
        name: user.name || "",
        photoUrl: savedDbImage.includes("ui-avatars.com") ? "" : savedDbImage,
      });
    }
  }, [user, isOwner]);

  // Fetch fresh user data from server on load
  useEffect(() => {
    const fetchFreshUserData = async () => {
      if (isLoading) return;

      if (!user && !params?.id) {
        router.push("/login");
        return;
      }

      if (user && isOwner) {
        try {
          const currentId = user._id || user.id;
          const token = localStorage.getItem("token");

          const res = await fetch(`${API_BASE_URL}/api/auth/user/${currentId}`, {
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          });

          if (res.ok) {
            const data = await res.json();
            const freshUser = data?.user || data;

            if (freshUser) {
              if (setUser) setUser(freshUser);
              localStorage.setItem("user", JSON.stringify(freshUser));

              const savedDbImage = freshUser.profilePicture || freshUser.photoUrl || freshUser.avatar || "";
              setFormData({
                name: freshUser.name || "",
                photoUrl: savedDbImage.includes("ui-avatars.com") ? "" : savedDbImage,
              });
            }
          }
        } catch (err) {
          console.error("Failed to sync fresh user dataset:", err);
        }
      }
    };

    fetchFreshUserData();
  }, [isLoading, router, isOwner, params]);

  // Fetch public user details if viewing someone else's profile
  useEffect(() => {
    const fetchArtistInfoOnly = async () => {
      if (!profileArtistId || isOwner) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/user/${profileArtistId}`);
        if (res.ok) {
          const data = await res.json();
          setPublicArtistInfo(data.user || data);
        }
      } catch (e) {
        console.error("Could not fetch user info", e);
      }
    };

    fetchArtistInfoOnly();
  }, [profileArtistId, isOwner]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#D0E3EA]/30 flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-4xl"
        >
          ✨
        </motion.div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#5A7A88] animate-pulse">
          Loading Profile...
        </p>
      </div> overflow-hidden
    );
  }

  const displayProfileName = isOwner
    ? isEditing && formData.name.trim() !== ""
      ? formData.name
      : user?.name || "Your Studio"
    : publicArtistInfo?.name || "Verified Creator";

  const getAvatarUrl = () => {
    const isValidUrl = (url: any) => url && String(url).trim() !== "" && !String(url).includes("ui-avatars.com");

    if (isOwner) {
      if (formData.photoUrl && formData.photoUrl.trim() !== "") return formData.photoUrl.trim();
      if (isValidUrl(user?.profilePicture)) return user?.profilePicture;
      if (isValidUrl(user?.photoUrl)) return user?.photoUrl;
      if (isValidUrl(user?.avatar)) return user?.avatar;
      return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayProfileName)}`;
    } else {
      if (isValidUrl(publicArtistInfo?.profilePicture)) return publicArtistInfo?.profilePicture;
      if (isValidUrl(publicArtistInfo?.photoUrl)) return publicArtistInfo?.photoUrl;
      if (isValidUrl(publicArtistInfo?.avatar)) return publicArtistInfo?.avatar;
      return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(publicArtistInfo?.name || "Artist")}`;
    }
  };

  const displayProfilePicture = getAvatarUrl();
  const displayProfileRole = isOwner ? user?.role || "Baker" : publicArtistInfo?.role || "Baker";

  const currentInitialImage = user?.profilePicture || user?.photoUrl || user?.avatar || "";
  const cleanInitialImage = currentInitialImage.includes("ui-avatars.com") ? "" : currentInitialImage;

  const isFormChanged =
    formData.name.trim() !== (user?.name || "") ||
    formData.photoUrl.trim() !== cleanInitialImage ||
    password.trim() !== "";

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();

    if (updating || !isOwner || isGoogleAccount) return;

    if (password.trim() !== "") {
      if (password.length < 6) {
        triggerToast("Password must be at least 6 characters.", "error");
        return;
      }
      if (password !== confirmPassword) {
        triggerToast("Passwords do not match.", "error");
        return;
      }
    }

    setUpdating(true);
    triggerToast("Saving changes...", "loading");

    try {
      const payload = {
        userId: user._id || user.id,
        name: formData.name.trim(),
        photoUrl: formData.photoUrl.trim(),
        ...(password.trim() !== "" && { password: password.trim() }),
      };

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (res.ok && responseData?.success) {
        const updatedUser = responseData.user || {
          ...user,
          name: payload.name,
          photoUrl: payload.photoUrl,
          profilePicture: payload.photoUrl,
        };

        if (setUser) setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setPassword("");
        setConfirmPassword("");
        setIsEditing(false);
        triggerToast("Profile saved successfully!", "success");
      } else {
        triggerToast(responseData?.message || "Failed to save profile changes.", "error");
      }
    } catch (err) {
      console.error("Update error:", err);
      triggerToast("Failed to connect to server.", "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat text-[#3E3835] py-16 px-4 md:px-8 relative pt-65 overflow-x-hidden font-sans"
      style={{
        backgroundImage: `url('/images/bg.png')`,
        backgroundColor: "#D0E3EA",
      }}
    >
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[9999] bg-[#3E3835] text-[#FAF7F2] px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-bold tracking-wide flex items-center gap-2 animate-bounce">
          <span>{toastMessage.text}</span>
        </div>
      )}

      <div className="absolute inset-0 bg-[#D0E3EA]/40 backdrop-blur-[2px] pointer-events-none" />

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10 items-start">
        {/* LEFT CONTAINER (Live Preview Card) */}
        <motion.div
          variants={containerVariants as any}
          initial="hidden"
          animate="visible"
          className="md:col-span-5 space-y-6"
        >
          <motion.div variants={itemVariants as any} className="bg-[#FAF7F2]/90 backdrop-blur-md border border-[#E5E0D8] rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#FFFDF9] border border-[#E5E0D8] p-1 shadow-sm flex items-center justify-center">
                  <img
                    key={displayProfilePicture}
                    src={displayProfilePicture}
                    alt={displayProfileName}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      e.currentTarget.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayProfileName)}`;
                    }}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#D96B6B] text-white text-[9px] tracking-wider font-bold px-2 py-0.5 rounded-md shadow-sm uppercase">
                  {displayProfileRole}
                </div>
              </div>

              <div className="space-y-1 w-full">
                <h1 className="text-xl font-bold tracking-tight text-[#3E3835]">
                  {displayProfileName}
                </h1>
                {isOwner && user?.email && (
                  <p className="text-xs text-[#7A736E] break-all">
                    {user.email}
                  </p>
                )}
              </div>

              {isOwner && (
                <div className="pt-2 w-full flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full text-center px-4 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FFFDF9] hover:bg-white text-xs font-bold uppercase tracking-wider transition-all text-[#3E3835] cursor-pointer"
                  >
                    {isEditing ? "View Profile Summary" : "Edit Profile"}
                  </button>
                  {logout && (
                    <button
                      type="button"
                      onClick={logout}
                      className="w-full text-center px-4 py-2.5 rounded-xl bg-[#FDF0F0] text-[#D96B6B] hover:bg-[#FADADA] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT CONTAINER */}
        <div className="md:col-span-7 w-full">
          <AnimatePresence mode="wait">
            {isOwner && isEditing ? (
              <motion.div
                key="editing-pane"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#FAF7F2]/90 backdrop-blur-md border border-[#E5E0D8] rounded-3xl p-6 shadow-xl"
              >
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#7A736E] mb-4 flex items-center gap-2">
                  <SlidersHorizontal size={14} /> Account Parameters
                </h3>

                {isGoogleAccount ? (
                  <div className="bg-[#FFFDF9] border border-[#E5E0D8] rounded-2xl p-6 text-center space-y-3">
                    <div className="w-10 h-10 bg-[#FDF0F0] text-[#D96B6B] rounded-full flex items-center justify-center mx-auto">
                      <ShieldAlert size={20} />
                    </div>
                    <div className="inline-block bg-[#FDF0F0] text-[#D96B6B] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      Unable to edit (Google Account)
                    </div>
                    <p className="text-xs text-[#7A736E] leading-relaxed max-w-xs mx-auto">
                      Your avatar, display name, and security credentials are managed directly through Google.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-[#3E3835] mb-1">Email Address</label>
                      <input
                        type="text"
                        value={user?.email || ""}
                        disabled
                        className="w-full p-2.5 bg-[#FFFDF9]/60 rounded-xl border border-[#E5E0D8] text-xs font-medium text-[#7A736E] cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#3E3835] mb-1">Display Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Display Name"
                        className="w-full p-2.5 bg-[#FFFDF9] rounded-xl border border-[#E5E0D8] text-xs font-medium focus:outline-none focus:border-[#5A7A88]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#3E3835] mb-1">Avatar Image URL</label>
                      <input
                        type="url"
                        value={formData.photoUrl}
                        onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                        placeholder="https://example.com/avatar.jpg"
                        className="w-full p-2.5 bg-[#FFFDF9] rounded-xl border border-[#E5E0D8] text-xs font-medium focus:outline-none focus:border-[#5A7A88]"
                      />
                    </div>

                    {/* Password Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#E5E0D8]">
                      <div>
                        <label className="block text-xs font-bold text-[#3E3835] mb-1">New Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-9 pr-8 py-2.5 bg-[#FFFDF9] border border-[#E5E0D8] rounded-xl text-xs focus:outline-none focus:border-[#5A7A88]"
                          />
                          <Lock size={14} className="absolute left-3 top-3 text-[#A39E93]" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-3 text-[#A39E93] hover:text-[#3E3835]"
                          >
                            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#3E3835] mb-1">Confirm Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-9 pr-8 py-2.5 bg-[#FFFDF9] border border-[#E5E0D8] rounded-xl text-xs focus:outline-none focus:border-[#5A7A88]"
                          />
                          <Lock size={14} className="absolute left-3 top-3 text-[#A39E93]" />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2.5 top-3 text-[#A39E93] hover:text-[#3E3835]"
                          >
                            {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={updating || !isFormChanged}
                      className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm mt-4 transition-all ${
                        isFormChanged && !updating
                          ? "bg-[#D96B6B] text-white hover:bg-[#C25858] cursor-pointer"
                          : "bg-[#E5E0D8] text-[#A39E93] cursor-not-allowed"
                      }`}
                    >
                      <Paintbrush size={14} /> {updating ? "Saving..." : "Save Updates"}
                    </button>
                  </form>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="summary-pane"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#FAF7F2]/90 backdrop-blur-md border border-[#E5E0D8] rounded-3xl p-6 shadow-xl space-y-4"
              >
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#7A736E]">
                  Account Core Details
                </h3>
                <div className="bg-[#FFFDF9] rounded-2xl border border-[#E5E0D8] p-4 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#7A736E] uppercase block">Workspace Role</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D96B6B]">{displayProfileRole}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#7A736E] uppercase block">Registered Email</span>
                    <span className="text-xs font-semibold text-[#3E3835] select-all break-all">{user?.email || publicArtistInfo?.role || "Not Configured"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#7A736E] uppercase block">Account Identity ID</span>
                    <span className="text-[11px] font-mono text-[#7A736E] select-all">{profileArtistId}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}