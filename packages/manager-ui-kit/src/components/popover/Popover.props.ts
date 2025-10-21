/**
 * External types (from contexts, utils, or shared ODS exports)
 */
import { PropsWithChildren } from 'react';

import {
  PopoverProp as OdsPopoverProps,
  type PopoverOpenChangeDetail,
  type PopoverPositionChangeDetail,
} from '@ovhcloud/ods-react';

export type PopoverProps = PropsWithChildren<OdsPopoverProps> & {};

export type { PopoverOpenChangeDetail, PopoverPositionChangeDetail };
