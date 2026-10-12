import React, { useState, useEffect } from 'react';
import { Invoice, Customer, WifiPackage, BusinessProfile, PrintFormat } from '../types';
import { formatRupiah, formatTanggalIndo } from '../utils/formatters';
import { Printer, X, Copy, Check, FileText, Receipt, CheckCircle, AlertTriangle } from 'lucide-react';

interface PrintInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  customer: Customer;
  pkg?: WifiPackage;
  profile: BusinessProfile;
  initialFormat?: PrintFormat;
  autoPrint?: boolean;
}

export const PrintInvoiceModal: React.FC<PrintInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
  customer,
  pkg,
  profile,
  initialFormat = 'a4',
  autoPrint = false,
}) => {
  const [printFormat, setPrintFormat] = useState<PrintFormat>(initialFormat);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && autoPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoPrint]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `INVOICE MITRANET WIFI\nNo: ${invoice.invoiceNumber}\nPelanggan: ${customer.name} (${customer.customerCode})\nPaket: ${pkg?.name || 'WiFi'} (${pkg?.speedMbps} Mbps)\nPeriode: ${invoice.periodLabel}\nTotal: ${formatRupiah(invoice.totalAmount)}\nStatus: ${invoice.status.toUpperCase()}\nJatuh Tempo: ${formatTanggalIndo(invoice.dueDate)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPaid = invoice.status === 'lunas';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar (Hidden on print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-white">
                Cetak Invoice Otomatis
              </h3>
              <p className="text-xs text-slate-400">
                {invoice.invoiceNumber} · {customer.name}
              </p>
            </div>
          </div>

          {/* Format Selector & Actions */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-800 p-1 rounded-lg flex items-center gap-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setPrintFormat('a4')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  printFormat === 'a4'
                    ? 'bg-cyan-600 text-white shadow-xs font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Faktur A4</span>
              </button>
              <button
                type="button"
                onClick={() => setPrintFormat('thermal_80')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  printFormat === 'thermal_80'
                    ? 'bg-cyan-600 text-white shadow-xs font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Struk 80mm</span>
              </button>
              <button
                type="button"
                onClick={() => setPrintFormat('thermal_58')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  printFormat === 'thermal_58'
                    ? 'bg-cyan-600 text-white shadow-xs font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Struk 58mm</span>
              </button>
            </div>

            <button
              onClick={handleCopySummary}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Salin Rincian Teks"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Sekarang (Print)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content: Invoice Preview */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 flex justify-center">
          {/* Printable Area Wrapper with ID matching media query */}
          <div
            id="printable-invoice-container"
            className={`bg-white text-slate-900 transition-all ${
              printFormat === 'a4'
                ? 'w-full max-w-3xl p-8 rounded-lg shadow-sm border border-slate-200'
                : printFormat === 'thermal_80'
                ? 'w-[340px] p-4 rounded-lg shadow-sm border border-slate-300 font-mono text-xs'
                : 'w-[280px] p-3 rounded-lg shadow-sm border border-slate-300 font-mono text-xs'
            }`}
          >
            {/* FORMAT 1: A4 RESMI FAKTUR / INVOICE */}
            {printFormat === 'a4' && (
              <div className="space-y-6">
                {/* Header Kop Surat */}
                <div className="flex items-start justify-between border-b border-slate-200 pb-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={profile.logoUrl}
                      alt={profile.companyName}
                      className="w-16 h-16 rounded-lg object-contain border border-slate-100 p-1"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h1 className="text-xl font-bold tracking-tight text-slate-900">
                        {profile.companyName}
                      </h1>
                      <p className="text-xs text-slate-500 max-w-md mt-0.5 leading-relaxed">
                        {profile.address}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                        <span>Telp/WA: {profile.phone}</span>
                        <span>·</span>
                        <span>Email: {profile.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stamp / Status Box */}
                  <div className="text-right">
                    <div className="text-xs font-semibold tracking-wider uppercase text-slate-500">
                      FAKTUR PENAGIHAN WIFI
                    </div>
                    <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                      {invoice.invoiceNumber}
                    </div>
                    <div className="mt-2 inline-block">
                      {isPaid ? (
                        <div className="px-3 py-1 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 font-bold text-xs tracking-wider uppercase flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>LUNAS / TERBAYAR</span>
                        </div>
                      ) : (
                        <div className="px-3 py-1 bg-amber-50 border border-amber-300 rounded text-amber-800 font-bold text-xs tracking-wider uppercase flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>BELUM LUNAS</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Info Grid: Pelanggan & Detail Tagihan */}
                <div className="grid grid-cols-2 gap-6 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200/60">
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-600 uppercase tracking-wide">
                      Ditagihkan Kepada:
                    </span>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {customer.name}
                    </div>
                    <div className="text-slate-600 font-mono">
                      ID Pelanggan: <span className="font-semibold text-slate-800">{customer.customerCode}</span>
                    </div>
                    <div className="text-slate-600">
                      WhatsApp: <span className="font-mono">{customer.phone}</span>
                    </div>
                    <div className="text-slate-600">
                      Alamat/Wilayah: {customer.address} ({customer.cluster})
                    </div>
                    {customer.pppoeUsername && (
                      <div className="text-slate-500 text-[11px] font-mono">
                        User PPPoE: {customer.pppoeUsername} · IP: {customer.ipAddress || 'DHCP'}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 text-right">
                    <span className="font-semibold text-slate-600 uppercase tracking-wide">
                      Rincian Faktur:
                    </span>
                    <div className="text-slate-600 mt-0.5">
                      Periode Tagihan:{' '}
                      <span className="font-bold text-slate-800">
                        {invoice.periodLabel}
                      </span>
                    </div>
                    <div className="text-slate-600">
                      Tanggal Terbit:{' '}
                      <span className="font-medium text-slate-800">
                        {formatTanggalIndo(invoice.issueDate)}
                      </span>
                    </div>
                    <div className="text-slate-600">
                      Jatuh Tempo:{' '}
                      <span className="font-bold text-rose-700">
                        {formatTanggalIndo(invoice.dueDate)}
                      </span>
                    </div>
                    {isPaid && invoice.paymentDate && (
                      <div className="text-emerald-700 font-medium">
                        Dibayar: {formatTanggalIndo(invoice.paymentDate)} ({invoice.paymentMethod})
                      </div>
                    )}
                  </div>
                </div>

                {/* Tabel Rincian Biaya */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-4">Deskripsi Layanan</th>
                        <th className="py-2.5 px-4 text-center">Kecepatan</th>
                        <th className="py-2.5 px-4 text-center">Kuota</th>
                        <th className="py-2.5 px-4 text-right">Jumlah</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      <tr>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">
                            Langganan Internet WiFi Bulanan
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            {pkg?.name || 'Paket Internet'} - Periode {invoice.periodLabel}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-medium">
                          {pkg?.speedMbps || 20} Mbps
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-emerald-700 font-medium">Unlimited</span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-medium tabular-nums">
                          {formatRupiah(invoice.baseAmount)}
                        </td>
                      </tr>

                      {invoice.discount > 0 && (
                        <tr>
                          <td className="py-2 px-4 text-slate-600" colSpan={3}>
                            Potongan / Diskon Loyalitas Pelanggan
                          </td>
                          <td className="py-2 px-4 text-right font-mono text-rose-600 tabular-nums">
                            -{formatRupiah(invoice.discount)}
                          </td>
                        </tr>
                      )}

                      {invoice.adminFee > 0 && (
                        <tr>
                          <td className="py-2 px-4 text-slate-600" colSpan={3}>
                            Biaya Administrasi & Pemeliharaan Jaringan
                          </td>
                          <td className="py-2 px-4 text-right font-mono tabular-nums">
                            {formatRupiah(invoice.adminFee)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="bg-slate-50 border-t border-slate-200 text-xs">
                      <tr>
                        <td colSpan={3} className="py-3 px-4 text-right font-bold text-slate-900 uppercase">
                          Total Pembayaran:
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-base text-cyan-800 tabular-nums">
                          {formatRupiah(invoice.totalAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Footer Section: Rekening Bank & QRIS + Stempel */}
                <div className="grid grid-cols-2 gap-6 pt-2">
                  {/* Left: Payment Channels & QRIS */}
                  <div className="border border-slate-200 p-4 rounded-lg bg-slate-50/50 space-y-3">
                    <div className="font-semibold text-xs text-slate-800 uppercase tracking-wide">
                      Saluran Pembayaran Resmi:
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="space-y-1.5 text-xs text-slate-700 flex-1">
                        {profile.bankAccounts.map((acc, idx) => (
                          <div key={idx} className="bg-white p-2 rounded border border-slate-200/80">
                            <div className="text-[11px] text-slate-500 font-medium">{acc.bankName}</div>
                            <div className="font-mono font-bold text-slate-900">{acc.accountNumber}</div>
                            <div className="text-[10px] text-slate-500">a.n {acc.accountHolder}</div>
                          </div>
                        ))}
                      </div>

                      {/* QRIS code */}
                      <div className="w-24 text-center shrink-0">
                        <img
                          src={profile.qrisImageUrl}
                          alt="QRIS Payment"
                          className="w-24 h-24 object-contain rounded border border-slate-300 bg-white p-1 shadow-2xs"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[10px] font-bold text-slate-600 block mt-1">
                          Scan QRIS
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Signature & Stamp */}
                  <div className="flex flex-col justify-between text-right p-2">
                    <div className="text-xs text-slate-600">
                      Cibinong, {formatTanggalIndo(invoice.issueDate)}
                      <div className="font-semibold text-slate-900 mt-1">
                        Finance & Billing Department
                      </div>
                    </div>

                    {/* Official Stamp */}
                    <div className="my-2 flex justify-end">
                      {isPaid ? (
                        <div className="border-2 border-dashed border-emerald-600 rounded-lg px-4 py-2 text-center text-emerald-700 bg-emerald-50/80 -rotate-3">
                          <div className="text-xs font-bold uppercase tracking-widest">
                            LUNAS / PAID
                          </div>
                          <div className="text-[10px] font-mono">
                            {invoice.receiptNumber || 'VERIFIED ELECTRONIC'}
                          </div>
                          <div className="text-[9px] text-slate-500">
                            {formatTanggalIndo(invoice.paymentDate)}
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-rose-500 rounded-lg px-4 py-2 text-center text-rose-700 bg-rose-50/80 -rotate-2">
                          <div className="text-xs font-bold uppercase tracking-widest">
                            TAGIHAN RESMI
                          </div>
                          <div className="text-[10px] font-mono">
                            HARAP DIBAYAR TEPAT WAKTU
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-slate-700 font-medium border-t border-slate-200 pt-2 inline-block">
                      {profile.companyName}
                    </div>
                  </div>
                </div>

                {/* Syarat & Ketentuan */}
                <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 leading-normal">
                  <span className="font-semibold">Catatan:</span> {profile.terms} Simpan bukti invoice ini sebagai dokumen penagihan dan bukti pembayaran sah.
                </div>
              </div>
            )}

            {/* FORMAT 2 & 3: STRUK KASIR THERMAL (58mm / 80mm) */}
            {(printFormat === 'thermal_80' || printFormat === 'thermal_58') && (
              <div className="text-slate-900 font-mono text-[11px] leading-tight space-y-2">
                <div className="text-center space-y-0.5">
                  <div className="font-bold text-sm tracking-tight">{profile.companyName}</div>
                  <div className="text-[10px] text-slate-600">{profile.address}</div>
                  <div className="text-[10px] text-slate-600">CS / WA: {profile.phone}</div>
                </div>

                <div className="border-b border-dashed border-slate-400 my-1"></div>

                <div className="flex justify-between">
                  <span>No. Inv:</span>
                  <span className="font-bold">{invoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tanggal:</span>
                  <span>{invoice.issueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pelanggan:</span>
                  <span className="font-bold text-right truncate max-w-[140px]">{customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>ID Pelanggan:</span>
                  <span>{customer.customerCode}</span>
                </div>
                <div className="flex justify-between">
                  <span>Wilayah:</span>
                  <span className="text-right truncate max-w-[140px]">{customer.cluster}</span>
                </div>

                <div className="border-b border-dashed border-slate-400 my-1"></div>

                {/* Item Line */}
                <div className="space-y-1">
                  <div className="font-bold">
                    {pkg?.name || 'Paket WiFi'} ({pkg?.speedMbps}M)
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600">
                    <span>Periode {invoice.periodLabel}</span>
                    <span>{formatRupiah(invoice.baseAmount)}</span>
                  </div>
                </div>

                {invoice.discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Diskon</span>
                    <span>-{formatRupiah(invoice.discount)}</span>
                  </div>
                )}

                {invoice.adminFee > 0 && (
                  <div className="flex justify-between">
                    <span>Biaya Admin</span>
                    <span>{formatRupiah(invoice.adminFee)}</span>
                  </div>
                )}

                <div className="border-b border-dashed border-slate-400 my-1"></div>

                <div className="flex justify-between text-xs font-bold">
                  <span>TOTAL:</span>
                  <span>{formatRupiah(invoice.totalAmount)}</span>
                </div>

                <div className="flex justify-between font-semibold">
                  <span>STATUS:</span>
                  <span className={isPaid ? 'text-emerald-700' : 'text-rose-700'}>
                    {isPaid ? '*** LUNAS ***' : 'BELUM LUNAS'}
                  </span>
                </div>

                {isPaid && (
                  <>
                    <div className="flex justify-between text-[10px]">
                      <span>Metode:</span>
                      <span>{invoice.paymentMethod || 'Cash'}</span>
                    </div>
                    {invoice.paymentDate && (
                      <div className="flex justify-between text-[10px]">
                        <span>Tgl Bayar:</span>
                        <span>{invoice.paymentDate}</span>
                      </div>
                    )}
                    {invoice.receiptNumber && (
                      <div className="flex justify-between text-[10px]">
                        <span>No. Kwitansi:</span>
                        <span>{invoice.receiptNumber}</span>
                      </div>
                    )}
                  </>
                )}

                {!isPaid && (
                  <div className="bg-slate-100 p-2 rounded text-[10px] my-1 text-center">
                    <div>Jatuh Tempo: {invoice.dueDate}</div>
                    <div className="font-bold mt-1">BCA: 8830-192-881</div>
                  </div>
                )}

                <div className="border-b border-dashed border-slate-400 my-1"></div>

                <div className="text-center text-[10px] space-y-0.5 pt-1 text-slate-600">
                  <div>Terima kasih atas kepercayaan Anda</div>
                  <div>Simpan struk ini sebagai bukti pembayaran</div>
                  <div>Internet Cepat & Tanpa Gangguan</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
