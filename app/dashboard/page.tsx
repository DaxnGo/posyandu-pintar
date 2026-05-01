"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  HelpCircle,
  UserCircle,
  LayoutGrid,
  LogOut,
  Baby,
  User,
  CheckCircle2,
  Info,
  Save,
} from "lucide-react";

// ── Toggle Switch ────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? "bg-[#059669]" : "bg-slate-200"
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${
          checked ? "left-[22px] border border-white" : "left-0.5 border border-slate-200"
        }`}
      />
    </button>
  );
}

// ── Input Field ──────────────────────────────────────────────────────────────

function Field({
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#334155]">{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full px-3 py-2.5 rounded-lg border text-sm shadow-sm outline-none transition-all ${
          disabled
            ? "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] cursor-not-allowed shadow-inner"
            : "bg-white border-[#CBD5E1] text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#006C49] focus:ring-1 focus:ring-[#006C49]"
        }`}
      />
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardKader() {
  // Bayi fields
  const [bbBayi, setBbBayi] = useState("");
  const [tbBayi, setTbBayi] = useState("");
  const [lingkarLengan, setLingkarLengan] = useState("");
  const [lingkarKepala, setLingkarKepala] = useState("");
  const [tekananBayi, setTekananBayi] = useState("");
  const [asi, setAsi] = useState(false);
  const [imunisasi, setImunisasi] = useState(true);

  // Ibu fields
  const [bbIbu, setBbIbu] = useState("");
  const [tekananIbu, setTekananIbu] = useState("");
  const [statusGizi, setStatusGizi] = useState("Normal");

  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div
      className="flex h-screen bg-[#F4F7F6] font-sans antialiased overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-[#BBCABF]/60 shadow-sm flex flex-col py-8">
        {/* Logo */}
        <div className="px-8 mb-10">
          <h1 className="text-[#006C49] font-bold text-2xl tracking-widest leading-tight">
            POSYANDU<br />PINTAR
          </h1>
          <p className="text-[#6C7A71] text-xs font-medium tracking-wide mt-1">
            Clinical Data System
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4">
          <motion.div
            whileHover={{ x: 2 }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#006C49]/10 cursor-pointer"
          >
            <LayoutGrid className="w-4.5 h-4 text-[#006C49]" />
            <span className="text-sm font-semibold text-[#006C49] tracking-tight">
              Data Entry
            </span>
          </motion.div>
        </nav>

        {/* User card */}
        <div className="px-6 mt-4">
          <div className="bg-[#F8F9FF] border border-[#BBCABF]/40 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#6292FD]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[#6292FD] font-bold text-base">A</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0B1C30] truncate">Admin Utama</p>
              <p className="text-xs text-[#6C7A71] font-medium tracking-wide truncate">
                Kader Posyandu
              </p>
            </div>
          </div>
        </div>

        {/* Keluar */}
        <div className="px-4 mt-4 border-t border-[#BBCABF]/30 pt-4">
          <motion.a
            href="/login"
            whileHover={{ x: 2 }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer group"
          >
            <LogOut className="w-4 h-4 text-[#EF4444]" />
            <span className="text-sm font-semibold text-[#DC2626]">Keluar</span>
          </motion.a>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="h-20 bg-white/95 backdrop-blur-sm border-b border-[#BBCABF]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex items-center justify-between px-8 flex-shrink-0">
          <h2 className="text-xl font-bold text-[#0B1C30] tracking-tight">
            Data Entry
          </h2>
          <div className="flex items-center gap-4 text-slate-500">
            <button className="hover:text-[#006C49] transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="hover:text-[#006C49] transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
            <button className="hover:text-[#006C49] transition-colors">
              <UserCircle className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto flex flex-col gap-6">

            {/* Patient Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm px-6 py-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D1FAE5] flex items-center justify-center">
                  <Baby className="w-5 h-5 text-[#059669]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1E293B]">Anak: Budi</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm text-[#64748B]">Ibu: Siti Aminah</span>
                    <span className="text-[#CBD5E1]">|</span>
                    <span className="text-sm text-[#64748B]">ID: #042</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[#ECFDF5] border border-[#A7F3D0] px-4 py-2 rounded-full shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                <span className="text-sm font-semibold text-[#047857]">Status Gizi: Normal</span>
              </div>
            </motion.div>

            {/* Two-column cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="grid grid-cols-2 gap-6"
            >
              {/* Left — Pemantauan Bayi */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-8 flex flex-col gap-6">
                <div className="pb-4 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-2">
                    <Baby className="w-4 h-4 text-[#059669]" />
                    <h4 className="text-lg font-semibold text-[#1E293B]">Pemantauan Bayi</h4>
                  </div>
                  <p className="text-sm text-[#64748B] mt-1 ml-6">Pengecekan 3x Seminggu</p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Berat Badan (kg)" placeholder="0.0" value={bbBayi} onChange={setBbBayi} />
                    <Field label="Tinggi Badan (cm)" placeholder="0.0" value={tbBayi} onChange={setTbBayi} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Lingkar Lengan (cm)" placeholder="0.0" value={lingkarLengan} onChange={setLingkarLengan} />
                    <Field label="Lingkar Kepala (cm)" placeholder="0.0" value={lingkarKepala} onChange={setLingkarKepala} />
                  </div>
                  <Field label="Tekanan Darah (mmHg)" placeholder="120/80" value={tekananBayi} onChange={setTekananBayi} />
                </div>

                <div className="flex flex-col gap-4 pt-2 border-t border-[#F1F5F9]">
                  <div className="flex items-center gap-3">
                    <Toggle checked={asi} onChange={setAsi} />
                    <span className="text-sm font-medium text-[#334155]">ASI Eksklusif</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Toggle checked={imunisasi} onChange={setImunisasi} />
                    <span className="text-sm font-medium text-[#334155]">
                      Status Imunisasi Lengkap (Sesuai Umur)
                    </span>
                  </div>
                </div>
              </div>

              {/* Right — Pemantauan Ibu */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-8 flex flex-col gap-6">
                <div className="pb-4 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#2563EB]" />
                    <h4 className="text-lg font-semibold text-[#1E293B]">Pemantauan Ibu</h4>
                  </div>
                  <p className="text-sm text-[#64748B] mt-1 ml-6">Pengecekan 1x Sebulan</p>
                </div>

                <div className="flex flex-col gap-4">
                  <Field label="Berat Badan (kg)" placeholder="0.0" value={bbIbu} onChange={setBbIbu} />
                  <Field label="Tinggi Badan (cm) - Tetap" placeholder="162" value="162" disabled />
                  <Field label="Tekanan Darah (mmHg)" placeholder="120/80" value={tekananIbu} onChange={setTekananIbu} />

                  {/* Status Gizi dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#334155]">Status Gizi Ibu</label>
                    <div className="relative">
                      <select
                        value={statusGizi}
                        onChange={(e) => setStatusGizi(e.target.value)}
                        className="w-full appearance-none px-3 py-2.5 pr-10 rounded-lg border border-[#CBD5E1] bg-white text-sm text-[#0F172A] shadow-sm outline-none focus:border-[#006C49] focus:ring-1 focus:ring-[#006C49] transition-all cursor-pointer"
                      >
                        {["Normal", "Kurang Energi Kronis", "Obesitas", "Anemia"].map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                        <svg className="w-4 h-4 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Area */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col items-center gap-4 pt-2"
            >
              <div className="flex items-center gap-4">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-2.5 rounded-lg border border-[#E0E7FF] bg-[#EEF2FF] text-[#4338CA] font-medium text-sm hover:bg-[#E0E7FF] transition-colors"
                >
                  Batal
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSave}
                  className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white font-medium text-sm shadow-[0_4px_6px_-1px_rgba(5,150,105,0.2),0_2px_4px_-2px_rgba(5,150,105,0.2)] transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {saved ? "Tersimpan!" : "Simpan & Update Status"}
                </motion.button>
              </div>

              <div className="flex items-center gap-2 bg-[#F1F5F9]/80 border border-[#E2E8F0] rounded-full px-5 py-2.5">
                <Info className="w-3.5 h-3.5 text-[#64748B] flex-shrink-0" />
                <span className="text-xs text-[#64748B]">
                  Data yang disimpan akan otomatis memperbarui grafik Z-Score Dokter.
                </span>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-[#E2E8F0] px-8 py-4 flex items-center justify-between flex-shrink-0">
          <span className="text-xs font-bold text-[#1E293B] tracking-widest uppercase">
            © 2026 POSYANDU PINTAR • SECURE CLINICAL ENVIRONMENT
          </span>
          <div className="flex items-center gap-6">
            {["Data Privacy", "Protocol Manual", "System Status"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest hover:text-[#006C49] transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
