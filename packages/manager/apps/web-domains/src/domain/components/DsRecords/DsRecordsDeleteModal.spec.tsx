import '@/common/setupTests';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { mockAddSuccess, mockAddError } from '@/common/setupTests';

import DsRecordsDeleteModal from '@/domain/components/DsRecords/DsRecordsDeleteModal';
import { supportedAlgorithms } from '@/domain/constants/dsRecords';
import { useUpdateDomainResource } from '@/domain/hooks/data/query';
import { wrapper } from '@/common/utils/test.provider';

const updateDomain = vi.fn();
const setIsModalOpen = vi.fn();

vi.mock('@/domain/hooks/data/query', () => ({
  useUpdateDomainResource: vi.fn(),
}));

const domainResource = {
  checksum: 'xyz',
  targetSpec: {
    dnssecConfiguration: {
      dnssecSupported: true,
      dsData: [
        {
          algorithm: supportedAlgorithms[0].number,
          keyTag: 0,
          flags: 257,
          publicKey: 'publicKey-0',
        },
        {
          algorithm: supportedAlgorithms[1].number,
          keyTag: 1,
          flags: 257,
          publicKey: 'publicKey-1',
        },
      ],
      supportedAlgorithms,
    },
  },
} as any;

const baseProps = {
  isModalOpen: true,
  serviceName: 'foobar',
  keyTag: 0,
  domainResource,
  setIsModalOpen,
};

describe('DsRecordsDeleteModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUpdateDomainResource).mockReturnValue({
      updateDomain,
      isUpdateDomainPending: false,
    } as any);
  });

  it('renders modal with correct heading', () => {
    render(<DsRecordsDeleteModal {...baseProps} />, { wrapper });

    expect(
      screen.getByText('domain_tab_dsrecords_modal_delete_title'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('calls updateDomain with filtered dsData on delete click', () => {
    render(<DsRecordsDeleteModal {...baseProps} />, { wrapper });

    fireEvent.click(screen.getByRole('button', { name: /actions:delete/i }));

    expect(updateDomain).toHaveBeenCalledTimes(1);

    const call = updateDomain.mock.calls[0][0];

    expect(call.currentTargetSpec).toEqual(domainResource.targetSpec);

    const { dsData } = call.updatedSpec.dnssecConfiguration;

    expect(dsData).toEqual([
      {
        algorithm: supportedAlgorithms[1].number,
        keyTag: 1,
        flags: 257,
        publicKey: 'publicKey-1',
      },
    ]);
  });

  it('calls addSuccess and closes modal on delete success', () => {
    render(<DsRecordsDeleteModal {...baseProps} />, { wrapper });

    fireEvent.click(screen.getByRole('button', { name: /actions:delete/i }));

    const { onSuccess, onSettled } = updateDomain.mock.calls[0][1];

    onSuccess();
    onSettled();

    expect(mockAddSuccess).toHaveBeenCalledTimes(1);
    expect(mockAddSuccess).toHaveBeenCalledWith(
      'domain_tab_dsrecords_modal_delete_success_message',
    );
    expect(setIsModalOpen).toHaveBeenCalledWith(false);
  });

  it('calls addError and closes modal on delete error', () => {
    render(<DsRecordsDeleteModal {...baseProps} />, { wrapper });

    fireEvent.click(screen.getByRole('button', { name: /actions:delete/i }));

    const { onError, onSettled } = updateDomain.mock.calls[0][1];

    onError();
    onSettled();

    expect(mockAddError).toHaveBeenCalledTimes(1);
    expect(mockAddError).toHaveBeenCalledWith(
      'domain_tab_dsrecords_modal_delete_error_message',
    );
    expect(setIsModalOpen).toHaveBeenCalledWith(false);
  });

  it('closes modal on cancel click', () => {
    render(<DsRecordsDeleteModal {...baseProps} />, { wrapper });

    fireEvent.click(screen.getByRole('button', { name: /actions:cancel/i }));

    expect(setIsModalOpen).toHaveBeenCalledWith(false);
  });
});
