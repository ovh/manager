import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { BADGE_COLOR } from '@ovhcloud/ods-react';
import { ProtectionStateEnum } from '@/domain/enum/protectionState.enum';
import {
  ActiveConfigurationTypeEnum,
  DnsConfigurationTypeEnum,
} from '../enum/dnsConfigurationType.enum';
import { PublicNameServerTypeEnum } from '../enum/publicNameServerType.enum';

export const ConfigurationDnssecBadgeColorAndContent = {
  not_supported: {
    color: BADGE_COLOR.neutral,
    toggleStatus: 'disabled',
    i18nkeyContent: 'domain_tab_general_information_dnssec_not_supported_badge',
    i18nkeyTooltip: 'domain_tab_general_information_dnssec_not_supported',
  },
  enableInProgress: {
    color: BADGE_COLOR.information,
    toggleStatus: 'disabled',
    i18nkeyContent: 'domain_dns_table_state_activating',
    i18nkeyTooltip:
      'domain_tab_general_information_dnssec_tooltip_activation_progress',
  },
  enabled: {
    color: BADGE_COLOR.success,
    toggleStatus: 'active',
    i18nkeyContent: 'domain_dns_table_state_enabled',
    i18nkeyTooltip: 'domain_tab_general_information_dnssec_tooltip_activated',
  },
  disableInProgress: {
    color: BADGE_COLOR.warning,
    toggleStatus: 'disabled',
    i18nkeyContent: 'domain_dns_table_state_deleting',
    i18nkeyTooltip:
      'domain_tab_general_information_dnssec_tooltip_disable_progress',
  },
  disabled: {
    color: BADGE_COLOR.critical,
    toggleStatus: 'active',
    i18nkeyContent: `${NAMESPACES.STATUS}:disabled`,
    i18nkeyTooltip: 'domain_tab_general_information_dnssec_tooltip_disabled',
  },
};

export const ConfigurationTransferBadgeColorAndContent = [
  {
    requiredStatus: {
      currentState: ProtectionStateEnum.UNPROTECTED,
      targetState: ProtectionStateEnum.PROTECTED,
    },
    result: {
      color: BADGE_COLOR.information,
      toggleStatus: 'disabled',
      i18nkeyContent: 'domain_dns_table_state_activating',
      i18nkeyTooltip:
        'domain_tab_general_information_transfer_activation_progress',
    },
  },
  {
    requiredStatus: {
      currentState: ProtectionStateEnum.PROTECTED,
      targetState: ProtectionStateEnum.PROTECTED,
    },
    result: {
      color: BADGE_COLOR.success,
      toggleStatus: 'active',
      i18nkeyContent: 'domain_dns_table_state_enabled',
      i18nkeyTooltip: 'domain_tab_general_information_transfer_activated',
    },
  },
  {
    requiredStatus: {
      currentState: ProtectionStateEnum.PROTECTED,
      targetState: ProtectionStateEnum.UNPROTECTED,
    },
    result: {
      color: BADGE_COLOR.warning,
      toggleStatus: 'disabled',
      i18nkeyContent: 'domain_dns_table_state_deleting',
      i18nkeyTooltip:
        'domain_tab_general_information_transfer_disable_progress',
    },
  },
  {
    requiredStatus: {
      currentState: ProtectionStateEnum.UNPROTECTED,
      targetState: ProtectionStateEnum.UNPROTECTED,
    },
    result: {
      color: BADGE_COLOR.critical,
      toggleStatus: 'active',
      i18nkeyContent: `${NAMESPACES.STATUS}:disabled`,
      i18nkeyTooltip: 'domain_tab_general_information_transfer_disabled',
    },
  },
];

export const ConfigurationDnsStateAndContent = [
  {
    dnsTypes: [
      DnsConfigurationTypeEnum.HOSTING,
      DnsConfigurationTypeEnum.HOLD,
      DnsConfigurationTypeEnum.PARKING,
    ],
    result: {
      label: 'domain_tab_general_information_dns_standard',
      notes: 'domain_tab_general_information_note_anycast',
      anycastSupported: true,
    },
  },
  {
    dnsTypes: [DnsConfigurationTypeEnum.ANYCAST],
    result: {
      label: 'domain_tab_general_information_dns_anycast',
      notes: '',
      anycastSupported: true,
    },
  },
  {
    dnsTypes: [
      DnsConfigurationTypeEnum.EXTERNAL,
      DnsConfigurationTypeEnum.MIXED,
    ],
    result: {
      label: 'domain_tab_general_information_dns_personnalised',
      notes: '',
      anycastSupported: false,
    },
  },
  {
    dnsTypes: [DnsConfigurationTypeEnum.DEDICATED],
    result: {
      label: 'domain_tab_general_information_dns_dedicad',
      notes: '',
      anycastSupported: false,
    },
  },
  {
    dnsTypes: [DnsConfigurationTypeEnum.EMPTY],
    result: {
      label: 'domain_tab_general_information_dns_empty',
      notes: '',
      anycastSupported: false,
    },
  },
];
