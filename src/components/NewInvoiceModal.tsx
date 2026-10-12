import React, { useState } from 'react';
import { Customer, WifiPackage, Invoice, BusinessProfile } from '../types';
import { formatPeriodeIndo, formatRupiah } from '../utils/formatters';
import { FilePlus, X, Users, User, Check } from 'lucide-react';

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  packages: WifiPackage[];
  profile: BusinessProfile;
  existingInvoices: Invoice[];
  onGenerateBulk: (newInvoices: Invoice[]) => void;
  onCreateSingle: (newInvoice: Invoice) => void;
}

export const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({
  isOpen,
  onClose,
  customers,
  packages,
  profile,
  existingInvoices,
  onGenerateBulk,
  onCreateSingle,
}) => {
  const [mode, setMode] = useState<'bulk' | 'single'>('bulk');
  const [targetPeriod, setTargetPeriod] = useState<string>('2026-10');

  // Single mode states
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    customers.length > 0 ? customers[0].id : ''
  );
  const [discount, setDiscount] = useState<number>(0);
  const [adminFee, setAdminFee] = useState<number>(profile.defaultAdminFee || 2500);
  const [dueDateDay, setDueDateDay] = useState<number>(10);

  if (!isOpen) return null;

  // Bulk generation logic
  const activeCustomers = customers.filter((c) => c.status === 'aktif');
  const existingForPeriod = existingInvoices.filter((i) => i.period === targetPeriod);
  const existingCustIds = new Set(existingForPeriod.map((i) => i.customerId));
  const ungeneratedCustomers = activeCustomers.filter((c) => !existingCustIds.has(c.id));

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [year, month] = targetPeriod.split('-');
    const generated: Invoice[] = ungeneratedCustomers.map((c, idx) => {
      const pkg = packages.find((p) => p.id === c.packageId) || packages[0];
      const invNum = `INV/${year}${month}/WIFI-${c.customerCode.replace('CUST-', '')}`;
      const dueDate = `${year}-${month}-${String(c.dueDateDay || 10).padStart(2, '0')}`;
      const base = pkg ? pkg.price : 200000;
      const total = base + profile.defaultAdminFee;

      return {
        id: `inv-${Date.now()}-${idx}`,
        invoiceNumber: invNum,
        customerId: c.id,
        period: targetPeriod,
        periodLabel: formatPeriodeIndo(targetPeriod),
        issueDate: `${year}-${month}-01`,
        dueDate: dueDate,
        baseAmount: base,
        discount: 0,
        adminFee: profile.defaultAdminFee,
        totalAmount: total,
        status: 'belum_lunas',
      };
    });

    onGenerateBulk(generated);
    onClose();
  };

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === selectedCustomerId);
    if (!cust) return;

    const pkg = packages.find((p) => p.id === cust.packageId) || packages[0];
    const [year, month] = targetPeriod.split('-');
    const base = pkg ? pkg.price : 200000;
    const total = Math.max(0, base - Number(discount) + Number(adminFee));
    const invNum = `INV/${year}${month}/WIFI-${cust.customerCode.replace('CUST-', '')}-${Math.floor(
      100 + Math.random() * 900
    )}`;

    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invNum,
      customerId: cust.id,
      period: targetPeriod,
      periodLabel: formatPeriodeIndo(targetPeriod),
      issueDate: `${year}-${month}-01`,
      dueDate: `${year}-${month}-${String(dueDateDay).padStart(2, '0')}`,
      baseAmount: base,
      discount: Number(discount),
      adminFee: Number(adminFee),
      totalAmount: total,
      status: 'belum_lunas',
    };

    onCreateSingle(newInv);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white">
              <FilePlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-white">
                Buat Tagihan Baru (Generate Invoice)
              </h3>
              <p className="text-xs text-slate-400">
                Pilih generate serentak bulanan atau perorangan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => setMode('bulk')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-md transition-colors cursor-pointer ${
                mode === 'bulk'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Massal Otomatis ({ungeneratedCustomers.length} Siap)</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('single')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-md transition-colors cursor-pointer ${
                mode === 'single'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Tagihan Satuan / Custom</span>
            </button>
          </div>

          {/* BULK MODE */}
          {mode === 'bulk' ? (
            <form onSubmit={handleBulkSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                  Pilih Periode Bulan Tagihan
                </label>
                <select
                  value={targetPeriod}
                  onChange={(e) => setTargetPeriod(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="2026-10">Oktober 2026</option>
                  <option value="2026-11">November 2026</option>
                  <option value="2026-12">Desember 2026</option>
                  <option value="2027-01">Januari 2027</option>
                </select>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Total Pelanggan Aktif:</span>
                  <span className="font-semibold text-slate-900">{activeCustomers.length}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Sudah Ada Tagihan ({formatPeriodeIndo(targetPeriod)}):</span>
                  <span className="text-slate-900">{existingForPeriod.length}</span>
                </div>
                <div className="flex justify-between text-slate-800 font-bold border-t border-slate-200 pt-1.5">
                  <span>Akan Dibuatkan Invoice:</span>
                  <span className="text-cyan-700 font-mono text-sm">{ungeneratedCustomers.length} Faktur</span>
                </div>
              </div>

              {ungeneratedCustomers.length === 0 ? (
                <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                  Semua pelanggan aktif sudah memiliki invoice untuk periode {formatPeriodeIndo(targetPeriod)}.
                </div>
              ) : (
                <p className="text-xs text-slate-500 leading-relaxed">
                  Sistem akan membuat faktur baru untuk {ungeneratedCustomers.length} pelanggan sesuai paket internet masing-masing dengan biaya administrasi Rp {profile.defaultAdminFee.toLocaleString('id-ID')}.
                </p>
              )}

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={ungeneratedCustomers.length === 0}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg shadow-sm cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Generate {ungeneratedCustomers.length} Invoice</span>
                </button>
              </div>
            </form>
          ) : (
            /* SINGLE CUSTOM MODE */
            <form onSubmit={handleSingleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wide mb-1">
                  Pilih Pelanggan
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.customerCode}) - {c.cluster}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wide mb-1">
                    Periode
                  </label>
                  <select
                    value={targetPeriod}
                    onChange={(e) => setTargetPeriod(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="2026-10">Oktober 2026</option>
                    <option value="2026-11">November 2026</option>
                    <option value="2026-12">Desember 2026</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wide mb-1">
                    Tanggal Jatuh Tempo
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="28"
                    value={dueDateDay}
                    onChange={(e) => setDueDateDay(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wide mb-1">
                    Biaya Admin (Rp)
                  </label>
                  <input
                    type="number"
                    value={adminFee}
                    onChange={(e) => setAdminFee(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wide mb-1">
                    Potongan Diskon (Rp)
                  </label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Buat Faktur Ini</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
