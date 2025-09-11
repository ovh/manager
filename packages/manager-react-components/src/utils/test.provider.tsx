import React, { ComponentType } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import 'element-internals-polyfill';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      datagrid: {
        common_pagination_load_more: 'Load more',
        common_pagination_load_all: 'Load all',
        common_pagination_of: 'of',
        common_pagination_results: 'results',
        common_pagination_no_results: 'No result',
        common_clipboard_success_label: 'Copied!',
        common_clipboard_error_label: 'Copy error.',
        common_empty_text_cell: 'None',
        common_topbar_columns: 'Columns',
        common_topbar_columns_select_all: 'Select all',
      },
    },
  },
});

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

const Wrappers = ({ children }: { children: React.ReactElement }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.JSX.Element,
  options?: Omit<RenderOptions, 'queries'>,
): RenderResult =>
  render(ui, { wrapper: Wrappers as ComponentType, ...options });

export { customRender as render };
