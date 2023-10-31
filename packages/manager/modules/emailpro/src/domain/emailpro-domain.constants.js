export const GLOBAL_DKIM_STATUS = {
  OK: 'OK',
  DISABLED: 'DISABLED',
  NOT_CONFIGURED: 'NOT_CONFIGURED',
  IN_PROGRESS: 'IN_PROGRESS',
  NOK: 'NOK',
};

export const DKIM_STATUS = {
  DELETING: 'deleting',
  DISABLING: 'disabling',
  ENABLING: 'enabling',
  IN_PRODUCTION: 'inProduction',
  READY: 'ready',
  TODO: 'todo',
  WAITING_RECORD: 'waitingRecord',
};

export const DKIM_MATCHING_SCHEMA_STATUS = {
  OK: [DKIM_STATUS.IN_PRODUCTION], // ACTIVE (Green)
  DISABLED: [DKIM_STATUS.READY], // DISABLED (Yellow)
  NOT_CONFIGURED: [DKIM_STATUS.TODO], // TO_CONFIGURE (Grey)
  IN_PROGRESS: [
    DKIM_STATUS.DELETING, // (Blue)
    DKIM_STATUS.DISABLING, // (Blue)
    DKIM_STATUS.ENABLING, // (Blue)
  ],
  NOK: [DKIM_STATUS.WAITING_RECORD], // ERROR (Red)
};

export const STATUS_TO_TEXT_MAP = {
  [GLOBAL_DKIM_STATUS.OK]: 'emailpro_tab_domain_diagnostic_dkim_deactivation',
  [GLOBAL_DKIM_STATUS.DISABLED]:
    'emailpro_tab_domain_diagnostic_dkim_activation',
  [GLOBAL_DKIM_STATUS.NOK]:
    'emailpro_tab_domain_diagnostic_dkim_configuration_nok',
};

export const DKIM_STATUS_TO_CLASS_MAP = {
  [GLOBAL_DKIM_STATUS.OK]: 'oui-badge_success',
  [GLOBAL_DKIM_STATUS.DISABLED]: 'oui-badge_warning',
  [GLOBAL_DKIM_STATUS.NOT_CONFIGURED]: 'oui-background-g-100',
  [GLOBAL_DKIM_STATUS.IN_PROGRESS]: 'oui-badge_info',
  [GLOBAL_DKIM_STATUS.NOK]: 'oui-badge_error',
};

export default {
  GLOBAL_DKIM_STATUS,
  DKIM_STATUS,
  DKIM_MATCHING_SCHEMA_STATUS,
  STATUS_TO_TEXT_MAP,
  DKIM_STATUS_TO_CLASS_MAP,
};
