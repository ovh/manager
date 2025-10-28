/**
 * External types (from contexts, utils, or shared ODS exports)
 */
import { PropsWithChildren } from 'react';

import {
  QuantityProp as OdsQuantityProps,
  type QuantityValueChangeDetail,
} from '@ovhcloud/ods-react';

export type QuantityProps = PropsWithChildren<OdsQuantityProps> & {};

export type { QuantityValueChangeDetail };
