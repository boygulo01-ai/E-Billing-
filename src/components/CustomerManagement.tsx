import React, { useState } from 'react';
import { Customer, WifiPackage, CustomerStatus } from '../types';
import { formatRupiah, formatTanggalIndo } from '../utils/formatters';
import {
  UserPlus,
  Search,
  Edit2,
  Trash2,
  Wifi,
  Phone,
  X,
  Check,
  Power,
} from 'lucide-react';

interface CustomerManagementProps {
  customers: Customer[];
  packages: WifiPackage[];
  onSaveCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  onSelectCustomerForBill: (customer: Customer) => void;
}

export const CustomerManagement: React.FC<CustomerManagementProps> = ({
  customers,
  packages,
  onSaveCustomer,
  onDeleteCustomer,
  onSelectCustomerForBill,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'semua' | CustomerStatus>('semua');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState<Partial<Customer>>({
    customerCode: '',
    name: '',
    phone: '',
    address: '',
    cluster: '',
    packageId: packages[0]?.id || '',
    ipAddress: '',
    pppoeUsername: '',
    installedDate: new Date().toISOString().split('T')[0],
    dueDateDay: 10,
    status: 'aktif',
    notes: '',
  });

  const handleOpenAdd = () => {
    const nextCode = `CUST-${100 + customers.length + 1}`;
    setEditingCustomer(null);
    setFormData({
      customerCode: nextCode,
      name: '',
      phone: '',
      address: '',
      cluster: 'Cluster Mawar (ODP-01)',
      packageId: packages[1]?.id || packages[0]?.id || '',
      ipAddress: '192.168.10.50',
      pppoeUsername: '',
      installedDate: new Date().toISOString().split('T')[0],
      dueDateDay: 10,
      status: 'aktif',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Customer) => {
    setEditingCustomer(c);
    setFormData(c);
    setIsModalOpen(true);
  };

  const handleToggleIsolir = (c: Customer) => {
    const nextStatus: CustomerStatus = c.status === 'isolir' ? 'aktif' : 'isolir';
    onSaveCustomer({
      ...c,
      status: nextStatus,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const finalCustomer: Customer = {
      id: editingCustomer ? editingCustomer.id : `cust-${Date.now()}`,
      customerCode: formData.customerCode || `CUST-${Date.now()}`,
      name: formData.name,
      phone: formData.phone,
      address: formData.address || '',
      cluster: formData.cluster || 'Cluster Mawar',
      packageId: formData.packageId || packages[0]?.id || '',
      ipAddress: formData.ipAddress,
      pppoeUsername: formData.pppoeUsername,
      installedDate: formData.installedDate || new Date().toISOString().split('T')[0],
      dueDateDay: Number(formData.dueDateDay) || 10,
      status: formData.status || 'aktif',
      notes: formData.notes,
    };

    onSaveCustomer(finalCustomer);
    setIsModalOpen(false);
  };

  const filtered = customers.filter((c) => {
    if (statusFilter !== 'semua' && c.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.customerCode.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.cluster.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Data & Langganan Pelanggan WiFi
          </h2>
          <p className="text-xs text-slate-500">
            Kelola data router, nomor WhatsApp, paket langganan, dan status isolir pelanggan.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Tambah Pelanggan Baru</span>
        </button>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg text-xs font-medium">
            <button
              onClick={() => setStatusFilter('semua')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'semua' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              Semua ({customers.length})
            </button>
            <button
              onClick={() => setStatusFilter('aktif')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'aktif' ? 'bg-white text-emerald-900 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              Aktif ({customers.filter((c) => c.status === 'aktif').length})
            </button>
            <button
              onClick={() => setStatusFilter('isolir')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'isolir' ? 'bg-white text-rose-900 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              Isolir ({customers.filter((c) => c.status === 'isolir').length})
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari pelanggan, no hp, kode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">ID & Nama Pelanggan</th>
                <th className="py-3 px-4">Kontak WhatsApp</th>
                <th className="py-3 px-4">Paket Langganan</th>
                <th className="py-3 px-4">Wilayah / Cluster</th>
                <th className="py-3 px-4">Jatuh Tempo</th>
                <th className="py-3 px-4 text-center">Status Jaringan</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => {
                const pkg = packages.find((p) => p.id === c.packageId);
                const isIsolir = c.status === 'isolir';

                return (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                        <span className="font-semibold text-slate-700">{c.customerCode}</span>
                        {c.pppoeUsername && <span>· PPPoE: {c.pppoeUsername}</span>}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{c.phone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900 flex items-center gap-1">
                        <Wifi className="w-3 h-3 text-cyan-600" />
                        <span>{pkg?.name || 'Paket WiFi'}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {pkg ? formatRupiah(pkg.price) : '-'} / bln
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800">{c.cluster}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {c.address}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">
                        Tgl {c.dueDateDay} tiap bulan
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Pasang: {formatTanggalIndo(c.installedDate)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleIsolir(c)}
                        title={isIsolir ? 'Klik untuk aktifkan kembali' : 'Klik untuk isolir jaringan'}
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                          isIsolir
                            ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        <span>{isIsolir ? 'Terisolir' : 'Aktif'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectCustomerForBill(c)}
                          title="Buat Tagihan Pelanggan Ini"
                          className="px-2 py-1 text-[11px] font-semibold text-cyan-700 hover:text-cyan-800 hover:bg-cyan-50 border border-cyan-200 rounded-md transition-colors cursor-pointer"
                        >
                          Tagih
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(c)}
                          title="Edit Pelanggan"
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteCustomer(c.id)}
                          title="Hapus Pelanggan"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Customer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <h3 className="text-sm font-semibold tracking-tight text-white">
                {editingCustomer ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kode / ID Pelanggan
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerCode}
                    onChange={(e) => setFormData({ ...formData, customerCode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    No. WhatsApp Pelanggan
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="081234567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Lengkap Pelanggan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Budi Santoso"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Paket Internet
                  </label>
                  <select
                    value={formData.packageId}
                    onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} ({pkg.speedMbps} Mbps) - {formatRupiah(pkg.price)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jatuh Tempo (Tgl Bulanan)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="28"
                    value={formData.dueDateDay}
                    onChange={(e) => setFormData({ ...formData, dueDateDay: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Wilayah / Cluster / ODP
                </label>
                <input
                  type="text"
                  placeholder="Misal: Cluster Mawar (ODP-MWR-02)"
                  value={formData.cluster}
                  onChange={(e) => setFormData({ ...formData, cluster: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Rumah / Lokasi
                </label>
                <input
                  type="text"
                  placeholder="Jl. Merpati No. 14, RT 01 / RW 04"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Username PPPoE (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.pppoeUsername}
                    onChange={(e) => setFormData({ ...formData, pppoeUsername: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    IP Address Router (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.ipAddress}
                    onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Catatan Tambahan (ONT / Kabel / Dropcore)
                </label>
                <input
                  type="text"
                  placeholder="Misal: ONT Huawei HG8245H5, dropcore 70m"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                  <span>Simpan Data</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
