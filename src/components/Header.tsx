import React from 'react';
import { Wifi, Plus, Send, Settings, UserCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: 'penagihan' | 'pelanggan' | 'paket' | 'portal_cek' | 'pengaturan';
  setActiveTab: (tab: 'penagihan' | 'pelanggan' | 'paket' | 'portal_cek' | 'pengaturan') => void;
  onOpenNewInvoice: () => void;
  onOpenBulkWhatsApp: () => void;
  unpaidCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewInvoice,
  onOpenBulkWhatsApp,
  unpaidCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Wordmark / Brand element */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-cyan-600 text-white flex items-center justify-center shadow-xs">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                MitraNet <span className="text-cyan-600 font-semibold text-base">E-Billing</span>
              </span>
            </div>
          </div>

          {/* Zone 2: 4-5 single-line clean navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('penagihan')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'penagihan'
                  ? 'border-cyan-600 text-cyan-700 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Penagihan & Invoice
            </button>
            <button
              onClick={() => setActiveTab('pelanggan')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'pelanggan'
                  ? 'border-cyan-600 text-cyan-700 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Data Pelanggan
            </button>
            <button
              onClick={() => setActiveTab('paket')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'paket'
                  ? 'border-cyan-600 text-cyan-700 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Paket WiFi
            </button>
            <button
              onClick={() => setActiveTab('portal_cek')}
              className={`flex items-center gap-1.5 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'portal_cek'
                  ? 'border-cyan-600 text-cyan-700 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              <UserCheck className="w-4 h-4 text-slate-400" />
              <span>Portal Cek Tagihan</span>
            </button>
            <button
              onClick={() => setActiveTab('pengaturan')}
              className={`flex items-center gap-1.5 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'pengaturan'
                  ? 'border-cyan-600 text-cyan-700 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Pengaturan</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            {unpaidCount > 0 && (
              <button
                onClick={onOpenBulkWhatsApp}
                title="Kirim Notifikasi WhatsApp Massal ke Pelanggan yang Belum Lunas"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-emerald-600" />
                <span>Blast WA Tagihan ({unpaidCount})</span>
              </button>
            )}

            <button
              onClick={onOpenNewInvoice}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Tagihan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden border-t border-slate-100 bg-slate-50 px-4 py-2 flex items-center justify-between text-xs overflow-x-auto gap-4">
        <button
          onClick={() => setActiveTab('penagihan')}
          className={`whitespace-nowrap px-2 py-1 font-medium ${activeTab === 'penagihan' ? 'text-cyan-700 font-bold' : 'text-slate-600'}`}
        >
          Penagihan
        </button>
        <button
          onClick={() => setActiveTab('pelanggan')}
          className={`whitespace-nowrap px-2 py-1 font-medium ${activeTab === 'pelanggan' ? 'text-cyan-700 font-bold' : 'text-slate-600'}`}
        >
          Pelanggan
        </button>
        <button
          onClick={() => setActiveTab('paket')}
          className={`whitespace-nowrap px-2 py-1 font-medium ${activeTab === 'paket' ? 'text-cyan-700 font-bold' : 'text-slate-600'}`}
        >
          Paket
        </button>
        <button
          onClick={() => setActiveTab('portal_cek')}
          className={`whitespace-nowrap px-2 py-1 font-medium ${activeTab === 'portal_cek' ? 'text-cyan-700 font-bold' : 'text-slate-600'}`}
        >
          Cek Mandiri
        </button>
        <button
          onClick={() => setActiveTab('pengaturan')}
          className={`whitespace-nowrap px-2 py-1 font-medium ${activeTab === 'pengaturan' ? 'text-cyan-700 font-bold' : 'text-slate-600'}`}
        >
          Pengaturan
        </button>
      </div>
    </header>
  );
};
