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

// ── SVG Line Chart ────────────────────────────────────────────────────────────

function LineChart({ selectedBulan }: { selectedBulan: number }) {
  const w = 910;
  const h = 280;
  const padL = 52;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;

  const yLabels = ["0%", "20%", "40%", "60%", "80%", "100%"];

  const toX = (bulanKe: number) => padL + (bulanKe / 36) * chartW;
  const toY = (pct: number) => padT + (1 - pct / 100) * chartH;

  // Build smooth cubic bezier path from data points
  const pts = dummyDataBayi.map((d) => [toX(d.bulanKe), toY(d.capaian_persen)] as [number, number]);
  let pathD = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const cpx = (pts[i - 1][0] + pts[i][0]) / 2;
    pathD += ` C ${cpx},${pts[i - 1][1]} ${cpx},${pts[i][1]} ${pts[i][0]},${pts[i][1]}`;
  }
  const areaD = `${pathD} L${pts[pts.length - 1][0]},${padT + chartH} L${pts[0][0]},${padT + chartH} Z`;

  const selectedPt = dummyDataBayi.find((d) => d.bulanKe === selectedBulan);
  const selX = selectedPt ? toX(selectedPt.bulanKe) : null;
  const selY = selectedPt ? toY(selectedPt.capaian_persen) : null;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#27AE60" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#27AE60" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Y grid + labels */}
      {yLabels.map((label, i) => {
        const y = padT + ((5 - i) / 5) * chartH;
        return (
          <g key={label}>
            <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="#E2E8F0" strokeWidth={1} />
            <text x={padL - 8} y={y + 4} fontSize={11} fill="#94A3B8" textAnchor="end">{label}</text>
          </g>
        );
      })}

      {/* X labels */}
      {dummyDataBayi.map((d) => (
        <text key={d.bulanKe} x={toX(d.bulanKe)} y={h - 4} fontSize={11} fill="#94A3B8" textAnchor="middle">
          {`Bulan ${d.bulanKe === 0 ? 1 : d.bulanKe < 6 ? d.bulanKe + 1 : d.bulanKe}`}
        </text>
      ))}

      {/* Selected bulan vertical guide */}
      {selX !== null && (
        <line x1={selX} y1={padT} x2={selX} y2={padT + chartH} stroke="#006C49" strokeWidth={1} strokeDasharray="4 3" opacity={0.4} />
      )}

      {/* Area */}
      <path d={areaD} fill="url(#areaGrad)" />
      {/* Line */}
      <path d={pathD} fill="none" stroke="#27AE60" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* Data dots */}
      {dummyDataBayi.map((d) => {
        const x = toX(d.bulanKe);
        const y = toY(d.capaian_persen);
        const isSelected = d.bulanKe === selectedBulan;
        return (
          <g key={d.bulanKe}>
            {isSelected && <circle cx={x} cy={y} r={10} fill="#27AE60" opacity={0.12} />}
            <circle cx={x} cy={y} r={isSelected ? 6 : 4.5} fill="white" stroke="#27AE60" strokeWidth={2.5} />
            {isSelected && (
              <text x={x} y={y - 14} fontSize={11} fill="#27AE60" fontWeight="700" textAnchor="middle">
                {d.capaian_persen}%
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
          const dashLen = Math.max(arcLen - gap, 0);
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

  const snapBayi = dummyDataBayi.find((d) => d.bulanKe === selectedBulan)!;
  const snapIbu  = dummyDataIbu.find((d)  => d.bulanKe === selectedBulan)!;

  const bayiSegments: DonutSegment[] = [
    { value: snapBayi.status_normal,      color: "#27AE60", label: "Normal" },
    ...(snapBayi.status_terindikasi !== null ? [{ value: snapBayi.status_terindikasi, color: "#5DCAA5", label: "Terindikasi" }] : []),
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
                    {dummyDataBayi.map((d) => (
                      <option key={d.bulanKe} value={d.bulanKe}>
                        {d.periode} (Bulan ke-{d.bulanKe === 0 ? 1 : d.bulanKe < 6 ? d.bulanKe + 1 : d.bulanKe})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                </div>
              </div>
            </motion.div>

            {/* KPI Row */}
            {activeTab === "bayi" ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
                className="grid grid-cols-4 gap-6"
              >
                {/* Total Bayi */}
                <div className="relative bg-white border border-[#BBCABF]/60 rounded-xl shadow-[0_12px_20px_-4px_rgba(0,0,0,0.06),0_4px_8px_-3px_rgba(0,0,0,0.04)] p-6 flex flex-col gap-3 overflow-hidden">
                  <p className="text-[11px] font-semibold tracking-[1.1px] uppercase text-[#6C7A71] leading-tight">Total Bayi</p>
                  <span className="text-[40px] font-bold leading-none text-[#0B1C30]">{snapBayi.total_subjek}</span>
                  <div className="border-t border-[#BBCABF]/30 pt-3 flex justify-center text-sm text-[#3C4A42]">
                    <span>Dari 1000 HPK</span>
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
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl bg-[#5DCAA5]" />
                  <p className="text-[11px] font-semibold tracking-[1.1px] uppercase text-[#6C7A71]">Bayi Terindikasi</p>
                  <div className="flex items-end gap-3">
                    <span className="text-[40px] font-bold leading-none text-[#0B1C30]">{snapBayi.status_terindikasi ?? 0}</span>
                    {terindikasiDeltaBayi !== 0 && (
                      <span className="mb-1 flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium" style={{ color: "#006C49", backgroundColor: "rgba(93,202,165,0.15)" }}>
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
                {/* Total Ibu */}
                <div className="relative bg-white border border-[#BBCABF]/60 rounded-xl shadow-[0_12px_20px_-4px_rgba(0,0,0,0.06),0_4px_8px_-3px_rgba(0,0,0,0.04)] p-6 flex flex-col gap-3 overflow-hidden">
                  <p className="text-[11px] font-semibold tracking-[1.1px] uppercase text-[#6C7A71] leading-tight">Total Ibu</p>
                  <span className="text-[40px] font-bold leading-none text-[#0B1C30]">{snapIbu.total_subjek}</span>
                  <div className="border-t border-[#BBCABF]/30 pt-3 flex justify-center text-sm text-[#3C4A42]">
                    <span>Dari 1000 HPK</span>
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
                <button className="text-[#6C7A71] hover:text-[#334155] transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <LineChart selectedBulan={selectedBulan} />
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
                        ...(snapBayi.status_terindikasi !== null ? [{ label: "Terindikasi", value: snapBayi.status_terindikasi, pct: ((snapBayi.status_terindikasi / snapBayi.total_subjek) * 100).toFixed(1), color: "#5DCAA5" }] : []),
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
