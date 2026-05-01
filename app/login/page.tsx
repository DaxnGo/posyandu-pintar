"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  User,
  Lock,
  Eye,
  EyeOff,
  Info,
  Stethoscope,
  Users,
  BarChart2,
  Settings,
} from "lucide-react";

const roles = [
  { id: "kader", label: "Kader Posyandu", icon: Users },
  { id: "dokter", label: "Dokter Puskesmas", icon: Stethoscope },
  { id: "dinas", label: "Dinas Kesehatan", icon: BarChart2 },
  { id: "admin", label: "Admin Sistem", icon: Settings },
];

export default function LoginPage() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState("kader");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleLogin() {
    localStorage.setItem("userRole", activeRole);
    if (activeRole === "dokter" || activeRole === "dinas") {
      router.push("/dashboard/dokter");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen font-sans antialiased overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Left Panel ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="hidden md:flex md:w-1/2 bg-[#EFF4FF] relative items-center justify-center overflow-hidden"
      >
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#006C49]/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full bg-[#006C49]/8 blur-3xl" />
        <div className="absolute top-1/3 right-0 w-48 h-48 rounded-full bg-white/40 blur-2xl" />

        <div className="relative flex flex-col items-center gap-0 px-12">
          {/* Circular image container */}
          <div className="w-[340px] h-[340px] xl:w-[400px] xl:h-[400px] rounded-full border-8 border-white shadow-[0_20px_60px_rgba(0,108,73,0.20)] overflow-hidden">
            <img
              src="/PetugasKesehatan.jpeg"
              alt="Petugas Kesehatan Posyandu"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Glassmorphism overlay card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            className="relative -mt-10 mx-6 bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl shadow-xl px-8 py-6 max-w-sm"
          >
            <h2 className="text-2xl font-bold text-[#006C49] mb-2">
              Merawat Masa Depan
            </h2>
            <p className="text-[#3C4A42] text-sm leading-relaxed">
              Dedikasi untuk kesehatan ibu dan anak melalui pemantauan 1000 Hari
              Pertama Kehidupan yang akurat dan terpercaya.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex gap-8 mt-8"
          >
            {[
              { value: "150", label: "Subjek Aktif" },
              { value: "36", label: "Bulan Program" },
              { value: "100%", label: "Target HPK" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <span className="text-xl font-black text-[#006C49]">{s.value}</span>
                <span className="text-xs text-[#6C7A71] font-medium">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Right Panel ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        className="w-full md:w-1/2 bg-white flex flex-col items-center justify-center px-6 sm:px-10 lg:px-14 py-6 overflow-hidden"
      >
        <div className="w-full max-w-md flex flex-col gap-4">

          {/* Brand */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#006C49] flex items-center justify-center shadow-md">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <span className="text-[#006C49] font-bold text-base tracking-tight">
                POSYANDU <span className="text-[#0B1C30]">PINTAR</span>
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#0B1C30]">Selamat Datang</h1>
            <p className="text-[#3C4A42] text-xs leading-snug">
              Monitoring Siklus 1000 Hari Pertama Kehidupan (HPK)
            </p>
          </div>

          {/* Role Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#0B1C30]">
              Pilih Peran Anda
            </label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map(({ id, label, icon: Icon }) => {
                const isActive = activeRole === id;
                return (
                  <motion.button
                    key={id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveRole(id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-xs font-medium transition-all ${
                      isActive
                        ? "bg-[#E5EEFF] border-[#006C49] text-[#0B1C30]"
                        : "bg-transparent border-[#BBCABF] text-[#0B1C30] hover:border-[#006C49]/50 hover:bg-[#EFF4FF]/50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#006C49]" : "text-[#6C7A71]"}`} />
                    <span className="leading-tight">{label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-3">
            {/* Username */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#0B1C30]">
                Username atau Email
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6C7A71]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan ID petugas Anda"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#BBCABF] text-sm text-[#0B1C30] placeholder:text-[#BBCABF] outline-none focus:border-[#006C49] focus:ring-1 focus:ring-[#006C49] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-[#0B1C30]">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-medium text-[#006C49] hover:underline"
                >
                  Lupa Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6C7A71]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  className="w-full pl-10 pr-11 py-2.5 rounded-lg border border-[#BBCABF] text-sm text-[#0B1C30] placeholder:text-[#BBCABF] outline-none focus:border-[#006C49] focus:ring-1 focus:ring-[#006C49] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6C7A71] hover:text-[#006C49] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ brightness: 1.05 }}
            onClick={handleLogin}
          className="w-full bg-[#006C49] hover:bg-[#005a3c] text-white font-semibold py-3 rounded-lg shadow-md transition-colors text-sm"
          >
            Login
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-100" />
            <a
              href="/"
              className="text-xs text-[#006C49] font-medium hover:underline whitespace-nowrap"
            >
              ← Kembali ke Halaman Utama
            </a>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* System notice badge */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 bg-[#EFF4FF] text-[#6C7A71] text-xs font-medium px-4 py-2 rounded-full">
              <Info className="w-3.5 h-3.5 flex-shrink-0" />
              Sistem Tertutup: Hanya untuk Petugas Terdaftar
            </span>
          </div>

          {/* Copyright */}
          <p className="text-center text-xs text-[#6C7A71]">
            © 2026 POSYANDU PINTAR — Sistem Tertutup
          </p>
        </div>
      </motion.div>
    </div>
  );
}
