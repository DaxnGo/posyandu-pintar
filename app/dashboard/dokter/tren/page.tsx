"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell, HelpCircle, UserCircle, LayoutGrid,
  TrendingUp, Users, LogOut, ChevronDown,
  Database, CheckCircle2, AlertTriangle, Baby, User,
} from "lucide-react";
import dummyDataBayi from "@/lib/dummyDataBayi";
import dummyDataIbu from "@/lib/dummyDataIbu";

// ── Bar Chart ─────────────────────────────────────────────────────────────────

type BarItem = { label: string; value: number; color: string };

function BarChart({ bars, title, subtitle }: { bars: BarItem[]; title: string; subtitle: string }) {
  const maxVal = Math.max(...bars.map((b) => b.value), 1);
  const chartH = 220;
  const yLabels = [0, 50, 100, 150];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#0B1C30]">{title}</h3>
          <p className="text-sm text-[#3C4A42] mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-5">
          {bars.map((b) => (
            <div key={b.label} className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: b.color }} />
              <span className="text-base text-[#3C4A42]">{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative" style={{ height: chartH + 52 }}>
        {/* Y-axis labels + grid */}
        <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between items-end pr-3">
          {[...yLabels].reverse().map((v) => (
            <span key={v} className="text-base text-[#3C4A42]">{v}</span>
          ))}
        </div>

        {/* Grid lines */}
        <div className="absolute left-12 right-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
          {yLabels.map((v, i) => (
            <div
              key={v}
              className={`w-full border-t ${i === 0 ? "border-[#BBCABF]/60" : "border-[#BBCABF]/20"}`}
            />
          ))}
        </div>

        {/* Bars */}
        <div className="absolute left-12 right-0 top-3 bottom-8 flex items-end justify-around px-20">
          {bars.map((b) => {
            const barH = (b.value / 150) * (chartH - 12);
            return (
              <div key={b.label} className="flex flex-col items-center gap-2" style={{ width: 64 }}>
                <span className="text-base text-[#0B1C30]">{b.value}</span>
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{
                    height: barH,
                    backgroundColor: b.color,
                    originY: 1,
                    width: "100%",
                    borderRadius: "2px 2px 0 0",
                    boxShadow: "0px 1px 2px rgba(0,0,0,0.05)",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="absolute left-12 right-0 bottom-0 flex items-center justify-around px-20">
          {bars.map((b) => (
            <span key={b.label} className="text-base text-[#0B1C30] text-center" style={{ width: 64 }}>
              {b.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Nav Item ──────────────────────────────────────────────────────────────────

function NavItem({ icon: Icon, label, active = false, href = "#" }: {
  icon: React.ElementType; label: string; active?: boolean; href?: string;
}) {
  return (
    <motion.a href={href} whileHover={{ x: 2 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
        active ? "bg-[#006C49]/10 text-[#006C49]" : "text-[#64748B] hover:bg-slate-50 hover:text-[#334155]"
      }`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className={`text-sm tracking-tight ${active ? "font-semibold" : "font-medium"}`}>{label}</span>
    </motion.a>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardTren() {
  const [activeTab, setActiveTab] = useState<"bayi" | "ibu">("bayi");
  const [selectedBulan, setSelectedBulan] = useState(6);
  const [userRole, setUserRole] = useState("dokter");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) setUserRole(role);
  }, []);

  const snapBayi = dummyDataBayi.find((d) => d.bulanKe === selectedBulan)!;
  const snapIbu  = dummyDataIbu.find((d)  => d.bulanKe === selectedBulan)!;

  const bayiBars: BarItem[] = [
    { label: "Normal",      value: snapBayi.status_normal,      color: "#27AE60" },
    ...(snapBayi.status_terindikasi !== null ? [{ label: "Terindikasi", value: snapBayi.status_terindikasi, color: "#F39C12" }] : []),
    { label: "Stunting",    value: snapBayi.status_stunting,    color: "#E74C3C" },
  ];

  const ibuBars: BarItem[] = [
    { label: "Normal",     value: snapIbu.status_normal,  color: "#27AE60" },
    { label: "Malnutrisi", value: snapIbu.status_malgizi, color: "#F39C12" },
  ];

  const snap   = activeTab === "bayi" ? snapBayi : snapIbu;
  const bars   = activeTab === "bayi" ? bayiBars  : ibuBars;
  const riskCount = activeTab === "bayi"
    ? (snapBayi.status_terindikasi ?? 0) + snapBayi.status_stunting
    : snapIbu.status_malgizi;

  const selectedPeriode = dummyDataBayi.find((d) => d.bulanKe === selectedBulan)?.periode ?? "";

  return (
    <div className="flex h-screen bg-[#F4F7F6] font-sans antialiased overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-[#BBCABF]/60 shadow-sm flex flex-col py-8">
        <div className="px-8 mb-10">
          <h1 className="text-[#006C49] font-bold text-2xl tracking-widest leading-tight">POSYANDU<br />PINTAR</h1>
          <p className="text-[#6C7A71] text-xs font-medium tracking-wide mt-1">Clinical Data System</p>
        </div>
        <nav className="flex-1 px-4 flex flex-col gap-1">
          <NavItem icon={LayoutGrid} label="Overview"        href="/dashboard/dokter" />
          <NavItem icon={TrendingUp} label="Tren & Semester" active href="/dashboard/dokter/tren" />
          <NavItem icon={Users}      label="Database Pasien" href="/dashboard/dokter/database" />
        </nav>
        <div className="px-6 mt-4">
          <div className="bg-[#F8F9FF] border border-[#BBCABF]/40 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#6292FD]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[#6292FD] font-bold text-base">{userRole === "dinas" ? "D" : "A"}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0B1C30] truncate">{userRole === "dinas" ? "Admin Dinas" : "Admin Utama"}</p>
              <p className="text-xs text-[#6C7A71] font-medium tracking-wide truncate">{userRole === "dinas" ? "Dinas Kesehatan" : "Dokter Puskesmas"}</p>
            </div>
          </div>
        </div>
        <div className="px-4 mt-4 border-t border-[#BBCABF]/30 pt-4">
          <motion.a href="/login" whileHover={{ x: 2 }} className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer">
            <LogOut className="w-4 h-4 text-[#EF4444]" />
            <span className="text-sm font-semibold text-[#DC2626]">Keluar</span>
          </motion.a>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="h-20 bg-white/95 backdrop-blur-sm border-b border-[#BBCABF]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-[#0B1C30] tracking-tight">Dashboard Trend &amp; Semester</h2>

            {/* Data Bayi / Data Ibu tabs */}
            <div className="flex items-center bg-[#F1F5F9] rounded-xl p-1.5 gap-1">
              {(["bayi", "ibu"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-white text-[#059669] font-semibold shadow-sm"
                      : "text-[#64748B] hover:text-[#334155]"
                  }`}
                >
                  {tab === "bayi"
                    ? <><Baby className="w-3.5 h-3.5" /><span>Data Bayi</span></>
                    : <><User className="w-3.5 h-3.5" /><span>Data Ibu</span></>
                  }
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <button className="hover:text-[#006C49] transition-colors"><Bell className="w-5 h-5" /></button>
            <button className="hover:text-[#006C49] transition-colors"><HelpCircle className="w-5 h-5" /></button>
            <button className="hover:text-[#006C49] transition-colors"><UserCircle className="w-5 h-5" /></button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[960px] mx-auto flex flex-col gap-6">

            {/* Period Filter Card */}
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="bg-white border border-[#BBCABF]/30 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] px-6 py-6 flex items-center justify-between"
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold text-[#0B1C30]">Overview {selectedPeriode}</h3>
                <p className="text-sm text-[#3C4A42]">
                  Monitoring data {activeTab === "bayi" ? "balita" : "ibu"} per {selectedPeriode}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-[#3C4A42] tracking-wide">Periode Monitoring:</span>
                <div className="relative">
                  <select
                    value={selectedBulan}
                    onChange={(e) => setSelectedBulan(Number(e.target.value))}
                    className="appearance-none pl-3 pr-9 py-2 bg-[#F8F9FF] border border-[#BBCABF] rounded-md text-sm text-[#0B1C30] outline-none focus:border-[#006C49] focus:ring-1 focus:ring-[#006C49] cursor-pointer"
                  >
                    {dummyDataBayi.filter(d => d.bulanKe >= 6).map((d) => (
                      <option key={d.bulanKe} value={d.bulanKe}>
                        {d.periode} (Bulan ke-{d.bulanKe === 0 ? 1 : d.bulanKe < 6 ? d.bulanKe + 1 : d.bulanKe})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                </div>
              </div>
            </motion.div>

            {/* KPI Cards Row */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
              className="grid grid-cols-3 gap-6"
            >
              {/* Total Database */}
              <div className="bg-white border border-[#BBCABF]/30 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#3C4A42] tracking-wide">Total Database</p>
                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="text-5xl font-bold text-[#0B1C30] tracking-tight leading-none">{snap.total_subjek}</span>
                      <span className="text-base text-[#3C4A42]">Pairs</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#E5EEFF] flex items-center justify-center flex-shrink-0">
                    <Database className="w-4.5 h-4.5 text-[#006C49]" />
                  </div>
                </div>
                <div className="border-t border-[#BBCABF]/20 pt-4 mt-4">
                  <p className="text-sm text-[#3C4A42]">Monitored infant-parent datasets</p>
                </div>
              </div>

              {/* Status Normal */}
              <div className="bg-white border border-[#BBCABF]/30 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#3C4A42] tracking-wide">Status Normal</p>
                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="text-5xl font-bold text-[#006C49] tracking-tight leading-none">{snap.status_normal}</span>
                      <span className="text-base text-[#3C4A42]">/ {snap.total_subjek}</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#10b98133] flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-[#006C49]" />
                  </div>
                </div>
                <div className="border-t border-[#BBCABF]/20 pt-4 mt-4 flex items-center gap-2">
                  <p className="text-sm text-[#3C4A42]">Progress against baseline</p>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#10b98133] text-[#006C49] whitespace-nowrap">
                    {snap.capaian_persen}% Target
                  </span>
                </div>
              </div>

              {/* Zona Risiko */}
              <div className="bg-white border border-[#BBCABF]/30 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#3C4A42] tracking-wide">Zona Risiko</p>
                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="text-5xl font-bold text-[#BA1A1A] tracking-tight leading-none">{riskCount}</span>
                      <span className="text-base text-[#3C4A42]">{activeTab === "bayi" ? "Bayi" : "Ibu"}</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#ffdad633] flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-[#BA1A1A]" />
                  </div>
                </div>
                <div className="border-t border-[#BBCABF]/20 pt-4 mt-4 flex items-center gap-3">
                  {activeTab === "bayi" ? (
                    <>
                      {snapBayi.status_terindikasi !== null && (
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                          <span className="text-xs font-medium text-[#3C4A42]">{snapBayi.status_terindikasi} Indikasi</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#BA1A1A]" />
                        <span className="text-xs font-medium text-[#3C4A42]">{snapBayi.status_stunting} Stunting</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                      <span className="text-xs font-medium text-[#3C4A42]">{snapIbu.status_malgizi} Malnutrisi</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white border border-[#BBCABF]/30 rounded-xl shadow-[0_4px_24px_rgba(0,25,69,0.04)] p-8"
            >
              <BarChart
                bars={bars}
                title={`Distribusi Status Gizi ${activeTab === "bayi" ? "Awal" : "Ibu"}`}
                subtitle={selectedPeriode}
              />
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
              <a key={l} href="#" className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest hover:text-[#006C49] transition-colors">{l}</a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
