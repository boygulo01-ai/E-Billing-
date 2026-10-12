import { Customer, WifiPackage, Invoice, BusinessProfile, WhatsAppTemplate } from '../types';

export const INITIAL_PACKAGES: WifiPackage[] = [
  {
    id: 'pkg-1',
    name: 'Home Lite 10 Mbps',
    speedMbps: 10,
    price: 150000,
    fupGb: 0,
    description: 'Cocok untuk browsing santai, sosial media, dan chat keluarga.',
    badgeColor: 'sky',
  },
  {
    id: 'pkg-2',
    name: 'Family Fast 20 Mbps',
    speedMbps: 20,
    price: 220000,
    fupGb: 0,
    description: 'Paling favorit! Ideal streaming HD YouTube/Netflix 3-5 perangkat lancar.',
    badgeColor: 'emerald',
  },
  {
    id: 'pkg-3',
    name: 'Ultra Stream 35 Mbps',
    speedMbps: 35,
    price: 320000,
    fupGb: 0,
    description: 'Stabil untuk WFH Zoom meeting tanpa putus, streaming 4K & CCTV.',
    badgeColor: 'indigo',
  },
  {
    id: 'pkg-4',
    name: 'Pro Gamer 50 Mbps',
    speedMbps: 50,
    price: 450000,
    fupGb: 0,
    description: 'Low latency ping minimal untuk Mobile Legends, Valorant & download cepat.',
    badgeColor: 'violet',
  },
  {
    id: 'pkg-5',
    name: 'Bisnis Speed 100 Mbps',
    speedMbps: 100,
    price: 750000,
    fupGb: 0,
    description: 'Koneksi dedicated untuk kantor, ruko, kafe, dan studio konten.',
    badgeColor: 'amber',
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    customerCode: 'CUST-101',
    name: 'Budi Santoso',
    phone: '081234567890',
    address: 'Jl. Merpati No. 14, RT 01 / RW 04',
    cluster: 'Cluster Mawar (ODP-MWR-02)',
    packageId: 'pkg-2',
    ipAddress: '192.168.10.15',
    pppoeUsername: 'budi_mwr01',
    installedDate: '2025-02-10',
    dueDateDay: 10,
    status: 'aktif',
    notes: 'Kabel dropcore 85m, ONT Huawei HG8245H5',
  },
  {
    id: 'cust-2',
    customerCode: 'CUST-102',
    name: 'Siti Rahmawati',
    phone: '081398765432',
    address: 'Komplek Permata Indah Blok B2 No. 8',
    cluster: 'Cluster Permata (ODP-PRM-01)',
    packageId: 'pkg-3',
    ipAddress: '192.168.10.18',
    pppoeUsername: 'siti_prm08',
    installedDate: '2025-03-01',
    dueDateDay: 10,
    status: 'aktif',
    notes: 'ONT ZTE F609',
  },
  {
    id: 'cust-3',
    customerCode: 'CUST-103',
    name: 'Hendra Wijaya (Warung Kopi Mas Hendra)',
    phone: '081912348899',
    address: 'Jl. Kenanga Raya No. 45',
    cluster: 'Komersil Ruko Barat (ODP-RK-04)',
    packageId: 'pkg-5',
    ipAddress: '192.168.10.22',
    pppoeUsername: 'hendra_ruko45',
    installedDate: '2025-01-15',
    dueDateDay: 10,
    status: 'aktif',
    notes: 'Access Point outdoor Ruijie Reyee',
  },
  {
    id: 'cust-4',
    customerCode: 'CUST-104',
    name: 'Dian Kusuma',
    phone: '085712399881',
    address: 'Jl. Melati RT 03 / RW 02 No. 12',
    cluster: 'Cluster Melati (ODP-MLT-03)',
    packageId: 'pkg-1',
    ipAddress: '192.168.10.29',
    pppoeUsername: 'dian_mlt12',
    installedDate: '2025-05-20',
    dueDateDay: 10,
    status: 'aktif',
    notes: 'Pelanggan minta bayar via transfer Mandiri',
  },
  {
    id: 'cust-5',
    customerCode: 'CUST-105',
    name: 'Eko Prasetyo',
    phone: '082188776655',
    address: 'Jl. Anggrek No. 8A, RT 02 / RW 05',
    cluster: 'Cluster Anggrek (ODP-AGR-01)',
    packageId: 'pkg-4',
    ipAddress: '192.168.10.35',
    pppoeUsername: 'eko_agr08',
    installedDate: '2025-04-12',
    dueDateDay: 10,
    status: 'aktif',
    notes: 'Streamer game, router dual-band',
  },
  {
    id: 'cust-6',
    customerCode: 'CUST-106',
    name: 'Rina Marlina',
    phone: '087833445566',
    address: 'Gang Kelinci II No. 19, RT 04 / RW 01',
    cluster: 'Cluster Melati (ODP-MLT-01)',
    packageId: 'pkg-2',
    ipAddress: '192.168.10.42',
    pppoeUsername: 'rina_gk19',
    installedDate: '2025-06-05',
    dueDateDay: 10,
    status: 'aktif',
    notes: 'Sering minta struk print fisik',
  },
  {
    id: 'cust-7',
    customerCode: 'CUST-107',
    name: 'Agus Setiawan',
    phone: '081299887711',
    address: 'Jl. Pahlawan No. 5B',
    cluster: 'Cluster Permata (ODP-PRM-03)',
    packageId: 'pkg-2',
    ipAddress: '192.168.10.51',
    pppoeUsername: 'agus_phl05',
    installedDate: '2025-07-01',
    dueDateDay: 10,
    status: 'isolir',
    notes: 'Menunggak 2 bulan berturut-turut, port di-disable sementara',
  },
  {
    id: 'cust-8',
    customerCode: 'CUST-108',
    name: 'Dewi Lestari',
    phone: '085211223344',
    address: 'Perum Gading Asri Blok C No. 22',
    cluster: 'Cluster Gading (ODP-GDG-02)',
    packageId: 'pkg-3',
    ipAddress: '192.168.10.58',
    pppoeUsername: 'dewi_gdg22',
    installedDate: '2025-08-14',
    dueDateDay: 10,
    status: 'aktif',
    notes: 'Pembayaran rutin via QRIS',
  },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV/202610/WIFI-101',
    customerId: 'cust-1',
    period: '2026-10',
    periodLabel: 'Oktober 2026',
    issueDate: '2026-10-01',
    dueDate: '2026-10-10',
    baseAmount: 220000,
    discount: 0,
    adminFee: 2500,
    totalAmount: 222500,
    status: 'lunas',
    paymentDate: '2026-10-05',
    paymentMethod: 'Transfer BCA',
    paymentCollector: 'Admin Kasir MitraNet',
    receiptNumber: 'KW/202610/0042',
    notes: 'Pembayaran terverifikasi m-Banking',
    waSentAt: '2026-10-05T09:30:00Z',
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV/202610/WIFI-102',
    customerId: 'cust-2',
    period: '2026-10',
    periodLabel: 'Oktober 2026',
    issueDate: '2026-10-01',
    dueDate: '2026-10-10',
    baseAmount: 320000,
    discount: 0,
    adminFee: 2500,
    totalAmount: 322500,
    status: 'lunas',
    paymentDate: '2026-10-08',
    paymentMethod: 'QRIS',
    paymentCollector: 'Gateway QRIS Otomatis',
    receiptNumber: 'KW/202610/0078',
    notes: 'Scan QRIS Dana',
    waSentAt: '2026-10-08T14:15:00Z',
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV/202610/WIFI-103',
    customerId: 'cust-3',
    period: '2026-10',
    periodLabel: 'Oktober 2026',
    issueDate: '2026-10-01',
    dueDate: '2026-10-10',
    baseAmount: 750000,
    discount: 25000,
    adminFee: 2500,
    totalAmount: 727500,
    status: 'belum_lunas',
    notes: 'Diskon loyalitas pelanggan bisnis Rp 25.000',
  },
  {
    id: 'inv-4',
    invoiceNumber: 'INV/202610/WIFI-104',
    customerId: 'cust-4',
    period: '2026-10',
    periodLabel: 'Oktober 2026',
    issueDate: '2026-10-01',
    dueDate: '2026-10-10',
    baseAmount: 150000,
    discount: 0,
    adminFee: 2500,
    totalAmount: 152500,
    status: 'jatuh_tempo',
    notes: 'Sudah lewat batas jatuh tempo tgl 10',
    waSentAt: '2026-10-09T08:00:00Z',
  },
  {
    id: 'inv-5',
    invoiceNumber: 'INV/202610/WIFI-105',
    customerId: 'cust-5',
    period: '2026-10',
    periodLabel: 'Oktober 2026',
    issueDate: '2026-10-01',
    dueDate: '2026-10-10',
    baseAmount: 450000,
    discount: 0,
    adminFee: 2500,
    totalAmount: 452500,
    status: 'belum_lunas',
  },
  {
    id: 'inv-6',
    invoiceNumber: 'INV/202610/WIFI-106',
    customerId: 'cust-6',
    period: '2026-10',
    periodLabel: 'Oktober 2026',
    issueDate: '2026-10-01',
    dueDate: '2026-10-10',
    baseAmount: 220000,
    discount: 0,
    adminFee: 2500,
    totalAmount: 222500,
    status: 'lunas',
    paymentDate: '2026-10-10',
    paymentMethod: 'Cash',
    paymentCollector: 'Kolektor Lapangan (Rudi)',
    receiptNumber: 'KW/202610/0112',
    notes: 'Bayar tunai di lokasi',
    waSentAt: '2026-10-10T16:00:00Z',
  },
  {
    id: 'inv-7',
    invoiceNumber: 'INV/202610/WIFI-107',
    customerId: 'cust-7',
    period: '2026-10',
    periodLabel: 'Oktober 2026',
    issueDate: '2026-10-01',
    dueDate: '2026-10-10',
    baseAmount: 220000,
    discount: 0,
    adminFee: 2500,
    totalAmount: 222500,
    status: 'isolir',
    notes: 'Status jaringan dinonaktifkan sementara',
  },
  {
    id: 'inv-8',
    invoiceNumber: 'INV/202610/WIFI-108',
    customerId: 'cust-8',
    period: '2026-10',
    periodLabel: 'Oktober 2026',
    issueDate: '2026-10-01',
    dueDate: '2026-10-10',
    baseAmount: 320000,
    discount: 0,
    adminFee: 2500,
    totalAmount: 322500,
    status: 'belum_lunas',
  },
];

export const INITIAL_BUSINESS_PROFILE: BusinessProfile = {
  companyName: 'MitraNet Fiber & WiFi Solution',
  tagline: 'Layanan Internet Cepat, Stabil & Tanpa Batas Kuota',
  phone: '0812-9889-7722',
  email: 'billing@mitranet.id',
  address: 'Jl. Merdeka Barat No. 88, Cibinong, Bogor, Jawa Barat 16911',
  website: 'https://mitranet.id',
  bankAccounts: [
    {
      bankName: 'Bank Central Asia (BCA)',
      accountNumber: '8830-192-881',
      accountHolder: 'MITRA NET SOLUSINDO',
    },
    {
      bankName: 'Bank Rakyat Indonesia (BRI)',
      accountNumber: '0129-01-002891-50-8',
      accountHolder: 'MITRA NET SOLUSINDO',
    },
    {
      bankName: 'Bank Mandiri',
      accountNumber: '133-00-9821731-9',
      accountHolder: 'MITRA NET SOLUSINDO',
    },
  ],
  qrisImageUrl: '/src/assets/images/qris_payment_code_1791776401775.jpg',
  logoUrl: '/src/assets/images/wifi_billing_brand_logo_1791776381010.jpg',
  defaultAdminFee: 2500,
  terms: 'Pembayaran tagihan paling lambat tanggal 10 setiap bulannya. Keterlambatan lebih dari tanggal 15 dapat mengakibatkan pemutusan/isolir jaringan otomatis oleh sistem.',
};

export const INITIAL_WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'tpl-1',
    type: 'tagihan_baru',
    title: 'Pemberitahuan Tagihan Baru (Invoice Terbit)',
    content: `*PEMBERITAHUAN TAGIHAN INTERNET WIFI*
----------------------------------------
Yth. Bpk/Ibu *{NAMA}*
ID Pelanggan: *{ID_PELANGGAN}*

Berikut kami sampaikan rincian tagihan internet WiFi Anda:
📄 No. Invoice: *{NO_INVOICE}*
📦 Paket: *{PAKET}*
📅 Periode: *{PERIODE}*
💰 Total Tagihan: *{TAGIHAN}*
⏰ Batas Jatuh Tempo: *{JATUH_TEMPO}*

*Metode Pembayaran:*
Silakan melakukan transfer ke rekening resmi:
{REKENING}
Atau scan QRIS resmi kami.

Mohon konfirmasikan bukti transfer jika sudah melakukan pembayaran. Terima kasih atas kerja samanya. 🙏

Salam hangat,
*{NAMA_ISP}*
CS: {NO_CS}`,
  },
  {
    id: 'tpl-2',
    type: 'pengingat_tempo',
    title: 'Pengingat Jatuh Tempo (H-1 / Overdue)',
    content: `*PENGINGAT JATUH TEMPO PEMBAYARAN WIFI*
----------------------------------------
Halo Bpk/Ibu *{NAMA}* ({ID_PELANGGAN}),

Kami menginformasikan bahwa tagihan WiFi Anda untuk periode *{PERIODE}* sebesar *{TAGIHAN}* telah mendekati / melewati batas jatuh tempo (*{JATUH_TEMPO}*).

Agar koneksi internet di rumah/lokasi Anda tetap aktif dan tidak mengalami penurunan kecepatan atau isolir otomatis, mohon segera melakukan pembayaran melalui:
{REKENING}

Abaikan pesan ini apabila Anda telah melakukan pembayaran dalam 1x24 jam terakhir. Terima kasih banyak.

Hormat kami,
*{NAMA_ISP}*
Hubungi kami: {NO_CS}`,
  },
  {
    id: 'tpl-3',
    type: 'kwitansi_lunas',
    title: 'Kwitansi / Tanda Terima Pembayaran Lunas',
    content: `*BUKTI PEMBAYARAN INTERNET WIFI (LUNAS)*
----------------------------------------
Yth. Bpk/Ibu *{NAMA}*
ID Pelanggan: *{ID_PELANGGAN}*

Terima kasih! Pembayaran internet WiFi Anda telah berhasil kami terima & diverifikasi dengan rincian sbb:

✅ Status: *LUNAS*
📄 No. Invoice: *{NO_INVOICE}*
📅 Periode: *{PERIODE}*
📦 Paket: *{PAKET}*
💵 Jumlah Dibayar: *{TAGIHAN}*
🗓️ Tanggal Bayar: *{TANGGAL_BAYAR}*
💳 Metode: *{METODE_BAYAR}*

Koneksi internet Anda aktif dan dapat dinikmati dengan lancar tanpa gangguan kuota. Terima kasih atas kepercayaan Anda menjadi pelanggan setia *{NAMA_ISP}*.

Salam hangat,
Tim Billing *{NAMA_ISP}*`,
  },
  {
    id: 'tpl-4',
    type: 'peringatan_isolir',
    title: 'Peringatan Pemutusan / Isolir Jaringan',
    content: `*PERINGATAN ISOLIR SEMENTARA JARINGAN WIFI*
----------------------------------------
Yth. Bpk/Ibu *{NAMA}*
ID Pelanggan: *{ID_PELANGGAN}*

Kami memberitahukan bahwa tagihan WiFi Anda untuk periode *{PERIODE}* dengan total *{TAGIHAN}* belum tercatat pembayarannya dan telah melewati toleransi jatuh tempo (*{JATUH_TEMPO}*).

Sistem secara otomatis akan melakukan *ISOLIR / PEMUTUSAN SEMENTARA* pada akses internet Anda.

Untuk mengaktifkan kembali koneksi dalam waktu 5-15 menit, silakan segera selesaikan pembayaran ke:
{REKENING}

Setelah transfer, mohon kirimkan foto/screenshot bukti pembayaran ke nomor ini.

Terima kasih,
Billing Support *{NAMA_ISP}*
Hotline: {NO_CS}`,
  },
];
