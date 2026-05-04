"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell, HelpCircle, UserCircle, LayoutGrid,
  TrendingUp, Users, LogOut, ChevronDown, MoreVertical,
  Baby, User,
} from "lucide-react";
import dummyDataBayi from "@/lib/dummyDataBayi";
import dummyDataIbu from "@/lib/dummyDataIbu";

// ── Helpers ───────────────────────────────────────────────────────────────────

// ── Stacked Bar Chart ────────────────────────────────────────────────────────────

function TrendChart({ selectedBulan, activeTab }: { selectedBulan: number; activeTab: "bayi" | "ibu" }) {
  const w = 910;
  const h = 280;
  const padL = 40;
  const padR = 20;
  const padT = 20;
  const padB = 30;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;

  const displayData = activeTab === "bayi" 
    ? dummyDataBayi 
    : dummyDataIbu.filter((d) => d.bulanKe >= 6);

  const yLabels = [0, 30, 60, 90, 120, 150];
  const maxVal = 150;
  const scaleY = (val: number) => (val / maxVal) * chartH;
  
  const gap = chartW / displayData.length;
  const barWidth = Math.min(40, gap * 0.55);

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      {/* Y grid + labels */}
      {yLabels.map((val) => {
        const y = padT + chartH - scaleY(val);
        return (
          <g key={val}>
            <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="#E2E8F0" strokeWidth={1} strokeDasharray="4 4" />
            <text x={padL - 12} y={y + 4} fontSize={11} fill="#94A3B8" textAnchor="end">{val}</text>
          </g>
        );
      })}

      {/* X axis base line */}
      <line x1={padL} y1={padT + chartH} x2={w - padR} y2={padT + chartH} stroke="#CBD5E1" strokeWidth={2} />

      {displayData.map((d: any, idx) => {
        const cx = padL + gap * idx + gap / 2;
        const isSelected = d.bulanKe === selectedBulan;

        const isBayi = activeTab === "bayi";
        const nNorm = d.status_normal;
        const nInd  = isBayi ? (d.status_terindikasi ?? 0) : 0;
        const nStun = isBayi ? d.status_stunting : (d.status_malgizi ?? 0);

        const hNormRaw = scaleY(nNorm);
        const hIndRaw  = scaleY(nInd);
        const hStunRaw = scaleY(nStun);

        const yNormRaw = padT + chartH - hNormRaw;
        const yIndRaw  = yNormRaw - hIndRaw;
        const yStunRaw = yIndRaw - hStunRaw;

        const hasStun = hStunRaw > 0;
        const stunH = hStunRaw;
        const stunY = yStunRaw;

        const hasInd = hIndRaw > 0;
        const indH = Math.max(0, hIndRaw - (hasStun ? 2 : 0));
        const indY = yIndRaw + (hasStun ? 2 : 0);

        const hasAboveNorm = hasStun || hasInd;
        const normH = Math.max(0, hNormRaw - (hasAboveNorm ? 2 : 0));
        const normY = yNormRaw + (hasAboveNorm ? 2 : 0);

        return (
          <g key={d.bulanKe} className="transition-all duration-300">
            {/* Background Highlight Area */}
            {isSelected && (
              <rect x={cx - gap/2} y={padT} width={gap} height={chartH} fill="#F8FAFC" rx={6} />
            )}
            
            {/* Normal Bar (Bottom) */}
            {normH > 0 && (
              <g>
                <rect x={cx - barWidth/2} y={normY} width={barWidth} height={normH} fill="#27AE60" 
                  rx={3} opacity={isSelected ? 1 : 0.4}
                />
                <text 
                  x={normH > 12 ? cx : cx - barWidth/2 - 6} 
                  y={normY + normH / 2 + 3.5} 
                  fontSize={10} 
                  fill={normH > 12 ? "white" : "#27AE60"} 
                  fontWeight="700" 
                  textAnchor={normH > 12 ? "middle" : "end"} 
                  opacity={isSelected ? 1 : 0.8}
                >
                  {nNorm}
                </text>
              </g>
            )}
            {/* Terindikasi Bar (Middle) */}
            {indH > 0 && (
              <g>
                <rect x={cx - barWidth/2} y={indY} width={barWidth} height={indH} fill="#F39C12" 
                  rx={3} opacity={isSelected ? 1 : 0.7}
                />
                <text 
                  x={indH > 12 ? cx : cx + barWidth/2 + 6} 
                  y={indY + indH / 2 + 3.5} 
                  fontSize={10} 
                  fill={indH > 12 ? "white" : "#F39C12"} 
                  fontWeight="700" 
                  textAnchor={indH > 12 ? "middle" : "start"} 
                  opacity={isSelected ? 1 : 0.9}
                >
                  {nInd}
                </text>
              </g>
            )}
            {/* Stunting / Malgizi Bar (Top) */}
            {stunH > 0 && (
              <g>
                <rect x={cx - barWidth/2} y={stunY} width={barWidth} height={stunH} fill="#E74C3C" 
                  rx={3} opacity={isSelected ? 1 : 0.9}
                />
                <text 
                  x={cx} 
                  y={stunH > 12 ? stunY + stunH / 2 + 3.5 : stunY - 4} 
                  fontSize={10} 
                  fill={stunH > 12 ? "white" : "#E74C3C"} 
                  fontWeight="700" 
                  textAnchor="middle" 
                  opacity={isSelected ? 1 : 1}
                >
                  {nStun}
                </text>
              </g>
            )}

            {/* X label */}
            <text x={cx} y={h - 6} fontSize={12} fill={isSelected ? "#006C49" : "#94A3B8"} fontWeight={isSelected ? 700 : 500} textAnchor="middle">
              Bln {d.bulanKe === 0 ? 1 : d.bulanKe < 6 ? d.bulanKe + 1 : d.bulanKe}
            </text>

            {/* Total Value Annotation if selected */}
            {isSelected && (
              <text x={cx} y={stunY - (stunH <= 12 && stunH > 0 ? 18 : 10)} fontSize={13} fill="#0B1C30" fontWeight="bold" textAnchor="middle">
                {nNorm + nInd + nStun}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── Donut Chart ───────────────────────────────────────────────────────────────

type DonutSegment = { value: number; color: string; label: string };

function DonutChart({ segments, total }: { segments: DonutSegment[]; total: number }) {
  const r = 54;
  const cx = 72;
  const cy = 72;
  const circumference = 2 * Math.PI * r;
  const gap = 4;
  let cumulative = 0;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={144} height={144} viewBox="0 0 144 144">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F5F9" strokeWidth={16} />
        {segments.map((seg, i) => {
          if (seg.value === 0) return null;
          const arcLen = (seg.value / total) * circumference;
          // Apply gap only if it's not a full circle
          const isFullCircle = seg.value === total;
          const dashLen = isFullCircle ? circumference : Math.max(arcLen - gap, 0);
          const dashOffset = -cumulative;
          cumulative += arcLen;
          return (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={16}
              strokeDasharray={`${dashLen} ${circumference}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold text-[#0B1C30]">{total}</span>
        <span className="text-xs text-[#6C7A71] font-medium">Total</span>
      </div>
    </div>
  );
}

// ── Progress Ring ─────────────────────────────────────────────────────────────

function ProgressRing({ value, total }: { value: number; total: number }) {
  const r = 80;
  const cx = 96;
  const cy = 96;
  const circumference = 2 * Math.PI * r;
  const progress = (value / total) * circumference;
  return (
    <svg width={192} height={192} viewBox="0 0 192 192">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F5F9" strokeWidth={14} />
      <circle
        cx={cx} cy={cy} r={r}
        fill="none" stroke="#27AE60" strokeWidth={14}
        strokeDasharray={`${progress} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    </svg>
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

export default function DashboardDokter() {
  const [activeTab, setActiveTab] = useState<"bayi" | "ibu">("bayi");
  const [selectedBulan, setSelectedBulan] = useState(18); // default: Oktober 2024
  const [userRole, setUserRole] = useState("dokter");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) setUserRole(role);
  }, []);

  useEffect(() => {
    if (activeTab === "ibu" && selectedBulan < 6) {
      setSelectedBulan(6);
    }
  }, [activeTab, selectedBulan]);

  const snapBayi = dummyDataBayi.find((d) => d.bulanKe === selectedBulan)!;
  const snapIbu  = dummyDataIbu.find((d)  => d.bulanKe === selectedBulan)!;

  const bayiSegments: DonutSegment[] = [
    { value: snapBayi.status_normal,      color: "#27AE60", label: "Normal" },
    { value: snapBayi.status_terindikasi ?? 0, color: "#F39C12", label: "Terindikasi" },
    { value: snapBayi.status_stunting,    color: "#E74C3C", label: "Stunting" },
  ];
  const ibuSegments: DonutSegment[] = [
    { value: snapIbu.status_normal,  color: "#27AE60", label: "Normal" },
    { value: snapIbu.status_malgizi, color: "#F39C12", label: "Malnutrisi" },
  ];

  // KPI deltas vs previous period
  const prevBayi = dummyDataBayi.find((d) => d.bulanKe < selectedBulan && dummyDataBayi.indexOf(d) === dummyDataBayi.findIndex((x) => x.bulanKe < selectedBulan));
  const prevBayiSnap = dummyDataBayi.slice().reverse().find((d) => d.bulanKe < selectedBulan);
  const prevIbuSnap  = dummyDataIbu.slice().reverse().find((d)  => d.bulanKe < selectedBulan);

  const normalDeltaBayi   = prevBayiSnap ? snapBayi.status_normal    - prevBayiSnap.status_normal    : 0;
  const stuntingDeltaBayi = prevBayiSnap ? snapBayi.status_stunting   - prevBayiSnap.status_stunting  : 0;
  const terindikasiBayi   = snapBayi.status_terindikasi ?? 0;
  const prevTerindikasi   = prevBayiSnap?.status_terindikasi ?? 0;
  const terindikasiDeltaBayi = prevBayiSnap ? terindikasiBayi - prevTerindikasi : 0;
  const malgizDeltaIbu    = prevIbuSnap  ? snapIbu.status_malgizi     - prevIbuSnap.status_malgizi     : 0;

  const pctMalgizi = ((snapIbu.status_malgizi / snapIbu.total_subjek) * 100).toFixed(0);

  const selectedPeriode = dummyDataBayi.find((d) => d.bulanKe === selectedBulan)?.periode ?? "";

  return (
    <div className="flex h-screen bg-[#F4F7F6] font-sans antialiased overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-[#BBCABF]/60 shadow-sm flex flex-col py-8">
        <div className="px-8 mb-10">
          <h1 className="text-[#006C49] font-bold text-2xl tracking-widest leading-tight">POSYANDU<br />PINTAR</h1>
          <p className="text-[#6C7A71] text-xs font-medium tracking-wide mt-1">Clinical Data System</p>
        </div>
        <nav className="flex-1 px-4 flex flex-col gap-1">
          <NavItem icon={LayoutGrid}  label="Overview"         active href="/dashboard/dokter" />
          <NavItem icon={TrendingUp}  label="Tren & Semester" href="/dashboard/dokter/tren" />
          <NavItem icon={Users}       label="Database Pasien" href="/dashboard/dokter/database" />
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
            <h2 className="text-xl font-bold text-[#0B1C30] tracking-tight">Dashboard Overview</h2>

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
          <div className="max-w-[960px] mx-auto flex flex-col gap-8">

            {/* Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="bg-white border border-[#BBCABF]/60 rounded-xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] px-5 py-4 flex flex-col gap-3"
            >
              {/* Top row: label */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold tracking-[0.6px] uppercase text-[#6C7A71]">Periode Pemantauan</span>
                  <span className="text-[11px] font-medium text-[#BBCABF]">— 1000 HPK (36 Bulan)</span>
                </div>
                <span className="text-[10px] text-[#94A3B8] italic hidden sm:block animate-pulse">Geser untuk melihat bulan lainnya →</span>
              </div>

              {/* Period pills */}
              <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-2 -mx-2 px-2 snap-x scroll-smooth [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-[#F1F5F9] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#CBD5E1] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#94A3B8] transition-colors">
                {dummyDataBayi.filter(d => activeTab === "bayi" || d.bulanKe >= 6).map((d, idx, arr) => {
                  const isActive = d.bulanKe === selectedBulan;
                  const isLast = idx === arr.length - 1;
                  return (
                    <div key={d.bulanKe} className="flex items-center gap-3 flex-shrink-0 snap-start">
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setSelectedBulan(d.bulanKe)}
                        className={`relative w-[84px] flex flex-col items-center gap-1 px-1 py-2.5 rounded-xl border-2 transition-all ${
                          isActive
                            ? "bg-[#006C49] border-[#006C49] text-white shadow-[0_4px_10px_rgba(0,108,73,0.25)]"
                            : "bg-[#F8FAF9] border-transparent text-[#6C7A71] hover:border-[#BBCABF] hover:bg-white"
                        }`}
                      >
                        {/* Bulan badge */}
                        <span className={`text-[10px] font-bold tracking-wide whitespace-nowrap ${isActive ? "text-white/70" : "text-[#BBCABF]"}`}>
                          {`Bln ${d.bulanKe === 0 ? 1 : d.bulanKe < 6 ? d.bulanKe + 1 : d.bulanKe}`}
                        </span>
                        {/* Periode */}
                        <span className={`text-[11px] font-semibold leading-tight text-center whitespace-nowrap ${isActive ? "text-white" : "text-[#334155]"}`}>
                          {d.periode.split(" ")[0]}
                          <br />
                          {d.periode.split(" ")[1]}
                        </span>
                        {/* Capaian */}
                        <span className={`text-[10px] font-bold mt-0.5 whitespace-nowrap ${isActive ? "text-[#86efac]" : "text-[#27AE60]"}`}>
                          {d.capaian_persen}%
                        </span>
                        {/* Active indicator dot */}
                        {isActive && (
                          <motion.span
                            layoutId="activeDot"
                            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#006C49] border-2 border-white shadow-sm"
                          />
                        )}
                      </motion.button>
                      {/* Connector line */}
                      {!isLast && (
                        <div className="w-4 flex-shrink-0 flex flex-col items-center gap-0.5">
                          <div className="w-full h-px bg-[#E2E8F0]" />
                          <ChevronDown className="w-2.5 h-2.5 text-[#CBD5E1] -rotate-90 -mt-0.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Selected phase label */}
              <div className="flex items-center gap-2 pt-1 border-t border-[#F1F5F9]">
                <span className="w-2 h-2 rounded-full bg-[#006C49] flex-shrink-0" />
                <span className="text-xs text-[#334155] font-medium">
                  {snapBayi.label_fase}
                </span>
                <span className="text-xs text-[#BBCABF]">•</span>
                <span className="text-xs text-[#6C7A71]">
                  Capaian bayi normal: <strong className="text-[#006C49]">{snapBayi.capaian_persen}%</strong>
                </span>
                <span className="text-xs text-[#BBCABF]">•</span>
                <span className="text-xs text-[#6C7A71]">
                  Capaian ibu normal: <strong className="text-[#006C49]">{snapIbu.capaian_persen}%</strong>
                </span>
              </div>
            </motion.div>

            {/* KPI Row */}
            {activeTab === "bayi" ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
                className="grid grid-cols-4 gap-6"
              >
                {/* Total Pasangan (Ibu & Bayi) */}
                <div className="relative bg-white border border-[#BBCABF]/60 rounded-xl shadow-[0_12px_20px_-4px_rgba(0,0,0,0.06),0_4px_8px_-3px_rgba(0,0,0,0.04)] p-6 flex flex-col gap-3 overflow-hidden justify-between">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[1.1px] uppercase text-[#6C7A71] leading-tight">Total Pasangan (Ibu & Bayi)</p>
                    <span className="text-[40px] font-bold leading-none text-[#0B1C30] block mt-3">{Math.max(snapBayi.total_subjek, snapIbu.total_subjek)}</span>
                  </div>
                  <div className="border-t border-[#BBCABF]/30 pt-3 flex items-center justify-between text-sm text-[#3C4A42]">
                    <span>Bayi: {snapBayi.total_subjek}</span>
                    <span>Ibu: {snapIbu.total_subjek}</span>
                  </div>
                </div>

                {/* Bayi Normal */}
                <div className="relative bg-white border border-[#BBCABF]/60 rounded-xl shadow-[0_12px_20px_-4px_rgba(0,0,0,0.06),0_4px_8px_-3px_rgba(0,0,0,0.04)] p-6 flex flex-col gap-3 overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl bg-[#27AE60]" />
                  <p className="text-[11px] font-semibold tracking-[1.1px] uppercase text-[#6C7A71]">Bayi Normal</p>
                  <div className="flex items-end gap-3">
                    <span className="text-[40px] font-bold leading-none text-[#0B1C30]">{snapBayi.status_normal}</span>
                    {normalDeltaBayi !== 0 && (
                      <span className="mb-1 flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium" style={{ color: "#27AE60", backgroundColor: "rgba(39,174,96,0.10)" }}>
                        ↑ +{normalDeltaBayi}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#3C4A42] border-t border-[#BBCABF]/30 pt-3">
                    {snapBayi.capaian_persen}% Kondisi Ideal
                  </p>
                </div>

                {/* Bayi Terindikasi */}
                <div className="relative bg-white border border-[#BBCABF]/60 rounded-xl shadow-[0_12px_20px_-4px_rgba(0,0,0,0.06),0_4px_8px_-3px_rgba(0,0,0,0.04)] p-6 flex flex-col gap-3 overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl bg-[#F39C12]" />
                  <p className="text-[11px] font-semibold tracking-[1.1px] uppercase text-[#6C7A71]">Bayi Terindikasi</p>
                  <div className="flex items-end gap-3">
                    <span className="text-[40px] font-bold leading-none text-[#0B1C30]">{snapBayi.status_terindikasi ?? 0}</span>
                    {terindikasiDeltaBayi !== 0 && (
                      <span className="mb-1 flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium" style={{ color: "#F39C12", backgroundColor: "rgba(243,156,18,0.10)" }}>
                        {terindikasiDeltaBayi > 0 ? `↑ +${terindikasiDeltaBayi}` : `↓ ${terindikasiDeltaBayi}`}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#3C4A42] border-t border-[#BBCABF]/30 pt-3">Dalam Pantauan Khusus</p>
                </div>

                {/* Bayi Stunting */}
                <div className="relative bg-white border border-[#BBCABF]/60 rounded-xl shadow-[0_12px_20px_-4px_rgba(0,0,0,0.06),0_4px_8px_-3px_rgba(0,0,0,0.04)] p-6 flex flex-col gap-3 overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl bg-[#E74C3C]" />
                  <p className="text-[11px] font-semibold tracking-[1.1px] uppercase text-[#6C7A71]">Bayi Stunting</p>
                  <div className="flex items-end gap-3">
                    <span className="text-[40px] font-bold leading-none text-[#0B1C30]">{snapBayi.status_stunting}</span>
                    {stuntingDeltaBayi !== 0 && (
                      <span className="mb-1 flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium" style={{ color: "#E74C3C", backgroundColor: "rgba(231,76,60,0.10)" }}>
                        {stuntingDeltaBayi > 0 ? `↑ +${stuntingDeltaBayi}` : `↓ ${stuntingDeltaBayi}`}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#3C4A42] border-t border-[#BBCABF]/30 pt-3">Perlu Intervensi Segera</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
                className="grid grid-cols-3 gap-6"
              >
                {/* Total Pasangan (Ibu & Bayi) */}
                <div className="relative bg-white border border-[#BBCABF]/60 rounded-xl shadow-[0_12px_20px_-4px_rgba(0,0,0,0.06),0_4px_8px_-3px_rgba(0,0,0,0.04)] p-6 flex flex-col gap-3 overflow-hidden justify-between">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[1.1px] uppercase text-[#6C7A71] leading-tight">Total Pasangan (Ibu & Bayi)</p>
                    <span className="text-[40px] font-bold leading-none text-[#0B1C30] block mt-3">{Math.max(snapBayi.total_subjek, snapIbu.total_subjek)}</span>
                  </div>
                  <div className="border-t border-[#BBCABF]/30 pt-3 flex items-center justify-between text-sm text-[#3C4A42]">
                    <span>Bayi: {snapBayi.total_subjek}</span>
                    <span>Ibu: {snapIbu.total_subjek}</span>
                  </div>
                </div>

                {/* Ibu Normal */}
                <div className="relative bg-white border border-[#BBCABF]/60 rounded-xl shadow-[0_12px_20px_-4px_rgba(0,0,0,0.06),0_4px_8px_-3px_rgba(0,0,0,0.04)] p-6 flex flex-col gap-3 overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl bg-[#27AE60]" />
                  <p className="text-[11px] font-semibold tracking-[1.1px] uppercase text-[#6C7A71]">Ibu Normal</p>
                  <div className="flex items-end gap-3">
                    <span className="text-[40px] font-bold leading-none text-[#0B1C30]">{snapIbu.status_normal}</span>
                  </div>
                  <p className="text-sm text-[#3C4A42] border-t border-[#BBCABF]/30 pt-3">
                    {snapIbu.capaian_persen}% Kondisi Ideal
                  </p>
                </div>

                {/* Ibu Malnutrisi */}
                <div className="relative bg-white border border-[#BBCABF]/60 rounded-xl shadow-[0_12px_20px_-4px_rgba(0,0,0,0.06),0_4px_8px_-3px_rgba(0,0,0,0.04)] p-6 flex flex-col gap-3 overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl bg-[#F39C12]" />
                  <p className="text-[11px] font-semibold tracking-[1.1px] uppercase text-[#6C7A71]">Ibu Malnutrisi</p>
                  <div className="flex items-end gap-3">
                    <span className="text-[40px] font-bold leading-none text-[#0B1C30]">{snapIbu.status_malgizi}</span>
                    <span className="mb-1 flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium" style={{ color: "#F39C12", backgroundColor: "rgba(243,156,18,0.10)" }}>
                      {pctMalgizi}%
                    </span>
                  </div>
                  <p className="text-sm text-[#3C4A42] border-t border-[#BBCABF]/30 pt-3">Indikasi KEK / Anemia</p>
                </div>
              </motion.div>
            )}

            {/* Main Chart */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white border border-[#BBCABF]/60 rounded-xl shadow-[0_12px_20px_-4px_rgba(0,0,0,0.06),0_4px_8px_-3px_rgba(0,0,0,0.04)] p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#0B1C30]">Tren Pemulihan 1000 HPK (36 Bulan)</h3>
                  <p className="text-xs text-[#6C7A71] mt-0.5">{snapBayi.label_fase} — {selectedPeriode}</p>
                </div>
                {/* Legends */}
                <div className="flex items-center gap-4 border border-[#BBCABF]/40 bg-[#F8F9FF] px-3 py-1.5 rounded-full">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#27AE60]"></span>
                    <span className="text-[11px] font-semibold text-[#3C4A42]">Normal</span>
                  </div>
                  {activeTab === "bayi" && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#F39C12]"></span>
                      <span className="text-[11px] font-semibold text-[#3C4A42]">Terindikasi</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#E74C3C]"></span>
                    <span className="text-[11px] font-semibold text-[#3C4A42]">{activeTab === "bayi" ? "Stunting" : "Malgizi"}</span>
                  </div>
                </div>
              </div>
              <TrendChart selectedBulan={selectedBulan} activeTab={activeTab} />
            </motion.div>

            {/* Bottom Row */}
            {activeTab === "bayi" ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
                className="grid grid-cols-3 gap-6 pb-4"
              >
                {/* Progress Ring - Bayi */}
                <div className="bg-white border border-[#BBCABF]/60 rounded-xl shadow-[0_12px_20px_-4px_rgba(0,0,0,0.06),0_4px_8px_-3px_rgba(0,0,0,0.04)] p-6 flex flex-col items-center gap-4">
                  <div className="text-center">
                    <h4 className="text-base font-bold text-[#0B1C30]">Perjalanan Menuju Target Normal</h4>
                    <p className="text-xs text-[#6C7A71] font-medium mt-1">({snapBayi.total_subjek} Subjek Bayi)</p>
                  </div>
                  <div className="relative">
                    <ProgressRing value={snapBayi.status_normal} total={snapBayi.total_subjek} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-bold text-[#0B1C30] leading-none">{snapBayi.status_normal}</span>
                      <div className="border-t border-[#BBCABF]/30 mt-2 pt-1.5 px-4">
                        <span className="text-sm font-semibold text-[#6C7A71]">/ {snapBayi.total_subjek}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Donut Bayi */}
                <div className="bg-white border border-[#BBCABF]/60 rounded-xl shadow-[0_12px_20px_-4px_rgba(0,0,0,0.06),0_4px_8px_-3px_rgba(0,0,0,0.04)] p-6 flex flex-col gap-5">
                  <div className="border-b border-[#BBCABF]/30 pb-3">
                    <h4 className="text-base font-bold text-[#0B1C30]">Status Gizi Bayi (Z-Score)</h4>
                  </div>
                  <div className="flex flex-col items-center gap-5">
                    <DonutChart segments={bayiSegments} total={snapBayi.total_subjek} />
                    <div className="flex flex-col gap-2.5 w-full px-2">
                      {[
                        { label: "Normal",      value: snapBayi.status_normal,      pct: ((snapBayi.status_normal      / snapBayi.total_subjek) * 100).toFixed(1), color: "#27AE60" },
                        { label: "Terindikasi", value: snapBayi.status_terindikasi ?? 0, pct: (((snapBayi.status_terindikasi ?? 0) / snapBayi.total_subjek) * 100).toFixed(1), color: "#F39C12" },
                        { label: "Stunting",    value: snapBayi.status_stunting,    pct: ((snapBayi.status_stunting    / snapBayi.total_subjek) * 100).toFixed(1), color: "#E74C3C" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="text-sm text-[#3C4A42]">{item.label}</span>
                          </div>
                          <span className="text-sm font-bold text-[#0B1C30]">{item.value} ({item.pct}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Capaian Bayi Summary */}
                <div className="bg-white border border-[#BBCABF]/60 rounded-xl shadow-[0_12px_20px_-4px_rgba(0,0,0,0.06),0_4px_8px_-3px_rgba(0,0,0,0.04)] p-6 flex flex-col gap-5">
                  <div className="border-b border-[#BBCABF]/30 pb-3">
                    <h4 className="text-base font-bold text-[#0B1C30]">Target Capaian</h4>
                  </div>
                  <div className="flex flex-col gap-5">
                    <div className="text-center">
                      <p className="text-xs text-[#6C7A71] font-medium">Progress Menuju Target</p>
                      <span className="text-5xl font-bold text-[#27AE60] block mt-2">{snapBayi.capaian_persen}%</span>
                    </div>
                    <div className="border-t border-[#BBCABF]/30 pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#3C4A42]">Fase:</span>
                        <span className="text-sm font-semibold text-[#0B1C30]">{snapBayi.label_fase}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#3C4A42]">Target:</span>
                        <span className="text-sm font-semibold text-[#0B1C30]">1000 HPK</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
                className="grid grid-cols-3 gap-6 pb-4"
              >
                {/* Progress Ring - Ibu */}
                <div className="bg-white border border-[#BBCABF]/60 rounded-xl shadow-[0_12px_20px_-4px_rgba(0,0,0,0.06),0_4px_8px_-3px_rgba(0,0,0,0.04)] p-6 flex flex-col items-center gap-4">
                  <div className="text-center">
                    <h4 className="text-base font-bold text-[#0B1C30]">Perjalanan Menuju Target Normal</h4>
                    <p className="text-xs text-[#6C7A71] font-medium mt-1">({snapIbu.total_subjek} Subjek Ibu)</p>
                  </div>
                  <div className="relative">
                    <ProgressRing value={snapIbu.status_normal} total={snapIbu.total_subjek} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-bold text-[#0B1C30] leading-none">{snapIbu.status_normal}</span>
                      <div className="border-t border-[#BBCABF]/30 mt-2 pt-1.5 px-4">
                        <span className="text-sm font-semibold text-[#6C7A71]">/ {snapIbu.total_subjek}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Donut Ibu */}
                <div className="bg-white border border-[#BBCABF]/60 rounded-xl shadow-[0_12px_20px_-4px_rgba(0,0,0,0.06),0_4px_8px_-3px_rgba(0,0,0,0.04)] p-6 flex flex-col gap-5">
                  <div className="border-b border-[#BBCABF]/30 pb-3">
                    <h4 className="text-base font-bold text-[#0B1C30]">Status Gizi Ibu (KEK/Anemia)</h4>
                  </div>
                  <div className="flex flex-col items-center gap-5">
                    <DonutChart segments={ibuSegments} total={snapIbu.total_subjek} />
                    <div className="flex flex-col gap-2.5 w-full px-2">
                      {[
                        { label: "Normal",     value: snapIbu.status_normal,  pct: ((snapIbu.status_normal  / snapIbu.total_subjek) * 100).toFixed(0), color: "#27AE60" },
                        { label: "Malnutrisi", value: snapIbu.status_malgizi, pct: ((snapIbu.status_malgizi / snapIbu.total_subjek) * 100).toFixed(0), color: "#F39C12" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="text-sm text-[#3C4A42]">{item.label}</span>
                          </div>
                          <span className="text-sm font-bold text-[#0B1C30]">{item.value} ({item.pct}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Capaian Ibu Summary */}
                <div className="bg-white border border-[#BBCABF]/60 rounded-xl shadow-[0_12px_20px_-4px_rgba(0,0,0,0.06),0_4px_8px_-3px_rgba(0,0,0,0.04)] p-6 flex flex-col gap-5">
                  <div className="border-b border-[#BBCABF]/30 pb-3">
                    <h4 className="text-base font-bold text-[#0B1C30]">Target Capaian</h4>
                  </div>
                  <div className="flex flex-col gap-5">
                    <div className="text-center">
                      <p className="text-xs text-[#6C7A71] font-medium">Progress Menuju Target</p>
                      <span className="text-5xl font-bold text-[#27AE60] block mt-2">{snapIbu.capaian_persen}%</span>
                    </div>
                    <div className="border-t border-[#BBCABF]/30 pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#3C4A42]">Fase:</span>
                        <span className="text-sm font-semibold text-[#0B1C30]">{snapIbu.label_fase}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#3C4A42]">Target:</span>
                        <span className="text-sm font-semibold text-[#0B1C30]">1000 HPK</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

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
