import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialTransactions } from './mockData';

export type Role = 'Viewer' | 'Admin';
export type Theme = 'light' | 'dark' | 'system';
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: TransactionType;
  amount: number;
  status?: string;
}

export interface Filters {
  search: string;
  category: string;
  type: string;
  sortBy: string;
  dateRange: 'all' | 'this_month' | 'last_month' | 'last_3_months';
}

export interface ProfileSettings {
  entityName: string;
  registeredAddress: string;
}

export interface SecuritySettings {
  twoFactor: boolean;
  auditLogAccess: boolean;
}

export interface PreferenceSettings {
  currency: string;
  fiscalYearStart: string;
}

interface AppState {
  transactions: Transaction[];
  role: Role;
  theme: Theme;
  filters: Filters;
  profile: ProfileSettings;
  security: SecuritySettings;
  preferences: PreferenceSettings;
  
  // Actions
  setRole: (role: Role) => void;
  setTheme: (theme: Theme) => void;
  setFilters: (filters: Partial<Filters>) => void;
  setProfile: (profile: Partial<ProfileSettings>) => void;
  setSecurity: (security: Partial<SecuritySettings>) => void;
  setPreferences: (preferences: Partial<PreferenceSettings>) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  resetData: () => void;
}

const defaultFilters: Filters = {
  search: '',
  category: 'all',
  type: 'all',
  sortBy: 'date_desc',
  dateRange: 'all'
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      transactions: initialTransactions,
      role: 'Admin',
      theme: 'system',
      filters: defaultFilters,
      profile: {
        entityName: 'Zorvyn Global LLC',
        registeredAddress: '800 Financial District, New York, NY 10004',
      },
      security: {
        twoFactor: true,
        auditLogAccess: false,
      },
      preferences: {
        currency: 'USD',
        fiscalYearStart: 'jan',
      },
      
      setRole: (role) => set({ role }),
      setTheme: (theme) => set({ theme }),
      setFilters: (newFilters) => 
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),
      setProfile: (newProfile) =>
        set((state) => ({ profile: { ...state.profile, ...newProfile } })),
      setSecurity: (newSecurity) =>
        set((state) => ({ security: { ...state.security, ...newSecurity } })),
      setPreferences: (newPrefs) =>
        set((state) => ({ preferences: { ...state.preferences, ...newPrefs } })),
        
      addTransaction: (tx) => 
        set((state) => ({
          transactions: [
            { ...tx, id: `tx-${Date.now()}` },
            ...state.transactions,
          ],
        })),
        
      editTransaction: (id, updatedTx) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...updatedTx } : tx
          ),
        })),
        
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        })),
        
      resetData: () => set({ transactions: initialTransactions, filters: defaultFilters }),
    }),
    {
      name: 'finance-dashboard-storage',
    }
  )
);
