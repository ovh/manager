import '@/common/setupTests';
import { render, screen } from '@/common/utils/test.provider';
import { describe, it, expect } from 'vitest';
import HostsIpsSupportedMessage from '@/domain/components/Host/HostIpsSupportedMessage';
import { IpsSupportedEnum } from '@/domain/enum/hostConfiguration.enum';

describe('HostsIpsSupportedMessage', () => {
  it('Display well the text for IpsSupportedEnum.All', () => {
    render(<HostsIpsSupportedMessage ipsSupported={IpsSupportedEnum.All} />);
    expect(
      screen.getByText('domain_tab_hosts_drawer_add_form_helper_all_supported'),
    ).toBeInTheDocument();
  });

  it('Display well the text for IpsSupportedEnum.OnlyIPv4', () => {
    render(
      <HostsIpsSupportedMessage ipsSupported={IpsSupportedEnum.OneIPv4} />,
    );
    expect(
      screen.getByText('domain_tab_hosts_drawer_add_form_helper_only_ipv4'),
    ).toBeInTheDocument();
  });

  it('Display well the text for IpsSupportedEnum.OnlyIPv6', () => {
    render(
      <HostsIpsSupportedMessage ipsSupported={IpsSupportedEnum.OneIPv6} />,
    );
    expect(
      screen.getByText('domain_tab_hosts_drawer_add_form_helper_only_ipv6'),
    ).toBeInTheDocument();
  });

  it('Display well the text for IpsSupportedEnum.MultipleIPv4', () => {
    render(
      <HostsIpsSupportedMessage ipsSupported={IpsSupportedEnum.MultipleIPv4} />,
    );
    expect(
      screen.getByText('domain_tab_hosts_drawer_add_form_helper_multiple_ipv4'),
    ).toBeInTheDocument();
  });

  it('Display well the text for IpsSupportedEnum.MultipleIPv6', () => {
    render(
      <HostsIpsSupportedMessage ipsSupported={IpsSupportedEnum.MultipleIPv6} />,
    );
    expect(
      screen.getByText('domain_tab_hosts_drawer_add_form_helper_multiple_ipv6'),
    ).toBeInTheDocument();
  });

  it('Display well the text for IpsSupportedEnum.OnlyIPv4IPv6', () => {
    render(
      <HostsIpsSupportedMessage
        ipsSupported={IpsSupportedEnum.OneIPv4OrOneIPv6}
      />,
    );
    expect(
      screen.getByText(
        'domain_tab_hosts_drawer_add_form_helper_all_supported_no_multiple_ips',
      ),
    ).toBeInTheDocument();
  });
});
