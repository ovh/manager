import '@/common/setupTests';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/common/utils/test.provider';
import { useParams, useNavigate } from 'react-router-dom';
import { mockAddSuccess, mockAddError } from '@/common/setupTests';
import HostDelete from '@/domain/pages/domainTabs/hosts/hostDelete';
import { wrapper } from '@/common/utils/test.provider';
import { supportedAlgorithms } from '@/domain/constants/dsRecords';

const updateDomain = vi.fn();
const navigate = vi.fn();

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainResource: vi.fn(() => ({
    domainResource: {
      checksum: 'xyz',
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
              algorithm: 8,
              keyTag: 0,
              flags: 0,
              publicKey:
                'MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgGlVDb17VQPrH7bOLBGc6N+/D84tbly3RQ/kQLPq73H6nhCI+vg1euNvnZaFBDiHktGRDlmayzoo5k/j/65V5TkoFE/x5yaiPGHXKIb+QsZCbHeNkEx/di4meHY7sETyla97uBM5BJUBc7ZhCoR2+Jc+HHdBLrQ5/9LpR0nEsfn7AgMBAAE=',
            },
          ],
          supportedAlgorithms,
        },
      },
      isFetchingDomainResource: false,
    },
  })),
  useUpdateDomainResource: vi.fn(() => ({
    updateDomain,
    isUpdateDomainPending: false,
  })),
}));

vi.mock('@/common/hooks/generateUrl/useGenerateUrl', () => ({
  useGenerateUrl: () => '/domain/foobar/hosts',
}));

describe('HostDelete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useParams as any).mockReturnValue({
      serviceName: 'foobar',
      hostname: 'ns1.foobar',
    });
    (useNavigate as any).mockReturnValue(navigate);
  });

  it('renders modal with correct heading', () => {
    render(<HostDelete />, { wrapper });
    expect(
      screen.getByText('domain_tab_hosts_modal_delete_title'),
    ).toBeInTheDocument();
  });

  it('calls updateDomain with filtered hosts on delete click', () => {
    render(<HostDelete />, { wrapper });
    fireEvent.click(screen.getByRole('button', { name: /actions:delete/i }));

    expect(updateDomain).toHaveBeenCalledTimes(1);
    const call = updateDomain.mock.calls[0][0];
    expect(call.updatedSpec).toEqual({
      hostsConfiguration: { hosts: [{ host: 'ns2.foobar', ips: ['2.2.2.2'] }] },
    });
  });

  it('calls addSuccess + navigate on delete success', () => {
    render(<HostDelete />, { wrapper });
    fireEvent.click(screen.getByRole('button', { name: /actions:delete/i }));

    const { onSuccess, onSettled } = updateDomain.mock.calls[0][1];
    onSuccess();
    onSettled();

    expect(mockAddSuccess).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith('/domain/foobar/hosts');
  });

  it('calls addError on delete error', () => {
    render(<HostDelete />, { wrapper });
    fireEvent.click(screen.getByRole('button', { name: /actions:delete/i }));

    const { onError, onSettled } = updateDomain.mock.calls[0][1];
    onError();
    onSettled();

    expect(mockAddError).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith('/domain/foobar/hosts');
  });

  it('navigates back on cancel click', () => {
    render(<HostDelete />, { wrapper });
    fireEvent.click(screen.getByRole('button', { name: /actions:cancel/i }));
    expect(navigate).toHaveBeenCalledWith('/domain/foobar/hosts');
  });
});
