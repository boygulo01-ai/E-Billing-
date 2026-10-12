import React from 'react';
import { Invoice, Customer } from '../types';
import { formatRupiah } from '../utils/formatters';
import { Wallet, AlertCircle, CheckCircle2, Users, Send, FilePlus } from 'lucide-react';

interface DashboardOverviewProps {
  invoices: Invoice[];
  customers: Customer[];
  onOpenNewInvoice: () => void;
  onOpenBulkWhatsApp: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  invoices,
  customers,
  onOpenNewInvoice,
  onOpenBulkWhatsApp,
}) => {
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  const paidInvoices = invoices.filter((inv) => inv.status === 'lunas');
  const totalPaid = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  const unpaidInvoices = invoices.filter((inv) => inv.status !== 'lunas');
  const totalUnpaid = unpaidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  const overdueInvoices = invoices.filter((inv) => inv.status === 'jatuh_tempo' || inv.status === 'isolir');

  const activeCustomersCount = customers.filter((c) => c.status === 'aktif').length;
  const isolatedCustomersCount = customers.filter((c) => c.status === 'isolir').length;

  const collectionRate = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Tagihan */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Total Tagihan Periode Ini</span>
            <Wallet className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {formatRupiah(totalBilled)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span>{invoices.length} Faktur Terbit</span>
            <span>·</span>
            <span>{customers.length} Pelanggan Terdaftar</span>
          </div>
        </div>

        {/* Card 2: Lunas Terkumpul */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-emerald-600 mb-2 font-medium">
            <span>Pembayaran Masuk (Lunas)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-emerald-600 font-mono tabular-nums">
            {formatRupiah(totalPaid)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="font-semibold text-emerald-600 font-mono tabular-nums">{collectionRate}%</span>
            <span>Tertagih ({paidInvoices.length} pelanggan)</span>
          </div>
        </div>

        {/* Card 3: Belum Lunas / Tertunggak */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-amber-600 mb-2 font-medium">
            <span>Piutang / Belum Terbayar</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-amber-600 font-mono tabular-nums">
            {formatRupiah(totalUnpaid)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span>{unpaidInvoices.length} Tagihan Tertunda</span>
            <span>·</span>
            <span className="text-rose-600 font-medium">{overdueInvoices.length} Jatuh Tempo</span>
          </div>
        </div>

        {/* Card 4: Status Pelanggan */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Status Layanan Pelanggan</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {activeCustomersCount} <span className="text-xs font-normal text-slate-500">Aktif</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="text-rose-600 font-medium">{isolatedCustomersCount} Terisolir</span>
            <span>·</span>
            <span>{customers.length - activeCustomersCount - isolatedCustomersCount} Nonaktif</span>
          </div>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-white tracking-tight">
            Penagihan & Pengiriman Pesan WhatsApp Siap Dilakukan
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Sistem otomatis menyiapkan template invoice cetak (Struk POS Thermal / Faktur A4) dan tautan pengiriman notifikasi WhatsApp sekali klik untuk pelanggan yang belum melunasi tagihan.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
          {unpaidInvoices.length > 0 && (
            <button
              onClick={onOpenBulkWhatsApp}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Blast WA ({unpaidInvoices.length} Menunggak)</span>
            </button>
          )}

          <button
            onClick={onOpenNewInvoice}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <FilePlus className="w-3.5 h-3.5 text-slate-700" />
            <span>Generate Tagihan Baru</span>
          </button>
        </div>
      </div>
    </div>
  );
};
