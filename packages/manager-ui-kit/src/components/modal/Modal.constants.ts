import {
  MODAL_COLOR as ODS_MODAL_COLOR,
  MODAL_COLORS as ODS_MODAL_COLORS,
} from '@ovhcloud/ods-react';

enum MODAL_TYPE {
  critical = 'critical',
  primary = 'primary',
  information = 'information',
}

/** @deprecated MODAL_COLOR is no longer used and will be removed in the next major version. */
type MODAL_COLOR = ODS_MODAL_COLOR;

/** @deprecated MODAL_COLORS is no longer used and will be removed in the next major version. */
const MODAL_COLORS = ODS_MODAL_COLORS;

export { MODAL_COLORS, MODAL_TYPE };

export type { MODAL_COLOR };
