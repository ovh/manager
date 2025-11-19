import '@/common/setupTests';
import { render, screen } from '@testing-library/react';
import { vi, describe, expect, it, beforeEach } from 'vitest';
import HostDrawer from './HostDrawer';
import { DrawerActionEnum } from '@/domain/enum/hostConfiguration.enum';
import { serviceInfoDetail } from '@/domain/__mocks__/serviceInfoDetail';

const setFormData = vi.fn();
const setDrawer = vi.fn();
const updateDomain = vi.fn();

vi.mock('@/domain/hooks/data/query', () => ({
  useUpdateDomainResource: () => ({
    updateDomain,
    isUpdateDomainPending: false,
  }),
}));

vi.mock('@/domain/utils/utils', () => ({
  getIpsSupported: () => true,
  isHostnameInvalid: () => vi.fn(),
  isIpsInvalid: () => false,
}));

describe('HostDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseProps = {
    formData: {
      host: 'ns1',
      ips: ['1.1.1.1'],
    },
    ipv4Supported: true,
    ipv6Supported: true,
    multipleIPsSupported: false,
    serviceName: 'foobar',
    checksum: '123',
    targetSpec: serviceInfoDetail.targetSpec,
    setDrawer,
    setFormData,
  };

  it('renders drawer correctly in Add mode', () => {
    render(
      <HostDrawer
        {...baseProps}
        drawer={{ isOpen: true, action: DrawerActionEnum.Add }}
      />,
    );

    expect(screen.getByTestId('drawer')).toBeInTheDocument();
    expect(
      screen.getByText('domain_tab_hosts_drawer_add_title'),
    ).toBeInTheDocument();

    expect(screen.getByText('.foobar')).toBeInTheDocument();
  });

  it('renders drawer correctly in Modify mode', () => {
    render(
      <HostDrawer
        {...baseProps}
        drawer={{ isOpen: true, action: DrawerActionEnum.Modify }}
      />,
    );

    const [hostnameInput] = screen.getAllByRole('textbox');
    expect(hostnameInput).toHaveAttribute('readonly');
  });
});
