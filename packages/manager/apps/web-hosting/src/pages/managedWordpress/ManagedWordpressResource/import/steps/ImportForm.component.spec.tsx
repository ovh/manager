import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect, it, beforeEach } from 'vitest';
import { useParams } from 'react-router-dom';
import { fireEvent, render, act, waitFor } from '@/utils/test.provider';
import ImportForm from './ImportForm.component';
import { postManagedCmsResourceWebsite } from '@/data/api/managedWordpress';

vi.hoisted(() => ({
  environment: {
    getUser: vi.fn(() => ({ ovhSubsidiary: 'FR' })),
  },
}));

vi.mock('@/data/api/managedWordpress', () => ({
  postManagedCmsResourceWebsite: vi.fn(() =>
    Promise.resolve({ id: 'mock-website-id' }),
  ),
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

  // @TODO: find why this test is inconsistent
  // sometimes ODS component return attribute empty while it can
  // only be "true" or "false"
  it.skip('should enable the submit button and make an API call on valid input for step 1', async () => {
    const { getByTestId } = render(<ImportForm />);

    const adminURLInput = getByTestId('input-admin-url') as any;
    const adminLoginInput = getByTestId('input-admin-login') as any;
    const adminPasswordInput = getByTestId('input-admin-password') as any;
    const submitButton = getByTestId('import-step1');

    await act(() => {
      fireEvent.input(adminURLInput, {
        target: { value: 'http://example.com' },
      });
      fireEvent.input(adminLoginInput, { target: { value: 'admin' } });
      fireEvent.input(adminPasswordInput, {
        target: { value: 'Password12345' },
      });
      adminURLInput.odsChange.emit({
        value: 'http://example.com',
      });
      adminLoginInput.odsChange.emit({
        value: 'admin',
      });
      adminPasswordInput.odsChange.emit({
        value: 'Password12345',
      });
    });
    await act(() => {
      fireEvent.click(submitButton);
    });

    expect(postManagedCmsResourceWebsite).toHaveBeenCalled();
  });

  // @TODO: find why this test is inconsistent
  // sometimes ODS component return attribute empty while it can
  // only be "true" or "false"
  it.skip('should render the form inputs and submit button for step 2', async () => {
    const { getByTestId, queryByTestId } = render(<ImportForm />);

    const adminURLInput = getByTestId('input-admin-url') as any;
    const adminLoginInput = getByTestId('input-admin-login') as any;
    const adminPasswordInput = getByTestId('input-admin-password') as any;
    const submitButton = getByTestId('import-step1');

    await act(async () => {
      fireEvent.input(adminURLInput, {
        target: { value: 'http://example.com' },
      });
      fireEvent.input(adminLoginInput, { target: { value: 'Test12345' } });
      fireEvent.input(adminPasswordInput, { target: { value: 'Test12345' } });
      adminURLInput.odsChange.emit({
        value: 'http://example.com',
      });
      adminLoginInput.odsChange.emit({
        value: 'Test12345',
      });
      adminPasswordInput.odsChange.emit({
        value: 'Test12345',
      });
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(postManagedCmsResourceWebsite).toHaveBeenCalled();

    await waitFor(() => {
      expect(queryByTestId('import-media')).toBeInTheDocument();
    });
  });
});
