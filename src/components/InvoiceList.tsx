import React, { useState, useMemo } from 'react';
import { Invoice, Customer, WifiPackage, InvoiceStatus } from '../types';
import { formatRupiah, formatTanggalIndo } from '../utils/formatters';
import {
  Search,
  Printer,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Ban,
  Trash2,
  CheckCheck,
} from 'lucide-react';

interface InvoiceListProps {
  invoices: Invoice[];
  customers: Customer[];
  packages: WifiPackage[];
  onTriggerPrint: (invoice: Invoice, autoPrint?: boolean) => void;
  onTriggerWhatsApp: (invoice: Invoice) => void;
  onTriggerPayment: (invoice: Invoice) => void;
  onDeleteInvoice: (invoiceId: string) => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  customers,
  packages,
  onTriggerPrint,
  onTriggerWhatsApp,
  onTriggerPayment,
  onDeleteInvoice,
}) => {
  const [statusFilter, setStatusFilter] = useState<'semua' | InvoiceStatus>('semua');
  const [clusterFilter, setClusterFilter] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique clusters
  const clusters = useMemo(() => {
    const set = new Set<string>();
    customers.forEach((c) => {
      if (c.cluster) set.add(c.cluster);
    });
    return Array.from(set);
  }, [customers]);

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const cust = customers.find((c) => c.id === inv.customerId);
      if (!cust) return false;

      // Status filter
      if (statusFilter !== 'semua' && inv.status !== statusFilter) {
        return false;
      }

      // Cluster filter
      if (clusterFilter !== 'semua' && cust.cluster !== clusterFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = cust.name.toLowerCase().includes(query);
        const matchesCode = cust.customerCode.toLowerCase().includes(query);
        const matchesPhone = cust.phone.includes(query);
        const matchesInv = inv.invoiceNumber.toLowerCase().includes(query);
        const matchesPeriod = inv.periodLabel.toLowerCase().includes(query);
        if (!matchesName && !matchesCode && !matchesPhone && !matchesInv && !matchesPeriod) {
          return false;
        }
      }

      return true;
    });
  }, [invoices, customers, statusFilter, clusterFilter, searchQuery]);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Controls Bar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg text-xs font-medium overflow-x-auto">
          <button
            type="button"
            onClick={() => setStatusFilter('semua')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === 'semua'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({invoices.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('belum_lunas')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === 'belum_lunas'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Belum Lunas ({invoices.filter((i) => i.status === 'belum_lunas').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('jatuh_tempo')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === 'jatuh_tempo'
                ? 'bg-white text-amber-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jatuh Tempo ({invoices.filter((i) => i.status === 'jatuh_tempo').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('lunas')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === 'lunas'
                ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lunas ({invoices.filter((i) => i.status === 'lunas').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('isolir')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === 'isolir'
                ? 'bg-white text-rose-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Isolir ({invoices.filter((i) => i.status === 'isolir').length})
          </button>
        </div>

        {/* Search & Cluster Filter */}
        <div className="flex items-center gap-2">
          {/* Cluster Dropdown */}
          <select
            value={clusterFilter}
            onChange={(e) => setClusterFilter(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="semua">Semua Wilayah / Cluster</option>
            {clusters.map((cl) => (
              <option key={cl} value={cl}>
                {cl}
              </option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, ID, No Inv..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-lg w-48 sm:w-60 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">No. Invoice & Tanggal</th>
              <th className="py-3 px-4">Pelanggan & Paket</th>
              <th className="py-3 px-4">Wilayah / Cluster</th>
              <th className="py-3 px-4">Jatuh Tempo</th>
              <th className="py-3 px-4 text-right">Total Tagihan</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Aksi Cepat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-700">Tidak ada faktur tagihan ditemukan</p>
                    <p className="text-xs text-slate-400">
                      Silakan sesuaikan filter pencarian atau buat tagihan baru.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => {
                const cust = customers.find((c) => c.id === inv.customerId);
                if (!cust) return null;
                const pkg = packages.find((p) => p.id === cust.packageId);

                return (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Invoice & Date */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-semibold text-slate-900">
                        {inv.invoiceNumber}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>Terbit: {inv.issueDate}</span>
                        <span>·</span>
                        <span className="font-medium text-slate-700">{inv.periodLabel}</span>
                      </div>
                    </td>

                    {/* Customer & Package */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{cust.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-slate-700 font-medium">
                          {cust.customerCode}
                        </span>
                        <span>·</span>
                        <span>{pkg?.name || 'Paket WiFi'} ({pkg?.speedMbps}M)</span>
                      </div>
                    </td>

                    {/* Cluster / Address */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 truncate max-w-[170px]" title={cust.address}>
                        {cust.cluster}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {cust.phone}
                      </div>
                    </td>

                    {/* Due Date */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-700">
                        {formatTanggalIndo(inv.dueDate)}
                      </div>
                      {inv.status === 'lunas' && inv.paymentDate && (
                        <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
                          Lunas: {inv.paymentDate}
                        </div>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatRupiah(inv.totalAmount)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      {inv.status === 'lunas' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Lunas</span>
                        </span>
                      )}
                      {inv.status === 'belum_lunas' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>Belum Lunas</span>
                        </span>
                      )}
                      {inv.status === 'jatuh_tempo' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Jatuh Tempo</span>
                        </span>
                      )}
                      {inv.status === 'isolir' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
                          <Ban className="w-3.5 h-3.5 text-rose-600" />
                          <span>Terisolir</span>
                        </span>
                      )}
                    </td>

                    {/* Quick Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* 1. Cetak Invoice Otomatis Button */}
                        <button
                          type="button"
                          onClick={() => onTriggerPrint(inv, false)}
                          title="Cetak Invoice / Struk POS Otomatis"
                          className="p-1.5 text-slate-700 hover:text-cyan-700 hover:bg-cyan-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* 2. Kirim WhatsApp Pelanggan */}
                        <button
                          type="button"
                          onClick={() => onTriggerWhatsApp(inv)}
                          title="Kirim Notifikasi WhatsApp ke Pelanggan"
                          className={`p-1.5 border rounded-lg transition-colors cursor-pointer ${
                            inv.waSentAt
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-300 hover:bg-emerald-100'
                              : 'text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 border-slate-200'
                          }`}
                        >
                          {inv.waSentAt ? (
                            <CheckCheck className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </button>

                        {/* 3. Catat Bayar Button */}
                        {inv.status !== 'lunas' && (
                          <button
                            type="button"
                            onClick={() => onTriggerPayment(inv)}
                            title="Catat Pembayaran (Tandai Lunas)"
                            className="p-1.5 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {/* 4. Delete Invoice */}
                        <button
                          type="button"
                          onClick={() => onDeleteInvoice(inv.id)}
                          title="Hapus Tagihan"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer summary bar */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div>
          Menampilkan <span className="font-semibold text-slate-700">{filteredInvoices.length}</span> dari{' '}
          <span className="font-semibold text-slate-700">{invoices.length}</span> total tagihan
        </div>
        <div className="flex items-center gap-3">
          <span>
            Tertagih:{' '}
            <strong className="text-emerald-700 font-mono">
              {formatRupiah(
                filteredInvoices
                  .filter((i) => i.status === 'lunas')
                  .reduce((s, i) => s + i.totalAmount, 0)
              )}
            </strong>
          </span>
          <span>·</span>
          <span>
            Piutang:{' '}
            <strong className="text-amber-700 font-mono">
              {formatRupiah(
                filteredInvoices
                  .filter((i) => i.status !== 'lunas')
                  .reduce((s, i) => s + i.totalAmount, 0)
              )}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};
