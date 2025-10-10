/**
 * Test wrapper for ShellContext + React Query
 * -------------------------------------------
 * Why this exists:
 * - In unit tests, components/hooks from `@ovh-ux/manager-react-components` read the
 *   Shell context (e.g. `environment.getUser()`, `environment.getRegion()`).
 * - When no Provider is mounted (or a different module instance is resolved due to
 *   workspace hoisting), `useContext(ShellContext)` returns `undefined`, causing
 *   runtime errors in tests (e.g. "context?.environment?.getUser is not a function").
 *
 * What we do here:
 * - Provide a **real** `Environment` instance from `@ovh-ux/manager-config`
 *   and populate it synchronously using `env.setUser(...)` and `env.setRegion(...)`.
 *   This satisfies the library’s types: `Environment#getUser(): User` and
 *   `Environment#getRegion(): Region` are **sync** and strongly typed.
 * - Stub a minimal `ShellClientApi` (emit/on/off/once/getPlugin/setPlugin/loadPlugin)
 *   to satisfy `ShellContextType['shell']`. Add more stubs here if tests call them.
 * - Wrap tests with `<ShellContext.Provider value={...}>` and a fresh
 *   `<QueryClientProvider>` so components have both Shell and React Query context.
 */
import React from 'react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ShellContext, type ShellContextType } from '@ovh-ux/manager-react-shell-client';
import { Environment, Region, User } from '@ovh-ux/manager-config';

const defaultRegion = 'EU' as Region;

const makeUser = (overrides: Partial<User> = {}): User => ({
  phoneCountry: 'FR' as any,
  birthDay: '1990-01-01',
  phone: '+33123456789',
  nichandle: 'pc12345-ovh',
  email: 'user@example.com',
  legalform: 'individual' as any,
  language: 'en_GB' as any,
  area: 'IDF',
  state: '',
  currency: {
    symbol: '€',
    code: 'EUR',
    format: '€0,0.00',
  },
  organisation: '',
  sex: 'F',
  customerCode: 'CUST-001',
  name: 'Doe',
  nationalIdentificationNumber: '',
  vat: '',
  firstname: 'Jane',
  city: 'Paris',
  ovhSubsidiary: 'EU' as any,
  country: 'FR' as any,
  fax: '',
  corporationType: '',
  ovhCompany: 'ovh',
  companyNationalIdentificationNumber: '',
  zip: '75000',
  birthCity: 'Paris',
  address: '1 rue de Test, 75000 Paris',
  spareEmail: 'user+alt@example.com',
  italianSDI: '',
  supportLevel: { level: 'standard' },
  certificates: [],
  auth: {
    account: 'acc-1',
    allowedRoutes: [],
    identities: [],
    method: 'password',
    roles: [],
  },
  isTrusted: true,
  enterprise: false,
  kycValidated: true,
  ...overrides,
});

const makeEnvironment = (overrides?: Partial<Environment>) => {
  const env = new Environment();
  env.setRegion(defaultRegion);
  env.setUser(makeUser());
  Object.assign(env, overrides);
  return env;
};

const makeShellClientApi = (overrides?: Partial<ShellContextType['shell']>) =>
  ({
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    once: vi.fn(),
    getPlugin: vi.fn(),
    setPlugin: vi.fn(),
    loadPlugin: vi.fn(),
    ...overrides,
  } as any);

export const createWrapper = (overrides: Partial<ShellContextType> = {}) => {
  const qc = new QueryClient();

  const value: ShellContextType = {
    environment: makeEnvironment(),
    shell: makeShellClientApi() as any,
    ...overrides,
  };

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>
      <ShellContext.Provider value={value}>{children}</ShellContext.Provider>
    </QueryClientProvider>
  );
};
