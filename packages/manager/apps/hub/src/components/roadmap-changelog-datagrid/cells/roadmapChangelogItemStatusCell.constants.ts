import { ODS_TEXT_COLOR_INTENT } from '@ovhcloud/ods-components';

export const ROADMAP_STATUS_COLORS: Record<string, ODS_TEXT_COLOR_INTENT> = {
  Done: ODS_TEXT_COLOR_INTENT.success,
  'Partially released': ODS_TEXT_COLOR_INTENT.info,
  Planned: ODS_TEXT_COLOR_INTENT.accent,
  Acknowledged: ODS_TEXT_COLOR_INTENT.default,
  Prioritized: ODS_TEXT_COLOR_INTENT.warning,
} as const;

export default {
  ROADMAP_STATUS_COLORS,
};
