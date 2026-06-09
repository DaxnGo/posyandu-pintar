"use client";

import { Info } from "lucide-react";
import dummyDataIbu from "@/lib/dummyDataIbu";
import dummyDataBayi from "@/lib/dummyDataBayi";

export default function DataSummary() {
  const bayiBaseline = dummyDataBayi.find((d) => d.bulanKe === 0)!;
  const ibuBaseline = dummyDataIbu.find((d) => d.bulanKe === 0)!;

  // Ibu breakdown: Total = 156 normal, 44 malgizi
  // Gravida: 118 normal, 32 malgizi
  // Primigravida: 38 normal, 12 malgizi
  const ibuGravida = {
    total: 150,
    normal: 118,
    malgizi: 32,
  };

  const ibuPrimigravida = {
    total: 50,
    normal: 38,
    malgizi: 12,
  };

  const totalMalgizi = ibuGravida.malgizi + ibuPrimigravida.malgizi; // 44

  return (
    <div className="bg-white border border-[#BBCABF]/60 rounded-xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] p-8 mb-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-[#006C49] rounded-full"></div>
          <h2 className="text-lg font-bold text-[#0B1C30]">Ringkasan Data Program Posyandu Utama</h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Program Timeline */}
          <div className="flex items-center justify-between p-4 bg-[#F8F9FF] border border-[#E2E8F0] rounded-lg">
            <div>
              <p className="text-sm text-[#6C7A71] font-medium">Program Duration</p>
              <p className="text-[#0B1C30] font-semibold">April 2023 - Maret 2026 (36 Bulan / 1000 HPK)</p>
            </div>
            <div className="text-3xl font-bold text-[#006C49]">36</div>
          </div>

          {/* Ibu Data */}
          <div>
            <h3 className="font-semibold text-[#0B1C30] mb-3">Total Ibu: 200</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Gravida */}
              <div className="p-4 bg-[#F0F9FF] border border-[#BFE7FF] rounded-lg">
                <p className="text-xs text-[#0369A1] font-semibold mb-3">IBU GRAVIDA</p>
                <div className="flex items-end justify-between mb-3">
                  <span className="text-2xl font-bold text-[#0B1C30]">{ibuGravida.total}</span>
                  <span className="text-xs text-[#6C7A71]">Subjek</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#3C4A42]">Normal</span>
                    <span className="font-semibold text-[#0B1C30]">{ibuGravida.normal} ({((ibuGravida.normal / ibuGravida.total) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#3C4A42]">Malgizi</span>
                    <span className="font-semibold text-[#E74C3C]">{ibuGravida.malgizi} ({((ibuGravida.malgizi / ibuGravida.total) * 100).toFixed(1)}%)</span>
                  </div>
                </div>
              </div>

              {/* Primigravida */}
              <div className="p-4 bg-[#FDF2F8] border border-[#FBCFE8] rounded-lg">
                <p className="text-xs text-[#9F1239] font-semibold mb-3">IBU PRIMIGRAVIDA</p>
                <div className="flex items-end justify-between mb-3">
                  <span className="text-2xl font-bold text-[#0B1C30]">{ibuPrimigravida.total}</span>
                  <span className="text-xs text-[#6C7A71]">Subjek</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#3C4A42]">Normal</span>
                    <span className="font-semibold text-[#0B1C30]">{ibuPrimigravida.normal} ({((ibuPrimigravida.normal / ibuPrimigravida.total) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#3C4A42]">Malgizi</span>
                    <span className="font-semibold text-[#E74C3C]">{ibuPrimigravida.malgizi} ({((ibuPrimigravida.malgizi / ibuPrimigravida.total) * 100).toFixed(1)}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Malgizi */}
            <div className="mt-4 p-4 bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#7F1D1D]">Total Ibu Malgizi</span>
                <span className="text-2xl font-bold text-[#DC2626]">
                  {totalMalgizi} <span className="text-sm text-[#6C7A71] font-medium">({((totalMalgizi / 200) * 100).toFixed(1)}%)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bayi Data */}
          <div>
            <h3 className="font-semibold text-[#0B1C30] mb-3">Total Bayi: {bayiBaseline.total_subjek}</h3>
            <div className="grid grid-cols-3 gap-4">
              {/* Sehat */}
              <div className="p-4 bg-[#F0FDF4] border border-[#BBEF63] rounded-lg">
                <p className="text-xs text-[#166534] font-semibold mb-2">BAYI SEHAT</p>
                <div className="text-3xl font-bold text-[#15803D] mb-1">{bayiBaseline.status_normal}</div>
                <p className="text-xs text-[#6C7A71]">({((bayiBaseline.status_normal / bayiBaseline.total_subjek) * 100).toFixed(1)}%)</p>
              </div>

              {/* Terindikasi */}
              <div className="p-4 bg-[#FFFBEB] border border-[#FDE047] rounded-lg">
                <p className="text-xs text-[#92400E] font-semibold mb-2">BAYI TERINDIKASI</p>
                <div className="text-3xl font-bold text-[#B45309] mb-1">{bayiBaseline.status_terindikasi ?? 0}</div>
                <p className="text-xs text-[#6C7A71]">({(((bayiBaseline.status_terindikasi ?? 0) / bayiBaseline.total_subjek) * 100).toFixed(1)}%)</p>
              </div>

              {/* Stunting */}
              <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-lg">
                <p className="text-xs text-[#7F1D1D] font-semibold mb-2">BAYI STUNTING</p>
                <div className="text-3xl font-bold text-[#DC2626] mb-1">{bayiBaseline.status_stunting}</div>
                <p className="text-xs text-[#6C7A71]">({((bayiBaseline.status_stunting / bayiBaseline.total_subjek) * 100).toFixed(1)}%)</p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="flex items-start gap-3 p-4 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg">
            <Info className="w-4 h-4 text-[#64748B] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#64748B]">
              Data ringkasan menampilkan baseline periode April 2023. Bayi total adalah 150 dari Ibu Gravida. Primigravida tidak memiliki bayi (hanya data ibu yang dipantau).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
