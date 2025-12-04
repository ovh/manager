import '@/common/setupTests';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HostDelete from '@/domain/pages/domainTabs/hosts/hostDelete';
import { wrapper } from '@/common/utils/test.provider';
import { urls } from '@/domain/routes/routes.constant';

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

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigate,
  useParams: () => ({
    serviceName: 'foobar',
    hostname: 'ns1.foobar',
  }),
}));

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
    expect(call.checksum).toBe('xyz');
  });

  it('calls addSuccess + navigate on delete success', () => {
    render(<HostDelete />, { wrapper });
    fireEvent.click(screen.getByRole('button', { name: /actions:delete/i }));

    const { onSuccess, onSettled } = updateDomain.mock.calls[0][1];
    onSuccess();
    onSettled();

    expect(addSuccess).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith('/domain/foobar/hosts');
  });

  it('calls addError on delete error', () => {
    render(<HostDelete />, { wrapper });
    fireEvent.click(screen.getByRole('button', { name: /actions:delete/i }));

    const { onError, onSettled } = updateDomain.mock.calls[0][1];
    onError();
    onSettled();

    expect(addError).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith('/domain/foobar/hosts');
  });

  it('navigates back on cancel click', () => {
    render(<HostDelete />, { wrapper });
    fireEvent.click(screen.getByRole('button', { name: /actions:cancel/i }));
    expect(navigate).toHaveBeenCalledWith('/domain/foobar/hosts');
  });
});
