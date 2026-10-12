import React, { useState } from 'react';
import { BusinessProfile, WhatsAppTemplate } from '../types';
import { storageService } from '../services/storageService';
import { Settings, Save, Download, Upload, RotateCcw, Check, Plus, Trash2 } from 'lucide-react';

interface BusinessSettingsModalProps {
  profile: BusinessProfile;
  templates: WhatsAppTemplate[];
  onSaveProfile: (profile: BusinessProfile) => void;
  onSaveTemplates: (templates: WhatsAppTemplate[]) => void;
  onReloadAllData: () => void;
}

export const BusinessSettingsModal: React.FC<BusinessSettingsModalProps> = ({
  profile,
  templates,
  onSaveProfile,
  onSaveTemplates,
  onReloadAllData,
}) => {
  const [formData, setFormData] = useState<BusinessProfile>(profile);
  const [templateList, setTemplateList] = useState<WhatsAppTemplate[]>(templates);
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'templates' | 'backup'>('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onSaveTemplates(templateList);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddBankAccount = () => {
    setFormData({
      ...formData,
      bankAccounts: [
        ...formData.bankAccounts,
        { bankName: 'Bank Lain', accountNumber: '1234567890', accountHolder: formData.companyName },
      ],
    });
  };

  const handleRemoveBankAccount = (index: number) => {
    const updated = formData.bankAccounts.filter((_, idx) => idx !== index);
    setFormData({ ...formData, bankAccounts: updated });
  };

  const handleExportBackup = () => {
    const jsonStr = storageService.exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_wifi_billing_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = storageService.importBackupJson(content);
      if (success) {
        alert('Data backup berhasil diimpor!');
        onReloadAllData();
      } else {
        alert('Gagal mengimpor file backup. Format JSON tidak sesuai.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin mereset seluruh data kembali ke data contoh bawaan?')) {
      storageService.resetAll();
      onReloadAllData();
      alert('Data telah direset ke bawaan.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-600" />
            <span>Pengaturan Bisnis ISP & Penagihan</span>
          </h2>
          <p className="text-xs text-slate-500">
            Kelola profil usaha pada kop faktur, nomor rekening pembayaran, dan template WhatsApp.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Pengaturan Tersimpan!</span>
          </div>
        )}
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg text-xs font-medium w-fit">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            activeSubTab === 'profile'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Profil Perusahaan & Rekening
        </button>
        <button
          onClick={() => setActiveSubTab('templates')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            activeSubTab === 'templates'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Kustomisasi Template WhatsApp
        </button>
        <button
          onClick={() => setActiveSubTab('backup')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            activeSubTab === 'backup'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Backup & Ekspor Data
        </button>
      </div>

      {/* Form Tab 1: Profile & Accounts */}
      {activeSubTab === 'profile' && (
        <form onSubmit={handleSubmitProfile} className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Perusahaan / ISP / RT-RW Net
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Slogan / Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                No. WhatsApp Admin / CS
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email Dukungan
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Biaya Admin Faktur Default (Rp)
              </label>
              <input
                type="number"
                value={formData.defaultAdminFee}
                onChange={(e) => setFormData({ ...formData, defaultAdminFee: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Alamat Kantor / Kantor Operasional
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Bank Accounts */}
          <div className="border-t border-slate-200 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Rekening Bank Pembayaran</h4>
                <p className="text-slate-500 text-[11px]">
                  Daftar rekening ini akan otomatis tercantum pada faktur resmi dan notifikasi WhatsApp pelanggan.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddBankAccount}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200 rounded-lg hover:bg-cyan-100 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Rekening</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.bankAccounts.map((acc, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <input
                    type="text"
                    placeholder="Nama Bank (misal BCA)"
                    value={acc.bankName}
                    onChange={(e) => {
                      const copy = [...formData.bankAccounts];
                      copy[idx].bankName = e.target.value;
                      setFormData({ ...formData, bankAccounts: copy });
                    }}
                    className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Nomor Rekening"
                    value={acc.accountNumber}
                    onChange={(e) => {
                      const copy = [...formData.bankAccounts];
                      copy[idx].accountNumber = e.target.value;
                      setFormData({ ...formData, bankAccounts: copy });
                    }}
                    className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:outline-none font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Atas Nama"
                    value={acc.accountHolder}
                    onChange={(e) => {
                      const copy = [...formData.bankAccounts];
                      copy[idx].accountHolder = e.target.value;
                      setFormData({ ...formData, bankAccounts: copy });
                    }}
                    className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:outline-none"
                  />
                  {formData.bankAccounts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBankAccount(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                      title="Hapus Rekening"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Catatan & Syarat Ketentuan Penagihan (Kaki Invoice)
            </label>
            <textarea
              rows={2}
              value={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      )}

      {/* Form Tab 2: WhatsApp Templates */}
      {activeSubTab === 'templates' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 space-y-6 text-xs">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">
              Kustomisasi Format Pesan Notifikasi WhatsApp
            </h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Variabel yang didukung: <code className="bg-slate-100 px-1 py-0.5 rounded text-cyan-700">{`{NAMA}`}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-cyan-700">{`{ID_PELANGGAN}`}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-cyan-700">{`{NO_INVOICE}`}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-cyan-700">{`{PAKET}`}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-cyan-700">{`{TAGIHAN}`}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-cyan-700">{`{JATUH_TEMPO}`}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-cyan-700">{`{REKENING}`}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-cyan-700">{`{NAMA_ISP}`}</code>.
            </p>
          </div>

          <div className="space-y-4">
            {templateList.map((tpl, idx) => (
              <div key={tpl.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{tpl.title}</span>
                  <span className="text-[10px] uppercase font-mono text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                    {tpl.type}
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={tpl.content}
                  onChange={(e) => {
                    const copy = [...templateList];
                    copy[idx].content = e.target.value;
                    setTemplateList(copy);
                  }}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-mono text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmitProfile}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Template</span>
            </button>
          </div>
        </div>
      )}

      {/* Form Tab 3: Backup & Restore */}
      {activeSubTab === 'backup' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 space-y-6 text-xs">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Cadangan & Pemulihan Data (Backup & Restore)</h4>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Simpan seluruh data pelanggan, paket, dan faktur tagihan ke berkas JSON untuk disimpan aman di komputer Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Export */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="font-bold text-slate-900">Ekspor Cadangan (Download JSON)</div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Unduh seluruh basis data saat ini ke file JSON terenkripsi lokal untuk arsip bulanan.
              </p>
              <button
                type="button"
                onClick={handleExportBackup}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-700" />
                <span>Unduh File Backup (.json)</span>
              </button>
            </div>

            {/* Import */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="font-bold text-slate-900">Impor Cadangan (Restore JSON)</div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Pulihkan data dari file JSON cadangan yang telah Anda unduh sebelumnya.
              </p>
              <label className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 shadow-2xs cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-emerald-700" />
                <span>Pilih File Backup JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Reset button */}
          <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
            <div>
              <span className="font-bold text-rose-700 block">Reset Data Contoh</span>
              <span className="text-slate-500 text-[11px]">
                Kembalikan semua data ke sampel awal default mitra RT-RW Net MitraNet.
              </span>
            </div>
            <button
              type="button"
              onClick={handleResetData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data ke Awal</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
