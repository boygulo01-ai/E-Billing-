import { Customer, WifiPackage, Invoice, BusinessProfile, WhatsAppTemplate } from '../types';
import {
  INITIAL_PACKAGES,
  INITIAL_CUSTOMERS,
  INITIAL_INVOICES,
  INITIAL_BUSINESS_PROFILE,
  INITIAL_WHATSAPP_TEMPLATES,
} from '../data/initialData';

const STORAGE_KEYS = {
  PACKAGES: 'mitranet_wifi_packages',
  CUSTOMERS: 'mitranet_wifi_customers',
  INVOICES: 'mitranet_wifi_invoices',
  PROFILE: 'mitranet_wifi_profile',
  TEMPLATES: 'mitranet_wifi_templates',
};

export const storageService = {
  getPackages(): WifiPackage[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PACKAGES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(INITIAL_PACKAGES));
      return INITIAL_PACKAGES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PACKAGES;
    }
  },

  savePackages(packages: WifiPackage[]): void {
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
  },

  getCustomers(): Customer[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CUSTOMERS;
    }
  },

  saveCustomers(customers: Customer[]): void {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  },

  getInvoices(): Invoice[] {
    const raw = localStorage.getItem(STORAGE_KEYS.INVOICES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(INITIAL_INVOICES));
      return INITIAL_INVOICES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_INVOICES;
    }
  },

  saveInvoices(invoices: Invoice[]): void {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  },

  getProfile(): BusinessProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_BUSINESS_PROFILE));
      return INITIAL_BUSINESS_PROFILE;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_BUSINESS_PROFILE;
    }
  },

  saveProfile(profile: BusinessProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  getTemplates(): WhatsAppTemplate[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(INITIAL_WHATSAPP_TEMPLATES));
      return INITIAL_WHATSAPP_TEMPLATES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_WHATSAPP_TEMPLATES;
    }
  },

  saveTemplates(templates: WhatsAppTemplate[]): void {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  },

  resetAll(): void {
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(INITIAL_PACKAGES));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(INITIAL_INVOICES));
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_BUSINESS_PROFILE));
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(INITIAL_WHATSAPP_TEMPLATES));
  },

  exportBackupJson(): string {
    const data = {
      packages: this.getPackages(),
      customers: this.getCustomers(),
      invoices: this.getInvoices(),
      profile: this.getProfile(),
      templates: this.getTemplates(),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  },

  importBackupJson(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.packages && parsed.customers && parsed.invoices) {
        this.savePackages(parsed.packages);
        this.saveCustomers(parsed.customers);
        this.saveInvoices(parsed.invoices);
        if (parsed.profile) this.saveProfile(parsed.profile);
        if (parsed.templates) this.saveTemplates(parsed.templates);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
};
