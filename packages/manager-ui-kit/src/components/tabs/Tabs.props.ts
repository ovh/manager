import { PropsWithChildren } from 'react';

import { TabsProp as OdsTabsProps } from '@ovhcloud/ods-react';
/**
 * External types (from contexts, utils, or shared ODS exports)
 */
import { type TabsValueChangeEvent } from '@ovhcloud/ods-react';

export type TabsProps = PropsWithChildren<OdsTabsProps> & {};

export type { TabsValueChangeEvent };
