export type CustomerStatus = 'aktif' | 'isolir' | 'suspend' | 'nonaktif';
export type InvoiceStatus = 'belum_lunas' | 'lunas' | 'jatuh_tempo' | 'isolir';
export type PaymentMethod = 'Cash' | 'Transfer BCA' | 'Transfer BRI' | 'Transfer Mandiri' | 'QRIS' | 'E-Wallet';

export interface Customer {
  id: string;
  customerCode: string; // e.g. CUST-0101
  name: string;
  phone: string; // e.g. 081234567890
  address: string;
  cluster: string; // e.g. RT 03/RW 04 Blok Dahlia
  packageId: string;
  ipAddress?: string;
  pppoeUsername?: string;
  installedDate: string;
  dueDateDay: number; // e.g. 10 (tanggal 10 tiap bulan)
  status: CustomerStatus;
  notes?: string;
}

export interface WifiPackage {
  id: string;
  name: string;
  speedMbps: number;
  price: number;
  fupGb?: number; // 0 for unlimited
  description: string;
  badgeColor?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. INV/202610/WIFI-101
  customerId: string;
  period: string; // YYYY-MM
  periodLabel: string; // e.g. Oktober 2026
  issueDate: string;
  dueDate: string;
  baseAmount: number;
  discount: number;
  adminFee: number;
  totalAmount: number;
  status: InvoiceStatus;
  paymentDate?: string;
  paymentMethod?: PaymentMethod;
  paymentCollector?: string;
  receiptNumber?: string;
  notes?: string;
  waSentAt?: string;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface BusinessProfile {
  companyName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  bankAccounts: BankAccount[];
  qrisImageUrl: string;
  logoUrl: string;
  defaultAdminFee: number;
  terms: string;
}

export interface WhatsAppTemplate {
  id: string;
  type: 'tagihan_baru' | 'pengingat_tempo' | 'kwitansi_lunas' | 'peringatan_isolir';
  title: string;
  content: string;
}

export type PrintFormat = 'a4' | 'thermal_58' | 'thermal_80';
