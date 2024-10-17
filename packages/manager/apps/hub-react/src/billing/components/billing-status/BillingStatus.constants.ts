import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

export const BADGE_INTENT_BY_STATUS: Record<
  string,
  keyof typeof ODS_THEME_COLOR_INTENT
> = {
  auto: 'success',
  automatic: 'success',
  billing_suspended: 'info',
  delete_at_expiration: 'error',
  expired: 'error',
  forced_manual: 'info',
  manual: 'warning',
  manualPayment: 'warning',
};
