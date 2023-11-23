export const DKIM_STATUS = {
  ACTIVE: 'active',
  DISABLED: 'disabled',
  ERROR: 'error',
  IN_PROGRESS: 'inProgress',
  TO_CONFIGURE: 'toConfigure',
};

export const DKIM_STATUS_TEXT = {
  [DKIM_STATUS.ACTIVE]: 'exchange_tab_domain_diagnostic_dkim_deactivation',
  [DKIM_STATUS.DISABLED]: 'exchange_tab_domain_diagnostic_dkim_activation',
  [DKIM_STATUS.IN_PROGRESS]: 'exchange_tab_domain_diagnostic_dkim_in_progress',
  [DKIM_STATUS.ERROR]: 'exchange_tab_domain_diagnostic_dkim_configuration_nok',
};

export const DKIM_STATUS_CLASS = {
  [DKIM_STATUS.ACTIVE]: 'oui-badge_success',
  [DKIM_STATUS.DISABLED]: 'oui-badge_warning',
  [DKIM_STATUS.TO_CONFIGURE]: 'oui-background-g-100',
  [DKIM_STATUS.IN_PROGRESS]: 'oui-badge_info',
  [DKIM_STATUS.ERROR]: 'oui-badge_error',
};

export default {
  DKIM_STATUS,
  DKIM_STATUS_TEXT,
  DKIM_STATUS_CLASS,
};
