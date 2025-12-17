import { FormFieldHelper } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { IpsSupportedEnum } from '@/domain/enum/hostConfiguration.enum';

interface HostsIpsSupportedMessageProps {
  ipsSupported: IpsSupportedEnum;
}

export default function HostsIpsSupportedMessage({
  ipsSupported,
}: HostsIpsSupportedMessageProps) {
  const { t } = useTranslation('domain');

  const SUPPORTED_IP_MESSAGE = {
    [IpsSupportedEnum.All]:
      'domain_tab_hosts_drawer_add_form_helper_all_supported',
    [IpsSupportedEnum.OneIPv4]:
      'domain_tab_hosts_drawer_add_form_helper_only_ipv4',
    [IpsSupportedEnum.OneIPv6]:
      'domain_tab_hosts_drawer_add_form_helper_only_ipv6',
    [IpsSupportedEnum.MultipleIPv4]:
      'domain_tab_hosts_drawer_add_form_helper_multiple_ipv4',
    [IpsSupportedEnum.MultipleIPv6]:
      'domain_tab_hosts_drawer_add_form_helper_multiple_ipv6',
    [IpsSupportedEnum.OneIPv4OrOneIPv6]:
      'domain_tab_hosts_drawer_add_form_helper_all_supported_no_multiple_ips',
  };

  return (
    <FormFieldHelper className="text-[--ods-color-text] text-xs">
      {t(SUPPORTED_IP_MESSAGE[ipsSupported])}
    </FormFieldHelper>
  );
}
