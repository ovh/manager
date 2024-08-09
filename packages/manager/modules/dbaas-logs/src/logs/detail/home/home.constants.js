const STATUS = {
  DISABLED: 'DISABLED',
  ENABLED: 'ENABLED',
  INIT: 'INIT',
  TO_CONFIG: 'TO_CONFIG',
};

export const STATUS_CLASS = {
  [STATUS.DISABLED]: 'oui-badge_error',
  [STATUS.ENABLED]: 'oui-badge_success',
  [STATUS.INIT]: 'oui-badge_info',
  [STATUS.TO_CONFIG]: 'oui-background-g-100',
};

export default {
  STATUS_CLASS,
};
