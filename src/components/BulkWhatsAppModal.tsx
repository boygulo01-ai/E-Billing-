import React, { useState } from 'react';
import { Invoice, Customer, WifiPackage, BusinessProfile, WhatsAppTemplate } from '../types';
import { buildWhatsAppUrl, cleanPhoneNumber, formatRupiah, renderWhatsAppMessage } from '../utils/formatters';
import { Send, X, Check, ExternalLink, Users, AlertCircle } from 'lucide-react';

interface BulkWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  customers: Customer[];
  packages: WifiPackage[];
  profile: BusinessProfile;
  templates: WhatsAppTemplate[];
  onMarkAsSent: (invoiceId: string) => void;
}

export const BulkWhatsAppModal: React.FC<BulkWhatsAppModalProps> = ({
  isOpen,
  onClose,
  invoices,
  customers,
  packages,
  profile,
  templates,
  onMarkAsSent,
}) => {
  // Filter only unpaid or overdue invoices
  const unpaidInvoices = invoices.filter((inv) => inv.status !== 'lunas');

  const [selectedTemplateType, setSelectedTemplateType] = useState<WhatsAppTemplate['type']>('pengingat_tempo');
  const [sentMap, setSentMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    unpaidInvoices.forEach((inv) => {
      if (inv.waSentAt) {
        initial[inv.id] = true;
      }
    });
    return initial;
  });

  if (!isOpen) return null;

  const currentTemplate = templates.find((t) => t.type === selectedTemplateType) || templates[0];

  const handleSendSingle = (inv: Invoice, cust: Customer) => {
    const pkg = packages.find((p) => p.id === cust.packageId);
    const message = renderWhatsAppMessage(currentTemplate.content, inv, cust, pkg, profile);
    const url = buildWhatsAppUrl(cust.phone, message);
    window.open(url, '_blank', 'noopener,noreferrer');
    onMarkAsSent(inv.id);
    setSentMap((prev) => ({ ...prev, [inv.id]: true }));
  };

  const sentCount = Object.values(sentMap).filter(Boolean).length;
  const totalCount = unpaidInvoices.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
                <span>Pengiriman WhatsApp Tagihan Massal</span>
                <span className="text-xs bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                  {sentCount}/{totalCount} Terkirim
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Antrean penagihan pelanggan belum lunas & jatuh tempo
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
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Template Selection */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="text-xs font-semibold text-slate-700">
              Template Pesan yang Digunakan:
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedTemplateType('pengingat_tempo')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                  selectedTemplateType === 'pengingat_tempo'
                    ? 'bg-amber-500 text-white border-amber-600 font-semibold'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                Pengingat Tempo
              </button>
              <button
                type="button"
                onClick={() => setSelectedTemplateType('tagihan_baru')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                  selectedTemplateType === 'tagihan_baru'
                    ? 'bg-emerald-600 text-white border-emerald-700 font-semibold'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                Tagihan Baru
              </button>
              <button
                type="button"
                onClick={() => setSelectedTemplateType('peringatan_isolir')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                  selectedTemplateType === 'peringatan_isolir'
                    ? 'bg-rose-600 text-white border-rose-700 font-semibold'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                Peringatan Isolir
              </button>
            </div>
          </div>

          {/* Explanation notice */}
          <div className="text-xs text-slate-600 flex items-start gap-2 bg-blue-50/70 p-3 rounded-lg border border-blue-200/60">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Klik <strong>Kirim WA</strong> pada tiap pelanggan di daftar bawah. Tautan WhatsApp Web/Aplikasi akan terbuka otomatis dengan pesan siap kirim. Metode ini menjamin nomor WhatsApp bisnis Anda aman dari resiko pembatasan spam.
            </span>
          </div>

          {/* Queue List Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Pelanggan</th>
                  <th className="py-2.5 px-3">No. WhatsApp</th>
                  <th className="py-2.5 px-3 text-right">Tagihan</th>
                  <th className="py-2.5 px-3 text-center">Status Kirim</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {unpaidInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <Users className="w-6 h-6 text-slate-400" />
                        <span>Semua tagihan telah lunas! Tidak ada antrean pengiriman.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  unpaidInvoices.map((inv) => {
                    const cust = customers.find((c) => c.id === inv.customerId);
                    if (!cust) return null;
                    const isSent = !!sentMap[inv.id];

                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900">{cust.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {cust.customerCode} · {cust.cluster}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-700">
                          +{cleanPhoneNumber(cust.phone)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-medium tabular-nums text-slate-900">
                          {formatRupiah(inv.totalAmount)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {isSent ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Terkirim</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-500">
                              Belum Dikirim
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleSendSingle(inv, cust)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                              isSent
                                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs'
                            }`}
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>{isSent ? 'Kirim Ulang' : 'Kirim WA'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-200">
          <div className="text-xs text-slate-500">
            Total tertunggak:{' '}
            <span className="font-bold text-slate-900 font-mono">
              {formatRupiah(unpaidInvoices.reduce((s, i) => s + i.totalAmount, 0))}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
