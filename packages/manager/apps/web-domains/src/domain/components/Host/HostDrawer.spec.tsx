import '@/common/setupTests';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, expect, it } from 'vitest';
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

describe('HostDrawer', () => {
  const drawerProps = {
    formData: {
      host: serviceInfoDetail.currentState.hostsConfiguration.hosts[0].host,
      ips: serviceInfoDetail.currentState.hostsConfiguration.hosts[0].ips,
    },
    drawer: { isOpen: true, action: DrawerActionEnum.Add },
    ipv4Supported: true,
    ipv6Supported: true,
    multipleIPsSupported: false,
    serviceName: 'foobar',
    checksum: '123',
    targetSpec: serviceInfoDetail.targetSpec,
    setDrawer,
    setFormData,
  };

  it('renders drawer correctly', () => {
    render(<HostDrawer {...drawerProps} />);

    expect(screen.getByTestId('drawer')).toBeInTheDocument();
    expect(
      screen.getByText('domain_tab_hosts_drawer_add_title'),
    ).toBeInTheDocument();
  });

  it('closes drawer on secondary button click', () => {
    render(<HostDrawer {...drawerProps} />);

    const cancel = screen.getByRole('button', { name: 'close' });
    fireEvent.click(cancel);

    expect(setDrawer).toHaveBeenCalledWith({
      isOpen: false,
      action: null,
    });
  });
});
