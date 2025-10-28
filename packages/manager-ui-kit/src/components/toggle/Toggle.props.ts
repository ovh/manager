/**
 * External types (from contexts, utils, or shared ODS exports)
 */
import { PropsWithChildren } from 'react';

import { ToggleProp as OdsToggleProps, type ToggleCheckedChangeDetail } from '@ovhcloud/ods-react';

export type ToggleProps = PropsWithChildren<OdsToggleProps> & {};

export type { ToggleCheckedChangeDetail };
