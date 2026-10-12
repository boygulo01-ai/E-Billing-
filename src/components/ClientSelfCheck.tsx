import React, { useState } from 'react';
import { Customer, WifiPackage, Invoice, BusinessProfile } from '../types';
import { formatRupiah, formatTanggalIndo, buildWhatsAppUrl } from '../utils/formatters';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Ban,
  Clock,
  Printer,
  MessageCircle,
  Wifi,
  Copy,
  Check,
} from 'lucide-react';

interface ClientSelfCheckProps {
  customers: Customer[];
  packages: WifiPackage[];
  invoices: Invoice[];
  profile: BusinessProfile;
  onTriggerPrint: (invoice: Invoice) => void;
}

export const ClientSelfCheck: React.FC<ClientSelfCheckProps> = ({
  customers,
  packages,
  invoices,
  profile,
  onTriggerPrint,
}) => {
  const [searchInput, setSearchInput] = useState('CUST-104');
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  // Search logic
  const foundCustomer = customers.find((c) => {
    const q = searchInput.trim().toLowerCase();
    return (
      c.customerCode.toLowerCase() === q ||
      c.phone.replace(/[^0-9]/g, '') === q.replace(/[^0-9]/g, '') ||
      c.name.toLowerCase().includes(q)
    );
  });

  const customerInvoices = foundCustomer
    ? invoices.filter((i) => i.customerId === foundCustomer.id)
    : [];

  // Sort invoices: unpaid first, then by date descending
  const sortedInvoices = [...customerInvoices].sort((a, b) => {
    if (a.status !== 'lunas' && b.status === 'lunas') return -1;
    if (a.status === 'lunas' && b.status !== 'lunas') return 1;
    return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
  });

  const activePkg = foundCustomer
    ? packages.find((p) => p.id === foundCustomer.packageId)
    : null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(id);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  const handleConfirmPaymentViaWA = (inv: Invoice) => {
    if (!foundCustomer) return;
    const msg = `Halo Admin ${profile.companyName},\nSaya ingin konfirmasi pembayaran tagihan WiFi:\n• Nama: ${foundCustomer.name}\n• ID: ${foundCustomer.customerCode}\n• No Invoice: ${inv.invoiceNumber}\n• Periode: ${inv.periodLabel}\n• Jumlah: ${formatRupiah(inv.totalAmount)}\n\nTerlampir bukti transfer saya. Mohon verifikasinya, terima kasih.`;
    const url = buildWhatsAppUrl(profile.phone, msg);
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro banner */}
      <div className="bg-gradient-to-r from-slate-900 to-cyan-950 text-white p-6 rounded-2xl shadow-sm">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 text-xs font-semibold">
            <Wifi className="w-3.5 h-3.5" />
            <span>Portal Cek Tagihan Mandiri Pelanggan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Periksa Tagihan & Konfirmasi Pembayaran WiFi Anda
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Masukkan Nomor ID Pelanggan (misal: <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300">CUST-104</code>) atau Nomor WhatsApp yang terdaftar untuk melihat rincian faktur dan cara pembayaran.
          </p>
        </div>

        {/* Search bar */}
        <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Masukkan ID Pelanggan (CUST-101) atau No HP..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-xs"
            />
          </div>
        </div>

        {/* Quick chip demo shortcuts */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <span className="text-slate-400 text-[11px]">Coba Pelanggan Contoh:</span>
          <button
            onClick={() => setSearchInput('CUST-101')}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-cyan-300 font-mono text-[11px] cursor-pointer"
          >
            CUST-101 (Lunas)
          </button>
          <button
            onClick={() => setSearchInput('CUST-104')}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-amber-300 font-mono text-[11px] cursor-pointer"
          >
            CUST-104 (Jatuh Tempo)
          </button>
          <button
            onClick={() => setSearchInput('CUST-107')}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-rose-300 font-mono text-[11px] cursor-pointer"
          >
            CUST-107 (Isolir)
          </button>
        </div>
      </div>

      {/* Result Display */}
      {foundCustomer ? (
        <div className="space-y-6">
          {/* Customer profile card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-600/10 text-cyan-700 flex items-center justify-center font-bold text-lg">
                  {foundCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {foundCustomer.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                    <span className="font-semibold text-slate-700">{foundCustomer.customerCode}</span>
                    <span>·</span>
                    <span>{foundCustomer.phone}</span>
                  </div>
                </div>
              </div>

              {/* Status Connection badge */}
              <div>
                {foundCustomer.status === 'aktif' && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Layanan Internet Aktif</span>
                  </div>
                )}
                {foundCustomer.status === 'isolir' && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    <Ban className="w-4 h-4 text-rose-600" />
                    <span>Status Terisolir (Menunggak)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sub-info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Paket Berlangganan</span>
                <span className="font-semibold text-slate-900">{activePkg?.name || 'Paket WiFi'}</span>
                <span className="text-slate-500 font-mono block">{activePkg?.speedMbps} Mbps</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Tarif Bulanan</span>
                <span className="font-bold text-cyan-700 font-mono">
                  {activePkg ? formatRupiah(activePkg.price) : '-'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Jatuh Tempo</span>
                <span className="font-semibold text-slate-900">Tanggal {foundCustomer.dueDateDay}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Wilayah Jaringan</span>
                <span className="text-slate-800">{foundCustomer.cluster}</span>
              </div>
            </div>
          </div>

          {/* Invoices List for this customer */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">
              Daftar Faktur & Riwayat Tagihan ({sortedInvoices.length})
            </h4>

            {sortedInvoices.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
                Belum ada riwayat tagihan untuk pelanggan ini.
              </div>
            ) : (
              sortedInvoices.map((inv) => {
                const isPaid = inv.status === 'lunas';

                return (
                  <div
                    key={inv.id}
                    className={`bg-white rounded-xl border p-5 transition-all shadow-xs ${
                      isPaid
                        ? 'border-slate-200/90'
                        : inv.status === 'jatuh_tempo' || inv.status === 'isolir'
                        ? 'border-amber-300 bg-amber-50/20'
                        : 'border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            {inv.invoiceNumber}
                          </span>
                          <span className="text-xs text-slate-500">· Periode {inv.periodLabel}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Batas Jatuh Tempo: <span className="font-medium text-slate-800">{formatTanggalIndo(inv.dueDate)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[11px] text-slate-500 block">Total Tagihan:</span>
                          <span className="text-lg font-bold font-mono text-cyan-800 tabular-nums">
                            {formatRupiah(inv.totalAmount)}
                          </span>
                        </div>

                        {/* Status badge */}
                        <div>
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>LUNAS</span>
                            </span>
                          ) : inv.status === 'jatuh_tempo' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              <span>JATUH TEMPO</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              <span>BELUM LUNAS</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions and payment options if unpaid */}
                    <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        {isPaid ? (
                          <div className="text-xs text-emerald-700 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>
                              Terbayar pada {formatTanggalIndo(inv.paymentDate)} via {inv.paymentMethod}
                            </span>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-600">
                            Silakan lakukan transfer atau scan QRIS di bawah ini, lalu konfirmasi ke WhatsApp Admin.
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Print Invoice button */}
                        <button
                          type="button"
                          onClick={() => onTriggerPrint(inv)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Cetak {isPaid ? 'Kwitansi' : 'Faktur'}</span>
                        </button>

                        {/* WhatsApp Confirm button */}
                        {!isPaid && (
                          <button
                            type="button"
                            onClick={() => handleConfirmPaymentViaWA(inv)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs transition-colors cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Konfirmasi Bayar ke WA CS</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Payment Channels Section */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">
              Instruksi & Rekening Pembayaran Resmi {profile.companyName}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* QRIS Code card */}
              <div className="border border-slate-200 rounded-xl p-4 text-center bg-slate-50 flex flex-col items-center justify-center">
                <img
                  src={profile.qrisImageUrl}
                  alt="QRIS Digital Payment"
                  className="w-36 h-36 object-contain bg-white p-1 rounded-lg border border-slate-300 shadow-2xs"
                  referrerPolicy="no-referrer"
                />
                <span className="text-xs font-bold text-slate-900 mt-2">Scan QRIS Semua Pembayaran</span>
                <span className="text-[11px] text-slate-500">GoPay, OVO, Dana, ShopeePay, BCA, Mandiri</span>
              </div>

              {/* Bank Accounts */}
              <div className="md:col-span-2 space-y-2.5">
                {profile.bankAccounts.map((acc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-slate-50/60"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{acc.bankName}</div>
                      <div className="font-mono text-sm font-semibold text-cyan-800 mt-0.5">
                        {acc.accountNumber}
                      </div>
                      <div className="text-[11px] text-slate-500">a.n {acc.accountHolder}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(acc.accountNumber, `bank-${idx}`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      {copiedBank === `bank-${idx}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Salin No. Rek</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-500 space-y-2">
          <Search className="w-8 h-8 mx-auto text-slate-300" />
          <h4 className="font-bold text-slate-800 text-sm">Pelanggan Tidak Ditemukan</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Silakan periksa kembali Nomor ID Pelanggan atau Nomor WhatsApp yang Anda ketikkan.
          </p>
        </div>
      )}
    </div>
  );
};
