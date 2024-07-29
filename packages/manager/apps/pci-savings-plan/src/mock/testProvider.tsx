import { render, RenderOptions, RenderResult } from '@testing-library/react';
import i18n from 'i18next';
import { vi } from 'vitest';
import React, { ComponentType } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import createTrans from '../../public/translations/create/Messages_fr_FR.json';
import { queryClient } from '@/App';
import 'element-internals-polyfill';

const ns = ['create'];

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal();
  return actual;
});

i18n.use(initReactI18next).init({
  lng: 'fr',
  fallbackLng: 'fr',
  resources: {
    fr: {
      create: createTrans,
    },
  },
  fallbackNS: ns,
  ns,
});

const Wrappers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <I18nextProvider i18n={i18n as any}>{children}</I18nextProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.JSX.Element,
  options?: Omit<RenderOptions, 'queries'>,
): RenderResult =>
  render(ui, { wrapper: Wrappers as ComponentType, ...options });

export * from '@testing-library/react';

export { customRender as render };
