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
  let ipsSupportedText = '';

  switch (ipsSupported) {
    case IpsSupportedEnum.All:
      ipsSupportedText = t(
        'domain_tab_hosts_drawer_add_form_helper_all_supported',
      );
      break;

    case IpsSupportedEnum.OnlyIPv4:
      ipsSupportedText = t('domain_tab_hosts_drawer_add_form_helper_only_ipv4');
      break;

    case IpsSupportedEnum.OnlyIPv6:
      ipsSupportedText = t('domain_tab_hosts_drawer_add_form_helper_only_ipv6');
      break;

    case IpsSupportedEnum.MultipleIPv4:
      ipsSupportedText = t(
        'domain_tab_hosts_drawer_add_form_helper_multiple_ipv4',
      );
      break;

    case IpsSupportedEnum.MultipleIPv6:
      ipsSupportedText = t(
        'domain_tab_hosts_drawer_add_form_helper_multiple_ipv6',
      );
      break;

    case IpsSupportedEnum.OnlyIPv4IPv6:
      ipsSupportedText = t(
        'domain_tab_hosts_drawer_add_form_helper_all_supported_no_multiple_ips',
      );
      break;

    default:
      ipsSupportedText = '';
  }

  return (
    <FormFieldHelper className="text-[var(--ods-color-text)] text-xs">
      {ipsSupportedText}
    </FormFieldHelper>
  );
}
