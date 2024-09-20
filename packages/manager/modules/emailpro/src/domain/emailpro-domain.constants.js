export const DKIM_STATUS = {
  ACTIVE: 'active',
  ENABLED: 'enabled',
  DISABLED: 'disabled',
  DISABLED_NO_SET: 'error',
  ERROR: 'error',
  IN_PROGRESS: 'inProgress',
  TO_CONFIGURE: 'toConfigure',
  MODIFYING: 'modifying',
};

export const DKIM_STATUS_TEXT = {
  [DKIM_STATUS.ACTIVE]: 'emailpro_tab_domain_diagnostic_dkim_deactivation',
  [DKIM_STATUS.DISABLED]: 'emailpro_tab_domain_diagnostic_dkim_activation',
  [DKIM_STATUS.IN_PROGRESS]: 'emailpro_tab_domain_diagnostic_dkim_in_progress',
  [DKIM_STATUS.ERROR]: 'emailpro_tab_domain_diagnostic_dkim_configuration_nok',
};

export const DKIM_STATUS_CLASS = {
  [DKIM_STATUS.ACTIVE]: 'oui-badge_success',
  [DKIM_STATUS.DISABLED]: 'oui-badge_warning',
  [DKIM_STATUS.TO_CONFIGURE]: 'oui-background-g-100',
  [DKIM_STATUS.IN_PROGRESS]: 'oui-badge_info',
  [DKIM_STATUS.ERROR]: 'oui-badge_error',
};

export const DKIM_STATUS_CLASS_MXPLAN = {
  [DKIM_STATUS.ENABLED]: 'oui-badge_success',
  [DKIM_STATUS.DISABLED]: 'oui-badge_warning',
  [DKIM_STATUS.DISABLED_NO_SET]: 'oui-badge_error',
  [DKIM_STATUS.TO_CONFIGURE]: 'oui-badge_error',
  [DKIM_STATUS.MODIFYING]: 'oui-badge_info',
  [DKIM_STATUS.ERROR]: 'oui-badge_error',
};

export default {
  DKIM_STATUS,
  DKIM_STATUS_TEXT,
  DKIM_STATUS_CLASS,
};
