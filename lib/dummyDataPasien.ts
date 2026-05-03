export type StatusGizi    = "Normal" | "Stunting" | "Terindikasi";
export type StatusGiziIbu = "Normal" | "Malgizi";

// bulanKe value → 0-based array index
export const PERIOD_IDX: Record<number, number> = { 0:0, 1:1, 2:2, 3:3, 4:4, 6:5, 12:6, 18:7, 24:8, 30:9, 36:10 };

export type Pasien = {
  id: string;
  namaBayi: string;
  ibu: string;
  umur: number;
  bb: number;
  tb: number;
  zscore: number;
  bbIbu: number;
  updateDate: string;
  statusByPeriod:    [StatusGizi, StatusGizi, StatusGizi, StatusGizi, StatusGizi, StatusGizi, StatusGizi, StatusGizi, StatusGizi, StatusGizi, StatusGizi];
  statusIbuByPeriod: [StatusGiziIbu, StatusGiziIbu, StatusGiziIbu, StatusGiziIbu, StatusGiziIbu, StatusGiziIbu, StatusGiziIbu, StatusGiziIbu, StatusGiziIbu, StatusGiziIbu, StatusGiziIbu];
};

// ── Short aliases ─────────────────────────────────────────────────────────────
const N: StatusGizi    = "Normal";
const S: StatusGizi    = "Stunting";
const T: StatusGizi    = "Terindikasi";
const n: StatusGiziIbu = "Normal";
const m: StatusGiziIbu = "Malgizi";

// ── Pre-built status patterns ─────────────────────────────────────────────────
// Bayi: always / terindikasi / stunting recovery timelines
const bNN: Pasien["statusByPeriod"] = [N,N,N,N,N,N,N,N,N,N,N];
const bT_M2: Pasien["statusByPeriod"] = [T,N,N,N,N,N,N,N,N,N,N];
const bT_M3: Pasien["statusByPeriod"] = [T,T,N,N,N,N,N,N,N,N,N];
const bT_M4: Pasien["statusByPeriod"] = [T,T,T,N,N,N,N,N,N,N,N];
const bT_M5: Pasien["statusByPeriod"] = [T,T,T,T,N,N,N,N,N,N,N];
const bT6: Pasien["statusByPeriod"] = [T,T,T,T,T,N,N,N,N,N,N];
const bT12: Pasien["statusByPeriod"] = [T,T,T,T,T,T,N,N,N,N,N];
const bT18: Pasien["statusByPeriod"] = [T,T,T,T,T,T,T,N,N,N,N];
const bT24: Pasien["statusByPeriod"] = [T,T,T,T,T,T,T,T,N,N,N];
const bS12: Pasien["statusByPeriod"] = [S,S,S,S,S,T,N,N,N,N,N];
const bS18: Pasien["statusByPeriod"] = [S,S,S,S,S,S,T,N,N,N,N];
const bS24: Pasien["statusByPeriod"] = [S,S,S,S,S,S,S,T,N,N,N];
const bS30: Pasien["statusByPeriod"] = [S,S,S,S,S,S,S,S,T,N,N];
const bS36: Pasien["statusByPeriod"] = [S,S,S,S,S,S,S,S,S,T,N];

// Ibu: malgizi recovery timelines (matches dummyDataIbu progression)
const iNN: Pasien["statusIbuByPeriod"] = [n,n,n,n,n,n,n,n,n,n,n];
const iM6: Pasien["statusIbuByPeriod"] = [m,m,m,m,m,n,n,n,n,n,n];
const iM12: Pasien["statusIbuByPeriod"] = [m,m,m,m,m,m,n,n,n,n,n];
const iM18: Pasien["statusIbuByPeriod"] = [m,m,m,m,m,m,m,n,n,n,n];
const iM24: Pasien["statusIbuByPeriod"] = [m,m,m,m,m,m,m,m,n,n,n];
const iM30: Pasien["statusIbuByPeriod"] = [m,m,m,m,m,m,m,m,m,n,n];
const iM36: Pasien["statusIbuByPeriod"] = [m,m,m,m,m,m,m,m,m,m,n];

// ── Compact patient builder ───────────────────────────────────────────────────
function mk(
  id: string, nb: string, ib: string,
  umur: number, bb: number, tb: number, zs: number, bbI: number,
  date: string,
  bp: Pasien["statusByPeriod"],
  ip: Pasien["statusIbuByPeriod"],
): Pasien {
  return { id, namaBayi: nb, ibu: ib, umur, bb, tb, zscore: zs, bbIbu: bbI, updateDate: date, statusByPeriod: bp, statusIbuByPeriod: ip };
}

// ── 150 Patients ──────────────────────────────────────────────────────────────
// Distribution at period 0: Normal=80, Terindikasi=50, Stunting=20
// Ibu malgizi at period 0: 32 → matches dummyDataIbu exactly

const dummyDataPasien: Pasien[] = [

  // ── Original 20 (PS-1029 to PS-1048) ────────────────────────────────────
  mk("PS-1029","Budi Santoso",   "Siti Rahma",   24,10.5,82,-2.1,44.0,"12 Okt 2023", [S,S,S,S,S,S,T,T,N,N,N], iM18),
  mk("PS-1030","Aisyah Putri",   "Dewi Lestari", 18,11.2,80, 0.5,58.0,"12 Okt 2023", bNN, iNN),
  mk("PS-1031","Rizky Aditya",   "Nurmala",      36,13.0,90,-1.8,47.5,"11 Okt 2023", bT_M2, iM12),
  mk("PS-1032","Sari Kusuma",    "Rina Susanti",  12, 9.0,74, 0.1,55.0,"11 Okt 2023", bNN, iNN),
  mk("PS-1033","Dwi Saputra",    "Lia Kusuma",   48,14.5,98,-2.3,43.5,"10 Okt 2023", [S,S,S,S,S,S,S,T,T,N,N], iM18),
  mk("PS-1034","Citra Kirana",   "Ani Budiarti",  6, 7.2,65, 0.8,61.0,"10 Okt 2023", bNN, iNN),
  mk("PS-1035","Galih Pratama",  "Sri Wahyuni",  22,11.0,84, 0.2,59.5,"09 Okt 2023", bNN, iNN),
  mk("PS-1036","Nadia Husna",    "Fatimah",      30,12.5,88,-1.9,46.0,"09 Okt 2023", bT_M2, iM12),
  mk("PS-1037","Fajar Nugroho",  "Wulandari",    15,10.0,77, 0.3,57.0,"08 Okt 2023", bNN, iNN),
  mk("PS-1038","Lina Safitri",   "Maryam",       20, 9.8,79,-0.4,52.5,"08 Okt 2023", bNN, iNN),
  mk("PS-1039","Hendra Kurnia",  "Sumiati",      42,13.8,95,-2.5,45.0,"07 Okt 2023", [S,S,S,S,S,S,T,T,N,N,N], iM12),
  mk("PS-1040","Putri Ayu",      "Rini Hartati",  9, 8.1,70, 0.6,60.0,"07 Okt 2023", bNN, iNN),
  mk("PS-1041","Bagas Prayoga",  "Endah Sari",   28,11.5,86,-1.5,48.5,"06 Okt 2023", bT_M2, iM6),
  mk("PS-1042","Zahra Kamila",   "Nurhayati",    33,12.2,89, 0.4,56.0,"06 Okt 2023", bNN, iNN),
  mk("PS-1043","Rio Firmansyah", "Kartini",      18,10.3,80,-0.2,54.0,"05 Okt 2023", bNN, iNN),
  mk("PS-1044","Maya Sari",      "Tuti Purwati", 24,11.8,85, 0.7,62.0,"05 Okt 2023", bNN, iNN),
  mk("PS-1045","Dimas Rahmat",   "Sulastri",     36,14.0,92,-2.2,44.5,"04 Okt 2023", bS12, iM6),
  mk("PS-1046","Indah Permata",  "Hariyati",     12, 8.9,73, 0.0,57.5,"04 Okt 2023", bNN, iNN),
  mk("PS-1047","Agus Setiawan",  "Dewi Murni",   27,11.3,85,-1.6,46.5,"03 Okt 2023", bT_M2, iM6),
  mk("PS-1048","Rara Adinda",    "Sri Lestari",   8, 7.8,68, 0.9,63.0,"03 Okt 2023", bNN, iNN),

  // ── Always-Normal bayi, Normal ibu (PS-1049 to PS-1102, 54 pasien) ───────
  mk("PS-1049","Aditya Putra",   "Wahyuni",       14,10.1,76,-1.2,58.5,"02 Okt 2023", bT_M2, iNN),
  mk("PS-1050","Alifa Zahra",    "Rahayu",        21,11.0,82,-1.4,59.0,"02 Okt 2023", bT_M2, iNN),
  mk("PS-1051","Andika Saputra", "Neni",          30,12.8,89,-1.1,56.0,"01 Okt 2023", bT_M2, iNN),
  mk("PS-1052","Aulia Rahma",    "Sripati",       10, 8.5,72,-1.3,57.0,"01 Okt 2023", bT_M2, iNN),
  mk("PS-1053","Aziz Prasetyo",  "Darwati",       19,10.7,80,-1.5,61.0,"30 Sep 2023", bT_M2, iNN),
  mk("PS-1054","Bima Sakti",     "Parini",        25,11.6,85,-1.2,55.5,"30 Sep 2023", bT_M2, iNN),
  mk("PS-1055","Bunga Citra",    "Karsiti",       16,10.2,78,-1.4,62.0,"29 Sep 2023", bT_M3, iNN),
  mk("PS-1056","Candra Wijaya",  "Rasmini",       32,13.0,90,-1.3,58.0,"29 Sep 2023", bT_M3, iNN),
  mk("PS-1057","Danu Arya",      "Supatmi",       12, 9.3,74,-1.1,60.0,"28 Sep 2023", bT_M3, iNN),
  mk("PS-1058","Dara Cantika",   "Lestari",       20,10.9,81,-1.5,57.5,"28 Sep 2023", bT_M3, iNN),
  mk("PS-1059","Devi Nur",       "Sugiarti",      27,12.0,87, 0.3,59.5,"27 Sep 2023", bNN, iNN),
  mk("PS-1060","Dian Purnama",   "Warsiti",       15,10.3,77, 0.6,56.5,"27 Sep 2023", bNN, iNN),
  mk("PS-1061","Difa Ramadan",   "Sutarni",       22,11.2,83, 0.2,60.5,"26 Sep 2023", bNN, iNN),
  mk("PS-1062","Elsa Maharani",  "Purwanti",       9, 8.2,70, 0.8,63.0,"26 Sep 2023", bNN, iNN),
  mk("PS-1063","Faiz Maulana",   "Legini",        17,10.5,79, 0.4,58.0,"25 Sep 2023", bNN, iNN),
  mk("PS-1064","Faris Ardian",   "Suryati",       28,12.3,88, 0.1,55.0,"25 Sep 2023", bNN, iNN),
  mk("PS-1065","Fitri Amalia",   "Mariati",       14,10.0,76, 0.5,61.5,"24 Sep 2023", bNN, iNN),
  mk("PS-1066","Galang Surya",   "Ratnasih",      23,11.4,84, 0.3,57.0,"24 Sep 2023", bNN, iNN),
  mk("PS-1067","Hafiz Ardianto", "Jumini",        31,12.9,90, 0.2,59.0,"23 Sep 2023", bNN, iNN),
  mk("PS-1068","Hana Berlian",   "Sumirah",        7, 7.5,67, 0.7,62.5,"23 Sep 2023", bNN, iNN),
  mk("PS-1069","Hanif Rizki",    "Mujiati",       19,10.8,80, 0.4,56.0,"22 Sep 2023", bNN, iNN),
  mk("PS-1070","Hasna Safira",   "Waginah",       26,11.7,86, 0.6,60.0,"22 Sep 2023", bNN, iNN),
  mk("PS-1071","Ilham Fauzi",    "Rumini",        11, 8.9,73, 0.3,57.5,"21 Sep 2023", bNN, iNN),
  mk("PS-1072","Intan Dewi",     "Saritem",       24,11.5,85, 0.5,61.0,"21 Sep 2023", bNN, iNN),
  mk("PS-1073","Iqbal Perdana",  "Karyati",       33,13.2,91, 0.1,58.5,"20 Sep 2023", bNN, iNN),
  mk("PS-1074","Irfan Hakim",    "Sartini",       18,10.6,79, 0.4,55.5,"20 Sep 2023", bNN, iNN),
  mk("PS-1075","Jihan Aulia",    "Ponijah",       13, 9.5,75, 0.6,59.5,"19 Sep 2023", bNN, iNN),
  mk("PS-1076","Kayla Amira",    "Rupiah",        20,10.9,81, 0.3,62.0,"19 Sep 2023", bNN, iNN),
  mk("PS-1077","Khansa Nabila",  "Tumini",        29,12.4,89, 0.2,57.0,"18 Sep 2023", bNN, iNN),
  mk("PS-1078","Laila Nurdiana", "Sarminah",      16,10.2,78, 0.5,60.0,"18 Sep 2023", bNN, iNN),
  mk("PS-1079","Luthfi Hamdani", "Waginih",       22,11.2,83, 0.4,58.0,"17 Sep 2023", bNN, iNN),
  mk("PS-1080","Mahendra Yudha", "Samsiah",       35,13.5,93, 0.1,56.5,"17 Sep 2023", bNN, iNN),
  mk("PS-1081","Miftah Arif",    "Juriyah",       10, 8.6,72, 0.6,61.5,"16 Sep 2023", bNN, iNN),
  mk("PS-1082","Nabila Husna",   "Katinem",       25,11.6,85, 0.3,59.0,"16 Sep 2023", bNN, iNN),
  mk("PS-1083","Naila Putri",    "Sariyem",        8, 7.7,68, 0.7,62.5,"15 Sep 2023", bNN, iNN),
  mk("PS-1084","Nanda Kusuma",   "Suyatmi",       18,10.7,79, 0.2,57.5,"15 Sep 2023", bNN, iNN),
  mk("PS-1085","Nisa Rahmawati", "Poniyem",       27,12.1,87, 0.5,60.5,"14 Sep 2023", bNN, iNN),
  mk("PS-1086","Pandu Wiguna",   "Sarijem",       14,10.0,76, 0.4,58.0,"14 Sep 2023", bNN, iNN),
  mk("PS-1087","Rafi Ardana",    "Mariyem",       21,11.1,82, 0.3,55.5,"13 Sep 2023", bNN, iNN),
  mk("PS-1088","Rahmat Hidayat", "Painem",        30,12.7,89, 0.1,59.5,"13 Sep 2023", bNN, iNN),
  mk("PS-1089","Raka Arjuna",    "Lastri",        12, 9.4,74, 0.5,61.0,"12 Sep 2023", bNN, iNN),
  mk("PS-1090","Ratna Dewi",     "Suci",          23,11.3,84, 0.6,57.0,"12 Sep 2023", bNN, iNN),
  mk("PS-1091","Reza Maulana",   "Suminah",       16,10.2,78, 0.4,60.0,"11 Sep 2023", bNN, iNN),
  mk("PS-1092","Rizal Firdaus",  "Sopiah",        26,11.8,86, 0.2,58.5,"11 Sep 2023", bNN, iNN),
  mk("PS-1093","Ryan Pratama",   "Rohani",        19,10.7,80, 0.3,56.0,"10 Sep 2023", bNN, iNN),
  mk("PS-1094","Salsabila Nur",  "Tuminah",       11, 8.8,73, 0.5,62.0,"10 Sep 2023", bNN, iNN),
  mk("PS-1095","Shafira Indah",  "Srimulyani",    28,12.2,88, 0.4,59.0,"09 Sep 2023", bNN, iNN),
  mk("PS-1096","Tegar Santoso",  "Sumarni",       15,10.1,77, 0.6,57.5,"09 Sep 2023", bNN, iNN),
  mk("PS-1097","Vira Ananda",    "Rumiati",       24,11.5,85, 0.3,61.5,"08 Sep 2023", bNN, iNN),
  mk("PS-1098","Wahyu Nugroho",  "Sariem",        20,10.8,81, 0.2,58.0,"08 Sep 2023", bNN, iNN),
  mk("PS-1099","Wisnu Aji",      "Satinah",       32,13.1,91, 0.1,55.5,"07 Sep 2023", bNN, iNN),
  mk("PS-1100","Yoga Saputra",   "Giyem",         17,10.4,79, 0.4,60.5,"07 Sep 2023", bNN, iNN),
  mk("PS-1101","Yusuf Ramadhan", "Sukarni",       13, 9.6,75, 0.5,59.0,"06 Sep 2023", bNN, iNN),
  mk("PS-1102","Zaki Mubarak",   "Ngatinah",      22,11.2,83, 0.3,57.0,"06 Sep 2023", bNN, iNN),

  // ── Always-Normal bayi, Malgizi ibu (PS-1103 to PS-1126, 24 pasien) ──────
  // Recover at period 6 (2 patients)
  mk("PS-1103","Alya Ramadhani", "Sunarsih",      16,10.2,78, 0.4,42.0,"05 Sep 2023", bNN, iM6),
  mk("PS-1104","Andini Putri",   "Tugiyem",       24,11.4,84, 0.5,43.5,"05 Sep 2023", bNN, iM6),
  // Recover at period 12 (3 patients)
  mk("PS-1105","Azka Fahri",     "Tasripin",      18,10.6,80, 0.3,44.0,"04 Sep 2023", bNN, iM12),
  mk("PS-1106","Bagas Setiawan", "Sukartini",     29,12.4,88, 0.2,43.0,"04 Sep 2023", bNN, iM12),
  mk("PS-1107","Dani Kurniawan", "Tumisih",       12, 9.2,74, 0.5,42.5,"03 Sep 2023", bNN, iM12),
  // Recover at period 18 (4 patients)
  mk("PS-1108","Elang Saputra",  "Parinem",       20,10.9,81, 0.4,45.0,"03 Sep 2023", bNN, iM18),
  mk("PS-1109","Fadzil Rasyid",  "Suwati",        31,12.8,90, 0.1,44.5,"02 Sep 2023", bNN, iM18),
  mk("PS-1110","Gemilang Arya",  "Supini",        15,10.1,77, 0.6,43.0,"02 Sep 2023", bNN, iM18),
  mk("PS-1111","Hamid Fauzan",   "Marjinah",      25,11.6,86, 0.3,42.0,"01 Sep 2023", bNN, iM18),
  // Recover at period 24 (6 patients)
  mk("PS-1112","Husna Azizah",   "Sroeni",         9, 8.3,70, 0.5,44.0,"01 Sep 2023", bNN, iM24),
  mk("PS-1113","Ibnu Hajar",     "Sumiyati",      22,11.1,83, 0.2,43.5,"31 Agu 2023", bNN, iM24),
  mk("PS-1114","Imam Wahyudi",   "Rupinem",       17,10.4,79, 0.4,42.5,"31 Agu 2023", bNN, iM24),
  mk("PS-1115","Karin Sari",     "Waginah",       28,12.2,87, 0.3,44.0,"30 Agu 2023", bNN, iM24),
  mk("PS-1116","Kemal Ardiyan",  "Murtiasih",     14,10.0,76, 0.5,43.0,"30 Agu 2023", bNN, iM24),
  mk("PS-1117","Khansa Fadilla", "Suminih",       23,11.3,84, 0.2,42.0,"29 Agu 2023", bNN, iM24),
  // Recover at period 30 (5 patients)
  mk("PS-1118","Lana Syifa",     "Ngatinem",      19,10.7,80, 0.3,45.0,"29 Agu 2023", bNN, iM30),
  mk("PS-1119","Laras Ayu",      "Ponijem",       26,11.7,86, 0.4,44.5,"28 Agu 2023", bNN, iM30),
  mk("PS-1120","Latifa Zahra",   "Saryati",       11, 8.8,72, 0.6,43.0,"28 Agu 2023", bNN, iM30),
  mk("PS-1121","Layla Amira",    "Darminah",      33,13.2,91, 0.1,42.5,"27 Agu 2023", bNN, iM30),
  mk("PS-1122","Muhammad Rafi",  "Tukiyem",       18,10.5,79, 0.4,44.0,"27 Agu 2023", bNN, iM30),
  // Recover at period 36 (4 patients)
  mk("PS-1123","Noval Ardianto", "Supiyem",       24,11.5,85, 0.2,43.5,"26 Agu 2023", bNN, iM36),
  mk("PS-1124","Pandu Setiawan", "Tumini",        16,10.2,78, 0.5,42.0,"26 Agu 2023", bNN, iM36),
  mk("PS-1125","Qonita Amalia",  "Ngatini",       29,12.4,89, 0.3,44.5,"25 Agu 2023", bNN, iM36),
  mk("PS-1126","Rendra Wijaya",  "Sariyatun",     13, 9.5,75, 0.4,43.0,"25 Agu 2023", bNN, iM36),

  // ── Terindikasi → Normal (PS-1127 to PS-1162, 36 pasien) ─────────────────
  // Recover at period 6 (14 patients)
  mk("PS-1127","Reza Hadianto",  "Suryani",       18,10.3,78,-1.2,55.0,"24 Agu 2023", bT_M3, iNN),
  mk("PS-1128","Rizal Saputra",  "Rumini",        24,11.0,83,-1.4,57.5,"24 Agu 2023", bT_M4, iNN),
  mk("PS-1129","Ryan Santoso",   "Tarsih",        12, 9.0,73,-1.1,56.0,"23 Agu 2023", bT_M4, iNN),
  mk("PS-1130","Sabil Fikri",    "Ponijah",       30,12.3,88,-1.3,58.0,"23 Agu 2023", bT_M4, iNN),
  mk("PS-1131","Sakti Nugroho",  "Lasmi",         20,10.6,80,-1.5,55.5,"22 Agu 2023", bT_M4, iNN),
  mk("PS-1132","Shafira Rahma",  "Srimulyati",    16,10.0,77,-1.2,57.0,"22 Agu 2023", bT_M4, iNN),
  mk("PS-1133","Sofi Azzahra",   "Pariyem",       26,11.6,86,-1.4,56.5,"21 Agu 2023", bT_M4, iNN),
  mk("PS-1134","Surya Andika",   "Wartini",       14, 9.7,76,-1.3,58.5,"21 Agu 2023", bT_M4, iNN),
  mk("PS-1135","Syahril Arif",   "Rukmini",       22,11.1,82,-1.1,55.0,"20 Agu 2023", bT_M4, iNN),
  mk("PS-1136","Tegar Wibowo",   "Suparni",       28,12.0,87,-1.5,57.5,"20 Agu 2023", bT_M4, iNN),
  mk("PS-1137","Tifani Putri",   "Katini",        10, 8.6,71,-1.2,59.0,"19 Agu 2023", bT_M4, iNN),
  mk("PS-1138","Tito Prasetya",  "Suminih",       32,12.8,90,-1.4,56.0,"19 Agu 2023", bT_M4, iNN),
  mk("PS-1139","Ulfa Salsabila", "Ngatini",        8, 7.8,68,-1.3,58.0,"18 Agu 2023", bT_M4, iNN),
  mk("PS-1140","Vino Saputra",   "Saritem",       19,10.5,80,-1.1,57.0,"18 Agu 2023", bT_M4, iNN),
  // Recover at period 12 (7 patients)
  mk("PS-1141","Wahyu Pramono",  "Suginem",       25,11.5,85,-1.6,55.5,"17 Agu 2023", bT_M4, iNN),
  mk("PS-1142","Wendi Kusuma",   "Sarminah",      15,10.0,77,-1.8,57.0,"17 Agu 2023", bT_M4, iNN),
  mk("PS-1143","Wisnu Santoso",  "Tumisih",       21,10.8,82,-1.5,56.0,"16 Agu 2023", bT_M5, iNN),
  mk("PS-1144","Yoga Pratama",   "Wainem",        33,13.0,91,-1.7,58.5,"16 Agu 2023", bT_M5, iNN),
  mk("PS-1145","Yogi Firmansyah","Sarinem",       17,10.2,78,-1.6,55.0,"15 Agu 2023", bT_M5, iNN),
  mk("PS-1146","Yudha Putra",    "Karyati",       28,12.1,87,-1.8,57.5,"15 Agu 2023", bT_M5, iNN),
  mk("PS-1147","Zulfa Amani",    "Sukirah",       12, 9.1,73,-1.5,56.5,"14 Agu 2023", bT_M5, iNN),
  // Recover at period 18 (10 patients)
  mk("PS-1148","Akbar Maulana",  "Parini",        20,10.7,80,-1.9,55.0,"14 Agu 2023", bT_M5, iNN),
  mk("PS-1149","Andika Wirawan", "Sukemi",        27,11.9,87,-1.7,57.0,"13 Agu 2023", bT_M5, iNN),
  mk("PS-1150","Arya Bimantara", "Sukarti",       14, 9.7,76,-1.8,56.5,"13 Agu 2023", bT_M5, iNN),
  mk("PS-1151","Aziz Hamdani",   "Tuminah",       23,11.2,84,-1.6,58.0,"12 Agu 2023", bT_M5, iNN),
  mk("PS-1152","Dafa Ramadhan",  "Warsini",        9, 8.4,70,-1.9,55.5,"12 Agu 2023", bT_M5, iNN),
  mk("PS-1153","Deva Arjuna",    "Suratmi",       31,12.6,90,-1.7,57.5,"11 Agu 2023", bT_M5, iNN),
  mk("PS-1154","Diko Prasetyo",  "Sarinem",       18,10.4,79,-1.8,56.0,"11 Agu 2023", bT_M5, iNN),
  mk("PS-1155","Edwin Saputra",  "Ngatinem",      25,11.5,85,-1.6,58.5,"10 Agu 2023", bT_M5, iNN),
  mk("PS-1156","Feri Ardana",    "Pariyem",       13, 9.4,75,-1.9,55.0,"10 Agu 2023", bT_M5, iNN),
  mk("PS-1157","Gunawan Aji",    "Wartinah",      29,12.2,88,-1.7,57.0,"09 Agu 2023", bT_M5, iNN),
  // Recover at period 24 (5 patients)
  mk("PS-1158","Hasan Wibowo",   "Rubiyem",       22,11.0,82,-1.9,56.5,"09 Agu 2023", bT_M5, iNN),
  mk("PS-1159","Ivan Kurniawan", "Sukirem",       16,10.1,78,-1.8,58.0,"08 Agu 2023", bT_M5, iNN),
  mk("PS-1160","Jefri Santoso",  "Ngatinah",      33,13.1,91,-1.7,55.5,"08 Agu 2023", bT_M5, iNN),
  mk("PS-1161","Kevin Aditya",   "Sarijem",       11, 8.7,72,-1.9,57.5,"07 Agu 2023", bT_M5, iNN),
  mk("PS-1162","Luki Prasetyo",  "Wainem",        26,11.6,86,-1.8,56.0,"07 Agu 2023", bT_M5, iNN),

  // ── Stunting (PS-1163 to PS-1178, 16 pasien) ────────────────────────────
  // [S,T,N,...] recover Normal at period 12 (4 patients)
  mk("PS-1163","Mario Andika",   "Sarwati",       24,10.4,81,-2.1,55.0,"06 Agu 2023", bS12, iNN),
  mk("PS-1164","Nanang Prianto", "Sumiasih",      36,13.5,92,-2.3,57.0,"06 Agu 2023", bS12, iNN),
  mk("PS-1165","Noval Wijaya",   "Karmini",       18,10.0,78,-2.2,56.5,"05 Agu 2023", bS12, iNN),
  mk("PS-1166","Okta Ramadhan",  "Sarinem",       30,12.5,89,-2.4,58.0,"05 Agu 2023", bS12, iNN),
  // [S,S,T,...] recover Normal at period 18 (4 patients)
  mk("PS-1167","Pandu Wijaya",   "Rusmini",       24,10.3,80,-2.5,55.5,"04 Agu 2023", bS18, iNN),
  mk("PS-1168","Riko Saputra",   "Sumarni",       36,13.2,91,-2.6,57.5,"04 Agu 2023", bS18, iNN),
  mk("PS-1169","Sandy Pratama",  "Ngatinem",      18, 9.8,77,-2.3,56.0,"03 Agu 2023", bS18, iNN),
  mk("PS-1170","Teguh Santoso",  "Sriati",        30,12.4,88,-2.5,58.5,"03 Agu 2023", bS18, iNN),
  // [S,S,S,T,...] recover Normal at period 24 (4 patients)
  mk("PS-1171","Umar Hakim",     "Partinah",      24,10.2,80,-2.7,55.0,"02 Agu 2023", bS24, iNN),
  mk("PS-1172","Yogi Wahyudi",   "Sariyem",       36,13.0,90,-2.8,57.0,"02 Agu 2023", bS24, iNN),
  mk("PS-1173","Zaki Ramadhan",  "Waginah",       18, 9.7,76,-2.6,56.5,"01 Agu 2023", bS24, iNN),
  mk("PS-1174","Aldi Saputra",   "Darminah",      30,12.3,88,-2.9,58.0,"01 Agu 2023", bS24, iNN),
  // [S,S,S,S,T,N,N] recover Normal at period 30 (2 patients)
  mk("PS-1175","Budi Santosa",   "Rusmiyati",     24,10.1,79,-3.0,55.5,"31 Jul 2023", bS30, iNN),
  mk("PS-1176","Candra Putra",   "Suparni",       36,12.9,89,-2.9,57.5,"31 Jul 2023", bS30, iNN),
  // [S,S,S,S,S,T,N] recover Normal at period 36 (2 patients)
  mk("PS-1177","Dani Firmansyah","Katinem",       24,10.0,78,-3.1,55.0,"30 Jul 2023", bS36, iNN),
  mk("PS-1178","Eko Prasetyo",   "Suratmi",       36,12.7,88,-3.2,56.5,"30 Jul 2023", bS36, iNN),
];

export function getStatusAt(p: Pasien, bulanKe: number): StatusGizi {
  return p.statusByPeriod[PERIOD_IDX[bulanKe] ?? 0];
}

export function getStatusIbuAt(p: Pasien, bulanKe: number): StatusGiziIbu {
  return p.statusIbuByPeriod[PERIOD_IDX[bulanKe] ?? 0];
}

export default dummyDataPasien;
