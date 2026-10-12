import React, { useState } from 'react';
import { Invoice, Customer, PaymentMethod } from '../types';
import { formatRupiah, formatTanggalIndo } from '../utils/formatters';
import { CheckCircle2, X, Printer, Send, CreditCard } from 'lucide-react';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  customer: Customer;
  onSavePayment: (
    invoiceId: string,
    method: PaymentMethod,
    collector: string,
    notes: string,
    receiptNumber: string
  ) => void;
  onTriggerPrint: (invoice: Invoice) => void;
  onTriggerWhatsApp: (invoice: Invoice) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  invoice,
  customer,
  onSavePayment,
  onTriggerPrint,
  onTriggerWhatsApp,
}) => {
  const [method, setMethod] = useState<PaymentMethod>('Transfer BCA');
  const [collector, setCollector] = useState<string>('Admin Kasir MitraNet');
  const [notes, setNotes] = useState<string>('Pembayaran lunas via konfirmasi transfer');
  const [justSaved, setJustSaved] = useState<boolean>(false);
  const [savedInvoice, setSavedInvoice] = useState<Invoice | null>(null);

  if (!isOpen) return null;

  const generateReceiptNumber = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `KW/202610/${randomSuffix}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const receiptNo = generateReceiptNumber();
    onSavePayment(invoice.id, method, collector, notes, receiptNo);

    const updated: Invoice = {
      ...invoice,
      status: 'lunas',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: method,
      paymentCollector: collector,
      receiptNumber: receiptNo,
      notes: notes,
    };
    setSavedInvoice(updated);
    setJustSaved(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-white">
                Catat Pembayaran Tagihan
              </h3>
              <p className="text-xs text-slate-400">
                {invoice.invoiceNumber} · {customer.name}
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
        {!justSaved ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Invoice summary info */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Nama Pelanggan:</span>
                <span className="font-semibold text-slate-800">{customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ID Pelanggan:</span>
                <span className="font-mono text-slate-800">{customer.customerCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Periode Tagihan:</span>
                <span className="text-slate-800">{invoice.periodLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jatuh Tempo:</span>
                <span className="text-slate-800">{formatTanggalIndo(invoice.dueDate)}</span>
              </div>
              <div className="border-t border-slate-200 pt-1.5 flex justify-between items-center">
                <span className="font-semibold text-slate-700">Total Harus Dibayar:</span>
                <span className="font-bold text-base text-cyan-800 font-mono tabular-nums">
                  {formatRupiah(invoice.totalAmount)}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Metode Pembayaran
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {(['Transfer BCA', 'Transfer BRI', 'Transfer Mandiri', 'QRIS', 'Cash', 'E-Wallet'] as PaymentMethod[]).map(
                  (m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      className={`p-2 rounded-lg border text-left font-medium transition-all cursor-pointer ${
                        method === m
                          ? 'border-cyan-600 bg-cyan-50 text-cyan-900 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {m}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Collector / Kasir */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                Penerima / Kasir / Kolektor
              </label>
              <input
                type="text"
                value={collector}
                onChange={(e) => setCollector(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                Catatan / Keterangan Pembayaran
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Simpan Sebagai Lunas</span>
              </button>
            </div>
          </form>
        ) : (
          /* Post-save action prompt */
          <div className="p-6 text-center space-y-5">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-900">
                Pembayaran Berhasil Dicatat!
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Tagihan {invoice.invoiceNumber} telah ditandai LUNAS ({method}).
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
              <div>No. Kwitansi: <span className="font-mono font-bold text-slate-900">{savedInvoice?.receiptNumber}</span></div>
              <div>Nominal: <span className="font-mono font-bold text-emerald-600">{formatRupiah(invoice.totalAmount)}</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (savedInvoice) onTriggerPrint(savedInvoice);
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Bukti Struk</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (savedInvoice) onTriggerWhatsApp(savedInvoice);
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Kwitansi WA</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors pt-2 cursor-pointer"
            >
              Kembali ke Daftar Penagihan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
