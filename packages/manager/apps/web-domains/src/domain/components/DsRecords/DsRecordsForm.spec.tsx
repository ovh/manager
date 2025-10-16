import '@/common/setupTests';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import React from 'react';

import DsRecordsForm from '@/domain/components/DsRecords/DsRecordsForm';
import { TDnssecConfiguration } from '@/domain/types/dnssecConfiguration';
import { FormProvider, useForm } from 'react-hook-form';
import { getPublicKeyError } from '@/domain/utils/utils';

vi.mock('@/domain/utils/utils', () => ({
  getPublicKeyError: vi.fn(),
}));

const supportedAlgorithms: TDnssecConfiguration['supportedAlgorithms'] = [
  { name: 'RSASHA256', number: 8 },
  { name: 'RSASHA1-NSEC3-SHA1', number: 7 },
];

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      keyTag: '',
      flags: 257,
      algorithm: 8,
      publicKey: '',
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('DsRecordsForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getPublicKeyError).mockReturnValue('');
  });

  it('rend les champs principaux avec leurs labels', () => {
    render(<DsRecordsForm supportedAlgorithms={supportedAlgorithms} />, {
      wrapper: Wrapper,
    });

    expect(
      screen.getByText('domain_dsrecords_table_header_keyTag'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('domain_dsrecords_table_header_flags'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('domain_dsrecords_table_header_algo'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('domain_dsrecords_table_header_publicKey'),
    ).toBeInTheDocument();
  });

  it('Display an error when keyTag input is empty', async () => {
    render(<DsRecordsForm supportedAlgorithms={supportedAlgorithms} />, {
      wrapper: Wrapper,
    });

    const keyTagInput = screen.getByPlaceholderText('32456');

    fireEvent.change(keyTagInput, { target: { value: '123' } });
    fireEvent.change(keyTagInput, { target: { value: '' } });

    await waitFor(() => {
      expect(
        screen.getByText('domain_tab_dsrecords_drawer_form_error_empty'),
      ).toBeInTheDocument();
    });
  });

  it('Display the getPublicKeyError error', async () => {
    vi.mocked(getPublicKeyError).mockImplementation((value: string) => {
      return value === 'invalid'
        ? 'domain_tab_dsrecords_drawer_form_publicKey_error'
        : '';
    });

    render(<DsRecordsForm supportedAlgorithms={supportedAlgorithms} />, {
      wrapper: Wrapper,
    });

    const textarea = screen.getByPlaceholderText(
      'SreztregdhtfjghkvjbhlNcqityzfEZFjyfchgvkliYHELVBQSFHCJVD',
    );

    fireEvent.change(textarea, { target: { value: 'invalid' } });

    await waitFor(() => {
      expect(
        screen.getByText('domain_tab_dsrecords_drawer_form_publicKey_error'),
      ).toBeInTheDocument();
    });
  });

  it('no error when getPublicKeyError input is valid', async () => {
    vi.mocked(getPublicKeyError).mockReturnValue('');

    render(<DsRecordsForm supportedAlgorithms={supportedAlgorithms} />, {
      wrapper: Wrapper,
    });

    const textarea = screen.getByPlaceholderText(
      'SreztregdhtfjghkvjbhlNcqityzfEZFjyfchgvkliYHELVBQSFHCJVD',
    );

    fireEvent.change(textarea, { target: { value: 'valid-key' } });

    await waitFor(() => {
      expect(
        screen.queryByText('domain_tab_dsrecords_drawer_form_publicKey_error'),
      ).not.toBeInTheDocument();
    });
  });
});
