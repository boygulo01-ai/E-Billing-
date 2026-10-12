import React, { useState, useEffect } from 'react';
import { Invoice, Customer, WifiPackage, BusinessProfile, WhatsAppTemplate } from '../types';
import { buildWhatsAppUrl, cleanPhoneNumber, renderWhatsAppMessage } from '../utils/formatters';
import { MessageSquare, Send, Copy, Check, X, CheckCheck } from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  customer: Customer;
  pkg?: WifiPackage;
  profile: BusinessProfile;
  templates: WhatsAppTemplate[];
  onMarkAsSent: (invoiceId: string) => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  invoice,
  customer,
  pkg,
  profile,
  templates,
  onMarkAsSent,
}) => {
  // Determine default template based on invoice status
  const defaultTemplateType: WhatsAppTemplate['type'] =
    invoice.status === 'lunas'
      ? 'kwitansi_lunas'
      : invoice.status === 'isolir'
      ? 'peringatan_isolir'
      : invoice.status === 'jatuh_tempo'
      ? 'pengingat_tempo'
      : 'tagihan_baru';

  const [selectedType, setSelectedType] = useState<WhatsAppTemplate['type']>(defaultTemplateType);
  const [messageBody, setMessageBody] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  // Update message when template type changes
  useEffect(() => {
    const currentTemplate = templates.find((t) => t.type === selectedType) || templates[0];
    if (currentTemplate) {
      const rendered = renderWhatsAppMessage(currentTemplate.content, invoice, customer, pkg, profile);
      setMessageBody(rendered);
    }
  }, [selectedType, invoice, customer, pkg, profile, templates]);

  if (!isOpen) return null;

  const handleOpenWhatsApp = () => {
    const url = buildWhatsAppUrl(customer.phone, messageBody);
    window.open(url, '_blank', 'noopener,noreferrer');
    onMarkAsSent(invoice.id);
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 4000);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(messageBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedPhone = cleanPhoneNumber(customer.phone);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
                <span>Notifikasi WhatsApp Pelanggan</span>
                {invoice.waSentAt && (
                  <span className="text-[10px] bg-emerald-800/80 px-2 py-0.5 rounded text-emerald-100 font-normal">
                    Pernah Terkirim
                  </span>
                )}
              </h3>
              <p className="text-xs text-emerald-100">
                Tujuan: <span className="font-semibold text-white">{customer.name}</span> ·{' '}
                <span className="font-mono">+{formattedPhone}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Template Selection Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Pilih Jenis Template Notifikasi:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setSelectedType('tagihan_baru')}
                className={`p-2.5 rounded-lg text-xs font-medium text-left border transition-all cursor-pointer ${
                  selectedType === 'tagihan_baru'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-semibold">Tagihan Baru</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Invoice Terbit</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('pengingat_tempo')}
                className={`p-2.5 rounded-lg text-xs font-medium text-left border transition-all cursor-pointer ${
                  selectedType === 'pengingat_tempo'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-semibold">Jatuh Tempo</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Pengingat H-1 / H-3</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('kwitansi_lunas')}
                className={`p-2.5 rounded-lg text-xs font-medium text-left border transition-all cursor-pointer ${
                  selectedType === 'kwitansi_lunas'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-semibold">Kwitansi Lunas</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Bukti Pembayaran</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('peringatan_isolir')}
                className={`p-2.5 rounded-lg text-xs font-medium text-left border transition-all cursor-pointer ${
                  selectedType === 'peringatan_isolir'
                    ? 'border-rose-600 bg-rose-50 text-rose-900 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-semibold">Peringatan Isolir</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Pemutusan Akses</div>
              </button>
            </div>
          </div>

          {/* WhatsApp Chat Preview Simulation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Preview Pesan WhatsApp:</span>
              <span className="text-slate-500 text-[11px]">Anda dapat menyesuaikan teks di bawah ini</span>
            </div>

            {/* Simulated Chat Window */}
            <div className="bg-[#efeae2] p-4 rounded-xl border border-slate-300 relative shadow-inner">
              <div className="max-w-md bg-white rounded-lg p-3.5 shadow-sm text-xs leading-relaxed text-slate-900 border border-slate-200/60 ml-auto space-y-2">
                <textarea
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  rows={10}
                  className="w-full bg-transparent border-0 p-0 text-xs focus:ring-0 text-slate-800 font-sans resize-none leading-relaxed"
                />
                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 font-mono">
                  <span>10:45</span>
                  <CheckCheck className="w-3.5 h-3.5 text-cyan-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Sent Notice */}
          {sentSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Tautan WhatsApp berhasil dibuka! Status invoice telah diperbarui sebagai "Notifikasi Terkirim".
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-200">
          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin ke Clipboard' : 'Salin Pesan'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Tutup
            </button>

            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Buka WhatsApp & Kirim</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
