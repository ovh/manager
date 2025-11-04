/**
 * External types (from contexts, utils, or shared ODS exports)
 */
import { PropsWithChildren } from 'react';

import {
  TimepickerProp as OdsTimepickerProps,
  type TimepickerTimezoneChangeDetail,
  type TimepickerValueChangeDetail,
} from '@ovhcloud/ods-react';

export type TimepickerProps = PropsWithChildren<OdsTimepickerProps> & {};

export type { TimepickerTimezoneChangeDetail, TimepickerValueChangeDetail };
