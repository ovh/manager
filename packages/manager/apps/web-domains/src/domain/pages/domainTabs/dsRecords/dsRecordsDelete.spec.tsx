import '@/common/setupTests';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import DsRecordsDelete from '@/domain/pages/domainTabs/dsRecords/dsRecordsDelete';

import { wrapper } from '@/common/utils/test.provider';
import { supportedAlgorithms } from '@/domain/constants/dsRecords';

const updateDomain = vi.fn();
const navigate = vi.fn();
const addSuccess = vi.fn();
const addError = vi.fn();

vi.mock('@ovh-ux/manager-react-components', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-react-components');

  type ModalProps = {
    isOpen: boolean;
    heading: string;
    primaryLabel: string;
    secondaryLabel: string;
    onPrimaryButtonClick: () => void;
    onSecondaryButtonClick: () => void;
    children?: React.ReactNode;
  };

  return {
    ...actual,
    Modal: ({
      isOpen,
      heading,
      primaryLabel,
      secondaryLabel,
      onPrimaryButtonClick,
      onSecondaryButtonClick,
      children,
    }: ModalProps) =>
      isOpen ? (
        <div data-testid="modal">
          <h1>{heading}</h1>
          <button onClick={onSecondaryButtonClick}>{secondaryLabel}</button>
          <button onClick={onPrimaryButtonClick}>{primaryLabel}</button>
          {children}
        </div>
      ) : null,
    useNotifications: () => ({
      addSuccess,
      addError,
    }),
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import('react-router-dom');

  return {
    ...actual,
    useNavigate: () => navigate,
    useParams: () => ({
      serviceName: 'foobar',
      keyTag: '0',
    }),
  };
});

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainResource: vi.fn(() => ({
    domainResource: {
      checksum: 'xyz',
      currentState: {
        protectionState: 'PROTECTED',
      },
      targetSpec: {
        dnsConfiguration: {
          nameServers: ['ns1.example.com', 'ns2.example.com'],
        },
        hostsConfiguration: {
          hosts: [
            { host: 'ns1.foobar', ips: ['1.1.1.1'] },
            { host: 'ns2.foobar', ips: ['2.2.2.2'] },
          ],
        },
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
    },
    isFetchingDomainResource: false,
  })),
  useUpdateDomainResource: vi.fn(() => ({
    updateDomain,
    isUpdateDomainPending: false,
  })),
}));

vi.mock('@/common/hooks/generateUrl/useGenerateUrl', () => ({
  useGenerateUrl: () => '/domain/foobar/dsrecords',
}));

describe('DsRecordsDelete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal with correct heading', () => {
    render(<DsRecordsDelete />, { wrapper });

    expect(
      screen.getByText('domain_tab_dsrecords_modal_delete_title'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('calls updateDomain with filtered dsData on delete click', () => {
    render(<DsRecordsDelete />, { wrapper });

    fireEvent.click(screen.getByRole('button', { name: /actions:delete/i }));

    expect(updateDomain).toHaveBeenCalledTimes(1);

    const call = updateDomain.mock.calls[0][0];

    expect(call.checksum).toBe('xyz');
    expect(call.currentTargetSpec).toEqual({
      dnsConfiguration: {
        nameServers: ['ns1.example.com', 'ns2.example.com'],
      },
      hostsConfiguration: {
        hosts: [
          { host: 'ns1.foobar', ips: ['1.1.1.1'] },
          { host: 'ns2.foobar', ips: ['2.2.2.2'] },
        ],
      },
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
    });

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

  it('calls addSuccess + navigate on delete success', () => {
    render(<DsRecordsDelete />, { wrapper });

    fireEvent.click(screen.getByRole('button', { name: /actions:delete/i }));

    const { onSuccess, onSettled } = updateDomain.mock.calls[0][1];

    onSuccess();
    onSettled();

    expect(addSuccess).toHaveBeenCalledTimes(1);
    expect(addSuccess).toHaveBeenCalledWith(
      'domain_tab_dsrecords_modal_delete_success_message',
    );
    expect(navigate).toHaveBeenCalledWith('/domain/foobar/dsrecords');
  });

  it('calls addError on delete error', () => {
    render(<DsRecordsDelete />, { wrapper });

    fireEvent.click(screen.getByRole('button', { name: /actions:delete/i }));

    const { onError, onSettled } = updateDomain.mock.calls[0][1];

    onError();
    onSettled();

    expect(addError).toHaveBeenCalledTimes(1);
    expect(addError).toHaveBeenCalledWith(
      'domain_tab_dsrecords_modal_delete_error_message',
    );
    expect(navigate).toHaveBeenCalledWith('/domain/foobar/dsrecords');
  });

  it('navigates back on cancel click', () => {
    render(<DsRecordsDelete />, { wrapper });

    fireEvent.click(screen.getByRole('button', { name: /actions:cancel/i }));

    expect(navigate).toHaveBeenCalledWith('/domain/foobar/dsrecords');
  });
});
