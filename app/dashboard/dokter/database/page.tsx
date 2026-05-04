"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, HelpCircle, UserCircle, LayoutGrid,
  TrendingUp, Users, LogOut, ChevronDown,
  RefreshCw, MoreVertical, Baby, User,
  CheckCircle2,
} from "lucide-react";
import dummyDataPasien, {
  getStatusAt, getStatusIbuAt,
  type StatusGizi, type StatusGiziIbu,
} from "@/lib/dummyDataPasien";
import dummyDataBayi from "@/lib/dummyDataBayi";

const PAGE_SIZE = 10;
const PERIODS   = dummyDataBayi.map((d) => d.bulanKe); // [0,6,12,18,24,30,36]

// ── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: StatusGizi | StatusGiziIbu }) {
  const style: Record<string, { bg: string; text: string }> = {
    Normal:      { bg: "rgba(16,185,129,0.16)", text: "#047857" },
    Stunting:    { bg: "#FFDAD6",               text: "#93000A" },
    Terindikasi: { bg: "#FEF9C3",               text: "#854D0E" },
    Malgizi:     { bg: "#FEF3C7",               text: "#92400E" },
  };
  const s = style[status] ?? style["Normal"];
  return (
    <span
      className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wide whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {status}
    </span>
  );
}

// ── Z-Score Cell ──────────────────────────────────────────────────────────────

function ZScoreCell({ value }: { value: number }) {
  const color = value <= -2 ? "#BA1A1A" : value < -1 ? "#D97706" : "#059669";
  return (
    <span className="font-bold tabular-nums text-sm" style={{ color }}>
      {value > 0 ? `+${value}` : value}
    </span>
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

export default function DatabasePasien() {
  const [activeTab,    setActiveTab]    = useState<"bayi" | "ibu">("bayi");
  const [pendingBulan, setPendingBulan] = useState(0);
  const [activeBulan,  setActiveBulan]  = useState(0);   // committed period
  const [filter,       setFilter]       = useState("semua");
  const [page,         setPage]         = useState(1);
  const [refreshing,   setRefreshing]   = useState(false);
  const [justRefreshed, setJustRefreshed] = useState(false);
  const [userRole, setUserRole] = useState("dokter");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) setUserRole(role);
  }, []);

  const isDirty = pendingBulan !== activeBulan;
  const periodLabel = dummyDataBayi.find((d) => d.bulanKe === activeBulan)?.periode ?? "";

  // ── Perbarui Data ─────────────────────────────────────────────────────────
  function handlePerbarui() {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => {
      setActiveBulan(pendingBulan);
      setFilter("semua");
      setPage(1);
      setRefreshing(false);
      setJustRefreshed(true);
      setTimeout(() => setJustRefreshed(false), 2000);
    }, 600);
  }

  // ── Compute statuses for active period ───────────────────────────────────
  const withStatus = useMemo(() =>
    dummyDataPasien.map((p) => ({
      ...p,
      status:    getStatusAt(p,    activeBulan),
      statusIbu: getStatusIbuAt(p, activeBulan),
    })),
  [activeBulan]);

  // ── KPI counts ───────────────────────────────────────────────────────────
  const total         = withStatus.length;
  const normalBayi    = withStatus.filter((p) => p.status    === "Normal").length;
  const stuntingCount = withStatus.filter((p) => p.status    === "Stunting").length;
  const terindCount   = withStatus.filter((p) => p.status    === "Terindikasi").length;
  const normalIbu     = withStatus.filter((p) => p.statusIbu === "Normal").length;
  const malgiziCount  = withStatus.filter((p) => p.statusIbu === "Malgizi").length;

  const kpi = activeTab === "bayi"
    ? { highlight: normalBayi, highlightLabel: "Target Normal", riskVal: stuntingCount + terindCount,
        riskLabel: "Sisa Intervensi", riskSub: `${terindCount} Terindikasi · ${stuntingCount} Stunting` }
    : { highlight: normalIbu,  highlightLabel: "Normal Ibu",    riskVal: malgiziCount,
        riskLabel: "Malgizi Ibu",    riskSub: "Kurang Energi / Anemia" };

  // ── Filter pills ─────────────────────────────────────────────────────────
  const pills = activeTab === "bayi"
    ? [
        { key: "semua",       label: "Semua",       count: total         },
        { key: "normal",      label: "Normal",       count: normalBayi   },
        { key: "terindikasi", label: "Terindikasi",  count: terindCount  },
        { key: "stunting",    label: "Stunting",     count: stuntingCount },
      ]
    : [
        { key: "semua",    label: "Semua",       count: total      },
        { key: "normal",   label: "Normal Ibu",  count: normalIbu  },
        { key: "malgizi",  label: "Malgizi Ibu", count: malgiziCount },
      ];

  function handleTabChange(tab: "bayi" | "ibu") {
    setActiveTab(tab);
    setFilter("semua");
    setPage(1);
    if (tab === "ibu") {
      if (pendingBulan < 6) setPendingBulan(6);
      if (activeBulan < 6) setActiveBulan(6);
    }
  }

  function handleFilter(key: string) {
    setFilter(key);
    setPage(1);
  }

  // ── Filtered rows ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const fn = (p: typeof withStatus[0]) => {
      const st = activeTab === "bayi" ? p.status : p.statusIbu;
      if (filter === "semua")       return true;
      if (filter === "normal")      return st === "Normal";
      if (filter === "stunting")    return st === "Stunting";
      if (filter === "terindikasi") return st === "Terindikasi";
      if (filter === "malgizi")     return st === "Malgizi";
      return true;
    };
    return withStatus.filter(fn);
  }, [withStatus, filter, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function rowAccent(status: string) {
    if (status === "Stunting" || status === "Malgizi")
      return "border-l-[3px] border-l-[#E74C3C] bg-red-50/25";
    if (status === "Terindikasi")
      return "border-l-[3px] border-l-[#F59E0B] bg-amber-50/20";
    return "border-l-[3px] border-l-transparent";
  }

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
          <NavItem icon={TrendingUp} label="Tren & Semester" href="/dashboard/dokter/tren" />
          <NavItem icon={Users}      label="Database Pasien" active href="/dashboard/dokter/database" />
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
            <h2 className="text-xl font-bold text-[#0B1C30] tracking-tight">Dashboard Database Pasien</h2>
            <div className="flex items-center bg-[#F1F5F9] rounded-xl p-1.5 gap-1">
              {(["bayi", "ibu"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
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
          <div className="max-w-[976px] mx-auto flex flex-col gap-6">

            {/* Period & Action bar */}
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="flex items-center justify-between gap-4"
            >
              {/* Dropdown */}
              <div className="flex items-center gap-3">
                <div className="relative flex items-center gap-2 bg-white border border-[#BBCABF] rounded-lg px-4 py-2.5 shadow-sm">
                  <span className="text-xs font-medium text-[#6C7A71] whitespace-nowrap">Periode Monitoring:</span>
                  <select
                    value={pendingBulan}
                    onChange={(e) => setPendingBulan(Number(e.target.value))}
                    className="appearance-none bg-transparent text-sm font-semibold text-[#0B1C30] outline-none pr-5 cursor-pointer"
                  >
                    {dummyDataBayi.filter(d => activeTab === "bayi" || d.bulanKe >= 6).map((d) => (
                      <option key={d.bulanKe} value={d.bulanKe}>
                        {d.periode} (Bulan ke-{d.bulanKe === 0 ? "1" : d.bulanKe < 6 ? d.bulanKe + 1 : d.bulanKe})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                </div>

                {/* "Belum diperbarui" indicator */}
                <AnimatePresence>
                  {isDirty && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}
                      className="text-xs text-[#D97706] font-medium bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg"
                    >
                      ● Data belum diperbarui
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Perbarui Data button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handlePerbarui}
                disabled={refreshing}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold shadow-[0_4px_6px_-1px_rgba(0,108,73,0.25)] transition-all ${
                  justRefreshed
                    ? "bg-[#059669] text-white"
                    : isDirty
                    ? "bg-[#006C49] hover:bg-[#005a3c] text-white ring-2 ring-[#006C49]/30"
                    : "bg-[#006C49] hover:bg-[#005a3c] text-white"
                } disabled:opacity-60`}
              >
                {justRefreshed ? (
                  <><CheckCircle2 className="w-3.5 h-3.5" />Berhasil Diperbarui</>
                ) : refreshing ? (
                  <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Memperbarui...</>
                ) : (
                  <><RefreshCw className="w-3.5 h-3.5" />Perbarui Data</>
                )}
              </motion.button>
            </motion.div>

            {/* KPI Row */}
            <motion.div
              key={activeBulan}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
              className="grid grid-cols-3 gap-5"
            >
              {/* Total Database */}
              <div className="bg-white border border-[#BBCABF] rounded-xl p-6 flex flex-col gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="w-10 h-10 bg-[#F8F9FF] border border-[#BBCABF] rounded-lg flex items-center justify-center">
                  <Users className="w-[18px] h-[18px] text-[#006C49]" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11px] font-bold tracking-[1.1px] uppercase text-[#6C7A71]">Total Database</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-[40px] font-bold leading-none tracking-tight text-[#0B1C30]">{total}</span>
                    <span className="text-sm font-semibold text-[#6C7A71]">Pairs</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1">Monitored infant-parent datasets</p>
                </div>
              </div>

              {/* Normal count */}
              <div className="bg-white border border-[#BBCABF] rounded-xl p-6 flex flex-col gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="w-10 h-10 bg-[#F8F9FF] border border-[#BBCABF] rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 20 20" fill="none" className="w-[17px] h-[17px]" stroke="#27AE60" strokeWidth={2}>
                    <circle cx="10" cy="10" r="8" />
                    <path d="M6.5 10.5l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11px] font-bold tracking-[1.1px] uppercase text-[#6C7A71]">{kpi.highlightLabel}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-[40px] font-bold leading-none tracking-tight text-[#0B1C30]">{kpi.highlight}</span>
                    <span className="text-sm font-semibold text-[#6C7A71]">{activeTab === "bayi" ? "Bayi" : "Ibu"}</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    {((kpi.highlight / total) * 100).toFixed(0)}% dari total subjek · <span className="text-[#006C49] font-semibold">{periodLabel}</span>
                  </p>
                </div>
              </div>

              {/* Risk count */}
              <div className="bg-white border border-[#BBCABF] rounded-xl p-6 flex flex-col gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="w-10 h-10 bg-[#FDEDEC] border border-[#FDEDEC] rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 22 20" fill="none" className="w-[18px] h-[16px]">
                    <path d="M11 1.5L1.5 18h19L11 1.5z" stroke="#E74C3C" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="11" y1="8.5" x2="11" y2="13" stroke="#E74C3C" strokeWidth={1.8} strokeLinecap="round" />
                    <circle cx="11" cy="15.5" r="0.9" fill="#E74C3C" />
                  </svg>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11px] font-bold tracking-[1.1px] uppercase text-[#6C7A71]">{kpi.riskLabel}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-[40px] font-bold leading-none tracking-tight text-[#0B1C30]">{kpi.riskVal}</span>
                    <span className="text-sm font-semibold text-[#6C7A71]">{activeTab === "bayi" ? "Bayi" : "Ibu"}</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1">{kpi.riskSub}</p>
                </div>
              </div>
            </motion.div>

            {/* Data Table */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white border border-[#BBCABF] rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              {/* Filter Pills */}
              <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center gap-2.5 flex-wrap">
                <AnimatePresence mode="popLayout">
                  {pills.map((pill) => {
                    const isActive = filter === pill.key;
                    return (
                      <motion.button
                        key={pill.key}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleFilter(pill.key)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-[#006C49] text-white shadow-sm"
                            : "bg-white border border-[#BBCABF] text-[#64748B] hover:border-[#006C49]/60 hover:text-[#0B1C30]"
                        }`}
                      >
                        {pill.label}
                        <span className={`ml-1.5 ${isActive ? "text-white/75" : "text-[#94A3B8]"}`}>
                          ({pill.count})
                        </span>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      {[
                        { label: "NO",            cls: "w-12 text-center"  },
                        { label: "NAMA BAYI",     cls: "text-left"         },
                        { label: "IBU",           cls: "text-left"         },
                        { label: "ID",            cls: "text-left"         },
                        { label: "UMUR",          cls: "text-right"        },
                        { label: "BB",            cls: "text-right"        },
                        { label: "TB",            cls: "text-right"        },
                        ...(activeTab === "bayi"
                          ? [{ label: "Z-SCORE",  cls: "text-right" }]
                          : [{ label: "BB IBU",   cls: "text-right" }]
                        ),
                        { label: "STATUS GIZI",   cls: "text-center"       },
                        { label: "UPDATE",        cls: "text-left"         },
                        { label: "",              cls: "w-12 text-center"  },
                      ].map((col, i) => (
                        <th key={i} className={`px-4 py-3 text-[10px] font-bold tracking-[0.8px] uppercase text-[#64748B] border-r border-[#F1F5F9] last:border-r-0 ${col.cls}`}>
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((row, idx) => {
                      const no     = (page - 1) * PAGE_SIZE + idx + 1;
                      const status = activeTab === "bayi" ? row.status : row.statusIbu;
                      return (
                        <tr
                          key={row.id}
                          className={`border-t border-[#F1F5F9] transition-colors hover:bg-[#F8FAFC]/80 ${rowAccent(status)}`}
                        >
                          <td className="px-4 py-3.5 text-[#94A3B8] text-center font-medium border-r border-[#F1F5F9]">{no}</td>
                          <td className="px-4 py-3.5 font-semibold text-[#0F172A] border-r border-[#F1F5F9] min-w-[150px]">{row.namaBayi}</td>
                          <td className="px-4 py-3.5 text-[#475569] border-r border-[#F1F5F9] min-w-[100px]">{row.ibu}</td>
                          <td className="px-4 py-3.5 font-mono text-xs text-[#94A3B8] border-r border-[#F1F5F9] tracking-wide">{row.id}</td>
                          <td className="px-4 py-3.5 text-[#475569] text-right border-r border-[#F1F5F9] tabular-nums">{row.umur} Bln</td>
                          <td className="px-4 py-3.5 text-[#475569] text-right border-r border-[#F1F5F9] tabular-nums">{row.bb} kg</td>
                          <td className="px-4 py-3.5 text-[#475569] text-right border-r border-[#F1F5F9] tabular-nums">{row.tb} cm</td>
                          {activeTab === "bayi"
                            ? <td className="px-4 py-3.5 text-right border-r border-[#F1F5F9]"><ZScoreCell value={row.zscore} /></td>
                            : <td className="px-4 py-3.5 text-[#475569] text-right border-r border-[#F1F5F9] tabular-nums">{row.bbIbu} kg</td>
                          }
                          <td className="px-4 py-3.5 text-center border-r border-[#F1F5F9]">
                            <StatusBadge status={status} />
                          </td>
                          <td className="px-4 py-3.5 text-xs text-[#94A3B8] border-r border-[#F1F5F9] whitespace-nowrap">{row.updateDate}</td>
                          <td className="px-4 py-3.5 text-center">
                            <button className="text-[#CBD5E1] hover:text-[#64748B] transition-colors rounded-md p-1 hover:bg-[#F1F5F9]">
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {pageRows.length === 0 && (
                      <tr>
                        <td colSpan={11} className="px-4 py-12 text-center text-sm text-[#94A3B8]">
                          Tidak ada data untuk filter ini pada periode yang dipilih.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between bg-[#FAFAFA]">
                <span className="text-xs text-[#94A3B8] font-medium">
                  Menampilkan{" "}
                  <span className="text-[#334155] font-semibold">
                    {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}
                  </span>{" "}
                  dari <span className="text-[#334155] font-semibold">{filtered.length}</span> pasien
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-sm text-[#334155] font-medium hover:bg-[#F8FAFC] hover:border-[#BBCABF] disabled:opacity-35 disabled:cursor-not-allowed transition-all"
                  >
                    Sebelumnya
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                          page === p ? "bg-[#006C49] text-white shadow-sm" : "text-[#64748B] hover:bg-[#F1F5F9]"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-sm text-[#334155] font-medium hover:bg-[#F8FAFC] hover:border-[#BBCABF] disabled:opacity-35 disabled:cursor-not-allowed transition-all"
                  >
                    Selanjutnya
                  </button>
                </div>
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
              <a key={l} href="#" className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest hover:text-[#006C49] transition-colors">{l}</a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
