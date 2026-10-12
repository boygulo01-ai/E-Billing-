import React, { useState } from 'react';
import { WifiPackage, Customer } from '../types';
import { formatRupiah } from '../utils/formatters';
import { Wifi, Plus, Edit2, Trash2, X, Check, Users } from 'lucide-react';

interface PackageManagementProps {
  packages: WifiPackage[];
  customers: Customer[];
  onSavePackage: (pkg: WifiPackage) => void;
  onDeletePackage: (id: string) => void;
}

export const PackageManagement: React.FC<PackageManagementProps> = ({
  packages,
  customers,
  onSavePackage,
  onDeletePackage,
}) => {
  const [editingPkg, setEditingPkg] = useState<WifiPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [speedMbps, setSpeedMbps] = useState<number>(20);
  const [price, setPrice] = useState<number>(200000);
  const [description, setDescription] = useState('');

  const handleOpenAdd = () => {
    setEditingPkg(null);
    setName('');
    setSpeedMbps(25);
    setPrice(250000);
    setDescription('Paket internet cepat unlimited 24 jam');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg: WifiPackage) => {
    setEditingPkg(pkg);
    setName(pkg.name);
    setSpeedMbps(pkg.speedMbps);
    setPrice(pkg.price);
    setDescription(pkg.description);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPkg: WifiPackage = {
      id: editingPkg ? editingPkg.id : `pkg-${Date.now()}`,
      name,
      speedMbps: Number(speedMbps),
      price: Number(price),
      fupGb: 0,
      description,
    };
    onSavePackage(finalPkg);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Paket Layanan Internet WiFi
          </h2>
          <p className="text-xs text-slate-500">
            Atur kecepatan bandwidth, harga langganan per bulan, dan rincian paket untuk pelanggan.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Paket Baru</span>
        </button>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {packages.map((pkg) => {
          const subscriberCount = customers.filter((c) => c.packageId === pkg.id).length;

          return (
            <div
              key={pkg.id}
              className="bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center border border-cyan-100">
                    <Wifi className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(pkg)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 cursor-pointer"
                      title="Edit Paket"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeletePackage(pkg.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 cursor-pointer"
                      title="Hapus Paket"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {pkg.name}
                </h3>
                <div className="text-2xl font-bold font-mono text-cyan-700 mt-2 tabular-nums">
                  {formatRupiah(pkg.price)}{' '}
                  <span className="text-xs font-normal text-slate-500">/ bulan</span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                  <span className="font-semibold text-slate-900 font-mono">{pkg.speedMbps} Mbps</span>
                  <span>·</span>
                  <span className="text-emerald-700 font-medium">Unlimited FUP</span>
                </div>

                <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Pelanggan Aktif:</span>
                </span>
                <span className="font-bold text-slate-900 font-mono">
                  {subscriberCount} Pelanggan
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit Package */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <h3 className="text-sm font-semibold tracking-tight text-white">
                {editingPkg ? 'Edit Paket Internet' : 'Tambah Paket Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Paket
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Family Fast 25 Mbps"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kecepatan (Mbps)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={speedMbps}
                    onChange={(e) => setSpeedMbps(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Harga Bulanan (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    min="10000"
                    step="5000"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Deskripsi Paket
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Keterangan peruntukan paket..."
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Paket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
