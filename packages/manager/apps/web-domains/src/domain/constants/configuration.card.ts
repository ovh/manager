import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { BADGE_COLOR } from '@ovhcloud/ods-react';

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
