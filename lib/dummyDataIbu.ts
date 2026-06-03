import dummyDataPasien, { getStatusIbuAt } from "./dummyDataPasien";

interface IbuPeriodData {
  id: number;
  periode: string;
  bulanKe: number;
  label_fase: string;
  total_subjek: number;
  status_normal: number;
  status_gravida_normal: number;
  status_primi_normal: number;
  status_malgizi: number;
  status_gravida_malgizi: number;
  status_primi_malgizi: number;
  capaian_persen: number;
}

const metadata = [
  { id: 1,  periode: "April 2023",     bulanKe: 0,  label_fase: "Baseline Data" },
  { id: 11, periode: "Mei 2023",       bulanKe: 1,  label_fase: "Intervensi Bulan 2" },
  { id: 12, periode: "Juni 2023",      bulanKe: 2,  label_fase: "Intervensi Bulan 3" },
  { id: 13, periode: "Juli 2023",      bulanKe: 3,  label_fase: "Intervensi Bulan 4" },
  { id: 14, periode: "Agustus 2023",   bulanKe: 4,  label_fase: "Intervensi Bulan 5" },
  { id: 2,  periode: "September 2023", bulanKe: 6,  label_fase: "Intervensi Semester 1" },
  { id: 3,  periode: "Maret 2024",     bulanKe: 12, label_fase: "Evaluasi Tahun 1" },
  { id: 4,  periode: "September 2024", bulanKe: 18, label_fase: "Intervensi Semester 3" },
  { id: 5,  periode: "Maret 2025",     bulanKe: 24, label_fase: "Evaluasi Tahun 2" },
  { id: 6,  periode: "September 2025", bulanKe: 30, label_fase: "Pemulihan Akhir" },
  { id: 7,  periode: "Maret 2026",     bulanKe: 36, label_fase: "Target Selesai (1000 HPK)" },
];

const dummyDataIbu: IbuPeriodData[] = metadata.map((item) => {
  const total_subjek = dummyDataPasien.length;
  const status_normal = dummyDataPasien.filter((p) => getStatusIbuAt(p, item.bulanKe) === "Normal").length;
  const status_gravida_normal = dummyDataPasien.filter((p) => !p.id.startsWith("PS-2") && getStatusIbuAt(p, item.bulanKe) === "Normal").length;
  const status_primi_normal = dummyDataPasien.filter((p) => p.id.startsWith("PS-2") && getStatusIbuAt(p, item.bulanKe) === "Normal").length;
  const status_malgizi = dummyDataPasien.filter((p) => getStatusIbuAt(p, item.bulanKe) === "Malgizi").length;
  const status_gravida_malgizi = dummyDataPasien.filter((p) => !p.id.startsWith("PS-2") && getStatusIbuAt(p, item.bulanKe) === "Malgizi").length;
  const status_primi_malgizi = dummyDataPasien.filter((p) => p.id.startsWith("PS-2") && getStatusIbuAt(p, item.bulanKe) === "Malgizi").length;
  const capaian_persen = parseFloat(((status_normal / total_subjek) * 100).toFixed(1));

  return {
    id: item.id,
    periode: item.periode,
    bulanKe: item.bulanKe,
    label_fase: item.label_fase,
    total_subjek,
    status_normal,
    status_gravida_normal,
    status_primi_normal,
    status_malgizi,
    status_gravida_malgizi,
    status_primi_malgizi,
    capaian_persen,
  };
});

export default dummyDataIbu;
