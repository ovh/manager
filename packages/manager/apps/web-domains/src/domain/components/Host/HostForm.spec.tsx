import '@/common/setupTests';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import HostForm from './HostForm';
import {
  DrawerActionEnum,
  IpsSupportedEnum,
} from '@/domain/enum/hostConfiguration.enum';

import { getHostnameErrorMessage, isIpsInvalid } from '@/domain/utils/utils';
import { serviceInfoDetail } from '@/domain/__mocks__/serviceInfoDetail';

vi.useFakeTimers();

vi.mock('@/domain/utils/utils', () => ({
  getHostnameErrorMessage: vi.fn(),
  isIpsInvalid: vi.fn(),
}));

describe('HostForm', () => {
  const setFormData = vi.fn();
  const setError = vi.fn();

  const defaultProps = {
    drawerAction: DrawerActionEnum.Add,
    formData: {
      host: serviceInfoDetail.currentState.hostsConfiguration.hosts[0].host,
      ips: serviceInfoDetail.currentState.hostsConfiguration.hosts[0].ips,
    },
    setFormData,
    ipsSupported: IpsSupportedEnum.All,
    error: { errorHost: '', errorIps: false },
    setError,
    serviceName: 'foobar',
    hostsTargetSpec: serviceInfoDetail.targetSpec.hostsConfiguration.hosts,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the host form', () => {
    render(<HostForm {...defaultProps} />);
    expect(screen.getByTestId('host-form')).toBeInTheDocument();
  });

  it('updates host value and triggers validation after debounce', () => {
    (getHostnameErrorMessage as Mock).mockReturnValue(true);

    render(<HostForm {...defaultProps} />);

    const hostInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(hostInput, { target: { value: 'myhost' } });

    vi.runAllTimers();

    const updateFn = setError.mock.calls[0][0];

    expect(typeof updateFn).toBe('function');

    const result = updateFn({ errorHost: null, errorIps: false });

    expect(result).toEqual(expect.objectContaining({ errorHost: true }));
  });

  it('clears hostname error when validation passes', () => {
    (getHostnameErrorMessage as Mock).mockReturnValue(false);

    render(<HostForm {...defaultProps} />);

    const hostInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(hostInput, { target: { value: 'valid' } });

    vi.runAllTimers();

    const updateFn = setError.mock.calls[0][0];

    expect(typeof updateFn).toBe('function');

    const result = updateFn({ errorHost: '', errorIps: false });

    expect(result).toEqual(expect.objectContaining({ errorHost: false }));
  });

  it('shows .serviceName suffix after host input', () => {
    render(<HostForm {...defaultProps} />);
    expect(screen.getByText('.foobar')).toBeInTheDocument();
  });

  it('updates IPs and triggers IP validation', () => {
    (isIpsInvalid as Mock).mockReturnValue(true);

    render(<HostForm {...defaultProps} />);

    const ipsInput = screen.getAllByRole('textbox')[1];
    fireEvent.change(ipsInput, {
      target: { value: '1.1.1.1, 2.2.2.2' },
    });

    expect(setFormData).toHaveBeenCalled();
    const setFn = setFormData.mock.calls[0][0];

    const newState = setFn({ host: '', ips: [] });

    expect(newState).toEqual({
      host: '',
      ips: ['1.1.1.1', '2.2.2.2'],
    });

    vi.runAllTimers();

    expect(setError).toHaveBeenCalledWith(
      expect.objectContaining({ errorIps: true }),
    );
  });

  it('clears IP error when validation passes', () => {
    (isIpsInvalid as Mock).mockReturnValue(false);

    render(<HostForm {...defaultProps} />);

    const ipsInput = screen.getAllByRole('textbox')[1];
    fireEvent.change(ipsInput, { target: { value: '1.1.1.1' } });

    vi.runAllTimers();

    expect(setError).toHaveBeenCalledWith(
      expect.objectContaining({ errorIps: false }),
    );
  });

  it('shows the warning message when at least one IP is filled', () => {
    const props = {
      ...defaultProps,
      formData: { host: '', ips: ['1.1.1.1'] },
    };

    render(<HostForm {...props} />);

    expect(
      screen.getByText('domain_tab_hosts_drawer_add_form_warning_message'),
    ).toBeInTheDocument();
  });
});
