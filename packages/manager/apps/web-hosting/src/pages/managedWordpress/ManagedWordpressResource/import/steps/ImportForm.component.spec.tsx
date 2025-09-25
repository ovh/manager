import React from 'react';

import { useParams } from 'react-router-dom';

import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { postManagedCmsResourceWebsite } from '@/data/api/managedWordpress';
import { act, fireEvent, render, waitFor } from '@/utils/test.provider';

import ImportForm from './ImportForm.component';

vi.hoisted(() => ({
  environment: {
    getUser: vi.fn(() => ({ ovhSubsidiary: 'FR' })),
  },
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
    const { getByTestId } = render(<ImportForm />);
    expect(getByTestId('input-admin-url')).toBeInTheDocument();
    expect(getByTestId('input-admin-login')).toBeInTheDocument();
    expect(getByTestId('input-admin-password')).toBeInTheDocument();
    expect(getByTestId('import-step1')).toBeInTheDocument();
  });

  it.skip('should enable the submit button and make an API call on valid input for step 1', async () => {
    const { getByTestId } = render(<ImportForm />);

    const adminURLInput = getByTestId('input-admin-url') as HTMLInputElement;
    const adminLoginInput = getByTestId('input-admin-login') as HTMLInputElement;
    const adminPasswordInput = getByTestId('input-admin-password') as HTMLInputElement;
    const submitButton = getByTestId('import-step1');

    act(() => {
      fireEvent.input(adminURLInput, { target: { value: 'http://example.com' } });
      fireEvent.input(adminLoginInput, { target: { value: 'admin' } });
      fireEvent.input(adminPasswordInput, { target: { value: 'Password12345' } });
    });

    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(postManagedCmsResourceWebsite).toHaveBeenCalled();
    });
  });

  it.skip('should render the form inputs and submit button for step 2', async () => {
    const { getByTestId, queryByTestId } = render(<ImportForm />);

    const adminURLInput = getByTestId('input-admin-url') as HTMLInputElement;
    const adminLoginInput = getByTestId('input-admin-login') as HTMLInputElement;
    const adminPasswordInput = getByTestId('input-admin-password') as HTMLInputElement;
    const submitButton = getByTestId('import-step1');

    act(() => {
      fireEvent.input(adminURLInput, { target: { value: 'http://example.com' } });
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
