/**
 * External types (from contexts, utils, or shared ODS exports)
 */
import { PropsWithChildren } from 'react';

import {
  type DatepickerFormatterArg,
  type DatepickerValueChangeDetail,
  DatepickerProp as OdsDatepickerProps,
} from '@ovhcloud/ods-react';

export type DatepickerProps = PropsWithChildren<OdsDatepickerProps> & {};

export type { DatepickerFormatterArg, DatepickerValueChangeDetail };
