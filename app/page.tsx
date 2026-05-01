"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";
import {
  Users,
  Target,
  Activity,
  ArrowRight,
  ChevronRight,
  Circle,
  ShieldCheck,
} from "lucide-react";

// ─── Animation Variants ────────────────────────────────────────────────────────

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// ─── Section Wrapper (triggers animation on scroll) ────────────────────────────

function AnimatedSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-white/70 border-b border-white/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[#006C49] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="text-[#006C49] font-bold text-lg tracking-tight">
            POSYANDU <span className="text-[#0B1C30]">PINTAR</span>
          </span>
        </a>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {["Home", "Metodologi", "Timeline"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-slate-600 hover:text-[#006C49] transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <motion.a
          href="/login"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="bg-[#006C49] text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow hover:bg-[#005a3c] transition-colors"
        >
          Portal Petugas
        </motion.a>
      </div>
    </header>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      id="home"
      className="min-h-screen pt-28 pb-20 flex items-center bg-[#F8F9FF]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Column */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-[#006C49] text-xs font-semibold px-4 py-1.5 rounded-full">
              <Circle className="w-2 h-2 fill-[#006C49]" />
              Inisiatif Kesehatan Nasional
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-[#0B1C30] leading-tight tracking-tight"
          >
            Mengawal{" "}
            <span className="text-[#006C49]">
              1000 Hari Pertama
            </span>{" "}
            Kehidupan (HPK)
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl"
          >
            Sistem Pemantauan Terpadu untuk Masa Depan Bebas Stunting. Pendekatan
            analitik untuk memastikan setiap anak tumbuh optimal.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-[#006C49] text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-[#005a3c] transition-colors"
            >
              Mulai Pemantauan
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 border-2 border-[#006C49] text-[#006C49] font-semibold px-6 py-3 rounded-lg hover:bg-green-50 transition-colors"
            >
              Pelajari Sistem
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Micro-stats row */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center gap-6 pt-4"
          >
            {[
              { value: "150", label: "Subjek Aktif" },
              { value: "36", label: "Bulan Pantau" },
              { value: "100%", label: "Target Zero Stunting" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="text-2xl font-black text-[#006C49]">
                  {s.value}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column — Image Placeholder */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative"
        >
          {/* Decorative gradient ring */}
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-[#006C49]/20 via-[#EFF4FF] to-[#006C49]/10 blur-xl opacity-70" />

          {/* Main image card */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/60 aspect-[4/3]">
            <img
              src="/hero-mother-baby.png"
              alt="Ibu dan bayi dalam pemantauan 1000 HPK"
              className="w-full h-full object-cover"
            />
            {/* Subtle green overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#006C49]/30 via-transparent to-transparent" />

            {/* Floating status card */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:w-64">
              <div className="backdrop-blur-md bg-white/80 border border-white/50 rounded-xl px-4 py-3 shadow-lg flex items-center gap-3">
                {/* Pulsing indicator */}
                <span className="relative flex h-3 w-3 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006C49] opacity-60" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-[#006C49]" />
                </span>
                <div>
                  <p className="text-xs font-bold text-[#0B1C30]">
                    Status Pantau
                  </p>
                  <p className="text-[10px] text-[#006C49] font-semibold">
                    Aktif Berjalan
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[10px] text-slate-400">Diperbarui</p>
                  <p className="text-[10px] font-semibold text-slate-600">
                    Hari ini
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Statistics Bento Grid ─────────────────────────────────────────────────────

function StatisticsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="metodologi" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <AnimatedSection className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#006C49] mb-3 block">
            Statistik Program
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1C30]">
            Dampak Nyata Pemantauan
          </h2>
          <p className="mt-3 text-slate-500 max-w-lg mx-auto text-sm sm:text-base">
            Data terukur dari program pemantauan terpadu selama 36 bulan
          </p>
        </AnimatedSection>

        {/* Bento Grid */}
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card 1 — Subjek Terpantau */}
          <motion.div
            variants={cardVariant}
            whileHover={{ y: -4, scale: 1.01 }}
            className="bg-white border border-slate-100 rounded-2xl p-8 shadow-md flex flex-col gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#EFF4FF] flex items-center justify-center group-hover:bg-[#006C49]/10 transition-colors">
              <Users className="w-6 h-6 text-[#006C49]" />
            </div>
            <div>
              <p className="text-5xl font-black text-[#0B1C30] tracking-tight">
                150
              </p>
              <p className="text-base font-bold text-[#0B1C30] mt-1">
                Subjek Terpantau
              </p>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                Ibu hamil & balita aktif dalam siklus pemantauan 1000 HPK
              </p>
            </div>
            <div className="mt-auto pt-4 border-t border-slate-50">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006C49] bg-green-50 px-3 py-1 rounded-full">
                <Circle className="w-1.5 h-1.5 fill-[#006C49]" />
                Enrollment Aktif
              </span>
            </div>
          </motion.div>

          {/* Card 2 — Target (Green) */}
          <motion.div
            variants={cardVariant}
            whileHover={{ y: -4, scale: 1.01 }}
            className="bg-[#006C49] rounded-2xl p-8 shadow-xl flex flex-col gap-4 relative overflow-hidden"
          >
            {/* Decorative circle */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
            <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/5" />

            <div className="relative w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="relative">
              <p className="text-5xl font-black text-white tracking-tight">
                100%
              </p>
              <p className="text-base font-bold text-green-100 mt-1">
                Target Sembuh
              </p>
              <p className="text-sm text-green-200/80 mt-1 leading-relaxed">
                Zero stunting & malnutrisi pada akhir program pemantauan
              </p>
            </div>
            <div className="relative mt-auto pt-4 border-t border-white/20">
              <p className="text-xs font-semibold text-green-200">
                Target deadline
              </p>
              <p className="text-sm font-bold text-white mt-0.5">
                By March 31, 2026
              </p>
            </div>
          </motion.div>

          {/* Card 3 — Z-Score */}
          <motion.div
            variants={cardVariant}
            whileHover={{ y: -4, scale: 1.01 }}
            className="bg-white border border-slate-100 rounded-2xl p-8 shadow-md flex flex-col gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#EFF4FF] flex items-center justify-center group-hover:bg-[#006C49]/10 transition-colors">
              <Activity className="w-6 h-6 text-[#006C49]" />
            </div>
            <div>
              <p className="text-xl font-black text-[#0B1C30] tracking-tight leading-snug">
                Algoritma Z-Score WHO
              </p>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Standardized monitoring untuk akurasi data pertumbuhan
                berstandar internasional dengan evaluasi 3x seminggu.
              </p>
            </div>
            {/* Visual bar */}
            <div className="mt-auto space-y-2 pt-4 border-t border-slate-50">
              {[
                { label: "BB/U", pct: 88 },
                { label: "TB/U", pct: 75 },
                { label: "BB/TB", pct: 92 },
              ].map((bar) => (
                <div key={bar.label} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 w-10">
                    {bar.label}
                  </span>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${bar.pct}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                      className="h-full bg-[#006C49] rounded-full"
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#006C49] w-8 text-right">
                    {bar.pct}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Timeline ──────────────────────────────────────────────────────────────────

const timelineSteps = [
  {
    date: "April 2023",
    phase: "Fase 1",
    title: "Inisiasi & Baseline Data",
    description:
      "Pendaftaran 150 subjek (ibu hamil & balita) ke dalam sistem. Pengambilan data baseline anthropometri, riwayat gizi, dan faktor risiko keluarga sebagai fondasi analitik.",
    tags: ["Enrollment", "Baseline", "150 Subjek"],
    status: "completed",
  },
  {
    date: "Fase Berjalan",
    phase: "Fase 2",
    title: "Monitoring Intensif",
    description:
      "Evaluasi Z-Score konstan 3x seminggu. Pemantauan berat badan, tinggi badan, dan lingkar kepala menggunakan standar WHO. Intervensi gizi dipersonalisasi per subjek.",
    tags: ["Z-Score", "3x/Minggu", "Intervensi"],
    status: "active",
  },
  {
    date: "Maret 2026",
    phase: "Fase 3",
    title: "Evaluasi Akhir 1000 HPK",
    description:
      "Validasi target 100% zero stunting & malnutrisi. Analisis longitudinal dampak program, penyusunan laporan akhir, dan rekomendasi kebijakan kesehatan nasional.",
    tags: ["Validasi", "Zero Stunting", "Laporan Akhir"],
    status: "upcoming",
  },
];

function TimelineSection() {
  return (
    <section id="timeline" className="py-24 bg-[#F8F9FF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <AnimatedSection className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#006C49] mb-3 block">
            Metodologi
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1C30]">
            Siklus Pemantauan 36 Bulan
          </h2>
          <p className="mt-3 text-slate-500 text-sm sm:text-base">
            Berjalan dari{" "}
            <span className="font-semibold text-[#0B1C30]">April 2023</span>{" "}
            hingga{" "}
            <span className="font-semibold text-[#0B1C30]">Maret 2026</span>
          </p>
        </AnimatedSection>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#006C49]/40 via-[#006C49]/20 to-transparent -translate-x-1/2" />

          <div className="space-y-12">
            {timelineSteps.map((step, i) => {
              const ref = useRef(null);
              const inView = useInView(ref, { once: true, margin: "-60px" });

              const isRight = i % 2 === 0;

              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ opacity: 0, x: isRight ? -30 : 30 }}
                  animate={
                    inView
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: isRight ? -30 : 30 }
                  }
                  transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.1 }}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    isRight ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Card */}
                  <div
                    className={`flex-1 md:max-w-[calc(50%-2rem)] ${
                      isRight ? "md:pr-10" : "md:pl-10"
                    } ml-14 md:ml-0`}
                  >
                    <motion.div
                      whileHover={{ y: -3 }}
                      className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 relative"
                    >
                      {/* Status indicator top-right */}
                      <span
                        className={`absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          step.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : step.status === "active"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {step.status === "completed"
                          ? "Selesai"
                          : step.status === "active"
                          ? "Berjalan"
                          : "Mendatang"}
                      </span>

                      <p className="text-xs font-bold text-[#006C49] uppercase tracking-wider mb-1">
                        {step.phase}
                      </p>
                      <p className="text-sm font-semibold text-slate-400 mb-2">
                        {step.date}
                      </p>
                      <h3 className="text-lg font-bold text-[#0B1C30] mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed mb-4">
                        {step.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {step.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-semibold bg-[#EFF4FF] text-[#006C49] px-2.5 py-1 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Center dot — desktop only */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-6 items-center justify-center z-10">
                    <div
                      className={`w-5 h-5 rounded-full border-4 border-white shadow ${
                        step.status === "active"
                          ? "bg-[#006C49]"
                          : step.status === "completed"
                          ? "bg-[#006C49]"
                          : "bg-slate-300"
                      }`}
                    >
                      {step.status === "active" && (
                        <span className="absolute w-5 h-5 rounded-full bg-[#006C49] animate-ping opacity-50" />
                      )}
                    </div>
                  </div>

                  {/* Mobile dot */}
                  <div className="md:hidden absolute left-6 top-6 -translate-x-1/2 z-10">
                    <div
                      className={`w-5 h-5 rounded-full border-4 border-white shadow ${
                        step.status === "active"
                          ? "bg-[#006C49]"
                          : step.status === "completed"
                          ? "bg-[#006C49]"
                          : "bg-slate-300"
                      }`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#0B1C30] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#006C49] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">POSYANDU PINTAR</p>
              <p className="text-xs text-slate-400">
                Sistem Pemantauan 1000 HPK
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500 text-center">
            © 2023–2026 Posyandu Pintar. Program Kesehatan Nasional — Bebas
            Stunting.
          </p>
          <div className="flex gap-6">
            {["Home", "Metodologi", "Timeline"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function PosyanduPintarPage() {
  return (
    <main
      className="min-h-screen font-sans antialiased"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Navbar />
      <HeroSection />
      <StatisticsSection />
      <TimelineSection />
      <Footer />
    </main>
  );
}
