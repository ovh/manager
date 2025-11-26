import React, { ComponentType } from 'react';

import { useParams } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import 'element-internals-polyfill';
import { I18nextProvider } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { postManagedCmsResourceWebsite } from '@/data/api/managedWordpress';
import { createWrapper, i18n } from '@/utils/test.provider';

import ImportForm from './ImportForm.component';

const testQueryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

const RouterWrapper = createWrapper();

const Wrappers = ({ children }: { children: React.ReactElement }) => {
  return (
    <RouterWrapper>
      <QueryClientProvider client={testQueryClient}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </QueryClientProvider>
    </RouterWrapper>
  );
};

vi.mock('@ovh-ux/muk', () => ({
  useNotifications: vi.fn(() => ({
    addSuccess: vi.fn(),
    addError: vi.fn(),
    addWarning: vi.fn(),
    addInfo: vi.fn(),
  })),
}));

vi.mock('@/data/api/managedWordpress', () => ({
  postManagedCmsResourceWebsite: vi.fn(() => Promise.resolve({ id: 'mock-website-id' })),
  putManagedCmsResourceWebsiteTasks: vi.fn(),
}));

vi.mock('@/data/api/hooks/managedWordpressWebsiteDetails', () => ({
  useManagedWordpressWebsiteDetails: vi.fn(),
}));

describe('ImportForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({ serviceName: 'test-service' });
  });

  it('should render the form inputs and submit button for step 1', () => {
    const { getByTestId } = render(<ImportForm />, { wrapper: Wrappers as ComponentType });
    expect(getByTestId('input-admin-url')).toBeInTheDocument();
    expect(getByTestId('input-admin-login')).toBeInTheDocument();
    expect(getByTestId('input-admin-password')).toBeInTheDocument();
    expect(getByTestId('import-step1')).toBeInTheDocument();
  });

  it.skip('should enable the submit button and make an API call on valid input for step 1', async () => {
    const { getByTestId } = render(<ImportForm />, { wrapper: Wrappers as ComponentType });

    const adminURLInput = getByTestId('input-admin-url') as HTMLInputElement;
    const adminLoginInput = getByTestId('input-admin-login') as HTMLInputElement;
    const adminPasswordInput = getByTestId('input-admin-password') as HTMLInputElement;
    const submitButton = getByTestId('import-step1');

    act(() => {
      fireEvent.input(adminURLInput, {
        target: { value: 'http://example.com' },
      });
      fireEvent.input(adminLoginInput, { target: { value: 'admin' } });
      fireEvent.input(adminPasswordInput, {
        target: { value: 'Password12345' },
      });
    });

    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(postManagedCmsResourceWebsite).toHaveBeenCalled();
    });
  });

  it.skip('should render the form inputs and submit button for step 2', async () => {
    const { getByTestId, queryByTestId } = render(<ImportForm />, {
      wrapper: Wrappers as ComponentType,
    });

    const adminURLInput = getByTestId('input-admin-url') as HTMLInputElement;
    const adminLoginInput = getByTestId('input-admin-login') as HTMLInputElement;
    const adminPasswordInput = getByTestId('input-admin-password') as HTMLInputElement;
    const submitButton = getByTestId('import-step1');

    act(() => {
      fireEvent.input(adminURLInput, {
        target: { value: 'http://example.com' },
      });
      fireEvent.input(adminLoginInput, { target: { value: 'Test12345' } });
      fireEvent.input(adminPasswordInput, { target: { value: 'Test12345' } });
    });

    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(postManagedCmsResourceWebsite).toHaveBeenCalled();
      expect(queryByTestId('import-media')).toBeInTheDocument();
    });
  });
});
