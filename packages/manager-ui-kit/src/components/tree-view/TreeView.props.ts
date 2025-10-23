/**
 * External types (from contexts, utils, or shared ODS exports)
 */
import { PropsWithChildren } from 'react';

import {
  TreeViewProp as OdsTreeViewProps,
  type TreeViewCustomRendererArg,
  type TreeViewItem,
} from '@ovhcloud/ods-react';

export type TreeViewProps = PropsWithChildren<OdsTreeViewProps> & {};

export type { TreeViewCustomRendererArg, TreeViewItem };
