import { Customer, WifiPackage, Invoice, BusinessProfile, WhatsAppTemplate } from '../types';

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatTanggalIndo = (dateStr?: string): string => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
};

export const formatPeriodeIndo = (periodStr: string): string => {
  // periodStr: 'YYYY-MM'
  if (!periodStr) return '';
  const [year, month] = periodStr.split('-');
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const mIndex = parseInt(month, 10) - 1;
  if (mIndex >= 0 && mIndex < 12) {
    return `${months[mIndex]} ${year}`;
  }
  return periodStr;
};

export const cleanPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  // Remove non-numeric characters except +
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
};

export const buildWhatsAppUrl = (phone: string, text: string): string => {
  const normalizedPhone = cleanPhoneNumber(phone);
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${normalizedPhone}?text=${encodedText}`;
};

export const renderWhatsAppMessage = (
  templateContent: string,
  invoice: Invoice,
  customer: Customer,
  pkg?: WifiPackage,
  profile?: BusinessProfile
): string => {
  const bankDetails = profile?.bankAccounts
    ? profile.bankAccounts.map(b => `• ${b.bankName}: ${b.accountNumber} (a.n ${b.accountHolder})`).join('\n')
    : 'BCA: 123-456-7890 a.n MitraNet';

  const packageName = pkg ? `${pkg.name} (${pkg.speedMbps} Mbps)` : 'Paket Internet WiFi';

  let message = templateContent
    .replace(/{NAMA}/g, customer.name)
    .replace(/{ID_PELANGGAN}/g, customer.customerCode)
    .replace(/{NO_INVOICE}/g, invoice.invoiceNumber)
    .replace(/{PAKET}/g, packageName)
    .replace(/{PERIODE}/g, invoice.periodLabel || formatPeriodeIndo(invoice.period))
    .replace(/{TAGIHAN}/g, formatRupiah(invoice.totalAmount))
    .replace(/{JATUH_TEMPO}/g, formatTanggalIndo(invoice.dueDate))
    .replace(/{TANGGAL_BAYAR}/g, invoice.paymentDate ? formatTanggalIndo(invoice.paymentDate) : '-')
    .replace(/{METODE_BAYAR}/g, invoice.paymentMethod || 'Transfer Bank / Cash')
    .replace(/{REKENING}/g, bankDetails)
    .replace(/{NAMA_ISP}/g, profile?.companyName || 'MitraNet WiFi')
    .replace(/{NO_CS}/g, profile?.phone || '0812-3456-7890');

  return message;
};
