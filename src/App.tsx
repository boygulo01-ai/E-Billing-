import React, { useState, useEffect } from 'react';
import { Customer, WifiPackage, Invoice, BusinessProfile, WhatsAppTemplate, PaymentMethod } from './types';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { InvoiceList } from './components/InvoiceList';
import { PrintInvoiceModal } from './components/PrintInvoiceModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { BulkWhatsAppModal } from './components/BulkWhatsAppModal';
import { RecordPaymentModal } from './components/RecordPaymentModal';
import { NewInvoiceModal } from './components/NewInvoiceModal';
import { CustomerManagement } from './components/CustomerManagement';
import { PackageManagement } from './components/PackageManagement';
import { ClientSelfCheck } from './components/ClientSelfCheck';
import { BusinessSettingsModal } from './components/BusinessSettingsModal';

export default function App() {
  // Primary States loaded from Storage
  const [packages, setPackages] = useState<WifiPackage[]>(() => storageService.getPackages());
  const [customers, setCustomers] = useState<Customer[]>(() => storageService.getCustomers());
  const [invoices, setInvoices] = useState<Invoice[]>(() => storageService.getInvoices());
  const [profile, setProfile] = useState<BusinessProfile>(() => storageService.getProfile());
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(() => storageService.getTemplates());

  // UI Navigation
  const [activeTab, setActiveTab] = useState<'penagihan' | 'pelanggan' | 'paket' | 'portal_cek' | 'pengaturan'>('penagihan');

  // Modals
  const [printModalState, setPrintModalState] = useState<{
    isOpen: boolean;
    invoice: Invoice | null;
    autoPrint: boolean;
  }>({ isOpen: false, invoice: null, autoPrint: false });

  const [whatsAppModalState, setWhatsAppModalState] = useState<{
    isOpen: boolean;
    invoice: Invoice | null;
  }>({ isOpen: false, invoice: null });

  const [paymentModalState, setPaymentModalState] = useState<{
    isOpen: boolean;
    invoice: Invoice | null;
  }>({ isOpen: false, invoice: null });

  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [isBulkWhatsAppModalOpen, setIsBulkWhatsAppModalOpen] = useState(false);

  // Sync state to LocalStorage
  const reloadAllData = () => {
    setPackages(storageService.getPackages());
    setCustomers(storageService.getCustomers());
    setInvoices(storageService.getInvoices());
    setProfile(storageService.getProfile());
    setTemplates(storageService.getTemplates());
  };

  const updateInvoices = (newInvoices: Invoice[]) => {
    setInvoices(newInvoices);
    storageService.saveInvoices(newInvoices);
  };

  const updateCustomers = (newCustomers: Customer[]) => {
    setCustomers(newCustomers);
    storageService.saveCustomers(newCustomers);
  };

  const updatePackages = (newPackages: WifiPackage[]) => {
    setPackages(newPackages);
    storageService.savePackages(newPackages);
  };

  const updateProfile = (newProfile: BusinessProfile) => {
    setProfile(newProfile);
    storageService.saveProfile(newProfile);
  };

  const updateTemplates = (newTemplates: WhatsAppTemplate[]) => {
    setTemplates(newTemplates);
    storageService.saveTemplates(newTemplates);
  };

  // Handlers
  const handleTriggerPrint = (invoice: Invoice, autoPrint = false) => {
    setPrintModalState({ isOpen: true, invoice, autoPrint });
  };

  const handleTriggerWhatsApp = (invoice: Invoice) => {
    setWhatsAppModalState({ isOpen: true, invoice });
  };

  const handleTriggerPayment = (invoice: Invoice) => {
    setPaymentModalState({ isOpen: true, invoice });
  };

  const handleMarkAsSentWA = (invoiceId: string) => {
    const updated = invoices.map((inv) =>
      inv.id === invoiceId ? { ...inv, waSentAt: new Date().toISOString() } : inv
    );
    updateInvoices(updated);
  };

  const handleSavePayment = (
    invoiceId: string,
    method: PaymentMethod,
    collector: string,
    notes: string,
    receiptNumber: string
  ) => {
    const updated = invoices.map((inv) =>
      inv.id === invoiceId
        ? {
            ...inv,
            status: 'lunas' as const,
            paymentDate: new Date().toISOString().split('T')[0],
            paymentMethod: method,
            paymentCollector: collector,
            receiptNumber: receiptNumber,
            notes: notes,
          }
        : inv
    );
    updateInvoices(updated);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus faktur tagihan ini?')) {
      const updated = invoices.filter((i) => i.id !== invoiceId);
      updateInvoices(updated);
    }
  };

  const handleGenerateBulkInvoices = (newInvoices: Invoice[]) => {
    const combined = [...newInvoices, ...invoices];
    updateInvoices(combined);
  };

  const handleCreateSingleInvoice = (newInvoice: Invoice) => {
    updateInvoices([newInvoice, ...invoices]);
  };

  const handleSaveCustomer = (customer: Customer) => {
    const exists = customers.some((c) => c.id === customer.id);
    const updated = exists
      ? customers.map((c) => (c.id === customer.id ? customer : c))
      : [customer, ...customers];
    updateCustomers(updated);
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (confirm('Hapus data pelanggan ini? Tagihan terkait tetap tersimpan di riwayat.')) {
      const updated = customers.filter((c) => c.id !== customerId);
      updateCustomers(updated);
    }
  };

  const handleSavePackage = (pkg: WifiPackage) => {
    const exists = packages.some((p) => p.id === pkg.id);
    const updated = exists
      ? packages.map((p) => (p.id === pkg.id ? pkg : p))
      : [pkg, ...packages];
    updatePackages(updated);
  };

  const handleDeletePackage = (pkgId: string) => {
    if (confirm('Hapus paket internet ini?')) {
      const updated = packages.filter((p) => p.id !== pkgId);
      updatePackages(updated);
    }
  };

  const unpaidCount = invoices.filter((i) => i.status !== 'lunas').length;

  // Selected customer for Print & WA modals
  const selectedCustomerForPrint = printModalState.invoice
    ? customers.find((c) => c.id === printModalState.invoice?.customerId) || customers[0]
    : customers[0];

  const selectedPackageForPrint = selectedCustomerForPrint
    ? packages.find((p) => p.id === selectedCustomerForPrint.packageId)
    : undefined;

  const selectedCustomerForWA = whatsAppModalState.invoice
    ? customers.find((c) => c.id === whatsAppModalState.invoice?.customerId) || customers[0]
    : customers[0];

  const selectedPackageForWA = selectedCustomerForWA
    ? packages.find((p) => p.id === selectedCustomerForWA.packageId)
    : undefined;

  const selectedCustomerForPayment = paymentModalState.invoice
    ? customers.find((c) => c.id === paymentModalState.invoice?.customerId) || customers[0]
    : customers[0];

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col text-slate-900 font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewInvoice={() => setIsNewInvoiceModalOpen(true)}
        onOpenBulkWhatsApp={() => setIsBulkWhatsAppModalOpen(true)}
        unpaidCount={unpaidCount}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Tab 1: Penagihan & Invoice */}
        {activeTab === 'penagihan' && (
          <div className="space-y-6">
            <DashboardOverview
              invoices={invoices}
              customers={customers}
              onOpenNewInvoice={() => setIsNewInvoiceModalOpen(true)}
              onOpenBulkWhatsApp={() => setIsBulkWhatsAppModalOpen(true)}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Daftar Penagihan & Faktur Invoice
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  {invoices.length} Faktur Tercatat
                </span>
              </div>

              <InvoiceList
                invoices={invoices}
                customers={customers}
                packages={packages}
                onTriggerPrint={handleTriggerPrint}
                onTriggerWhatsApp={handleTriggerWhatsApp}
                onTriggerPayment={handleTriggerPayment}
                onDeleteInvoice={handleDeleteInvoice}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Data Pelanggan */}
        {activeTab === 'pelanggan' && (
          <CustomerManagement
            customers={customers}
            packages={packages}
            onSaveCustomer={handleSaveCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            onSelectCustomerForBill={(cust) => {
              setActiveTab('penagihan');
              setIsNewInvoiceModalOpen(true);
            }}
          />
        )}

        {/* Tab 3: Paket Internet */}
        {activeTab === 'paket' && (
          <PackageManagement
            packages={packages}
            customers={customers}
            onSavePackage={handleSavePackage}
            onDeletePackage={handleDeletePackage}
          />
        )}

        {/* Tab 4: Portal Cek Tagihan Mandiri */}
        {activeTab === 'portal_cek' && (
          <ClientSelfCheck
            customers={customers}
            packages={packages}
            invoices={invoices}
            profile={profile}
            onTriggerPrint={(inv) => handleTriggerPrint(inv, false)}
          />
        )}

        {/* Tab 5: Pengaturan Bisnis */}
        {activeTab === 'pengaturan' && (
          <BusinessSettingsModal
            profile={profile}
            templates={templates}
            onSaveProfile={updateProfile}
            onSaveTemplates={updateTemplates}
            onReloadAllData={reloadAllData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-5 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © 2026 {profile.companyName}. Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Sistem E-Billing & Penagihan WiFi RT/RW Net</span>
            <span>·</span>
            <span>Cetak Faktur Otomatis & Integrasi WhatsApp</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}

      {/* 1. Modal Cetak Invoice Otomatis */}
      {printModalState.isOpen && printModalState.invoice && (
        <PrintInvoiceModal
          isOpen={printModalState.isOpen}
          onClose={() => setPrintModalState({ isOpen: false, invoice: null, autoPrint: false })}
          invoice={printModalState.invoice}
          customer={selectedCustomerForPrint}
          pkg={selectedPackageForPrint}
          profile={profile}
          autoPrint={printModalState.autoPrint}
        />
      )}

      {/* 2. Modal Notifikasi WhatsApp */}
      {whatsAppModalState.isOpen && whatsAppModalState.invoice && (
        <WhatsAppModal
          isOpen={whatsAppModalState.isOpen}
          onClose={() => setWhatsAppModalState({ isOpen: false, invoice: null })}
          invoice={whatsAppModalState.invoice}
          customer={selectedCustomerForWA}
          pkg={selectedPackageForWA}
          profile={profile}
          templates={templates}
          onMarkAsSent={handleMarkAsSentWA}
        />
      )}

      {/* 3. Modal Blast / WhatsApp Massal */}
      {isBulkWhatsAppModalOpen && (
        <BulkWhatsAppModal
          isOpen={isBulkWhatsAppModalOpen}
          onClose={() => setIsBulkWhatsAppModalOpen(false)}
          invoices={invoices}
          customers={customers}
          packages={packages}
          profile={profile}
          templates={templates}
          onMarkAsSent={handleMarkAsSentWA}
        />
      )}

      {/* 4. Modal Catat Pembayaran */}
      {paymentModalState.isOpen && paymentModalState.invoice && (
        <RecordPaymentModal
          isOpen={paymentModalState.isOpen}
          onClose={() => setPaymentModalState({ isOpen: false, invoice: null })}
          invoice={paymentModalState.invoice}
          customer={selectedCustomerForPayment}
          onSavePayment={handleSavePayment}
          onTriggerPrint={(inv) => handleTriggerPrint(inv, true)}
          onTriggerWhatsApp={(inv) => handleTriggerWhatsApp(inv)}
        />
      )}

      {/* 5. Modal Buat Tagihan Baru */}
      {isNewInvoiceModalOpen && (
        <NewInvoiceModal
          isOpen={isNewInvoiceModalOpen}
          onClose={() => setIsNewInvoiceModalOpen(false)}
          customers={customers}
          packages={packages}
          profile={profile}
          existingInvoices={invoices}
          onGenerateBulk={handleGenerateBulkInvoices}
          onCreateSingle={handleCreateSingleInvoice}
        />
      )}
    </div>
  );
}
