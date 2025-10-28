import { PropsWithChildren } from 'react';

import { TreeViewNodes as ODSTreeViewNodes } from '@ovhcloud/ods-react';

import { TreeViewNodesProps } from './TreeViewNodes.props';

export const TreeViewNodes = ({ children, ...props }: PropsWithChildren<TreeViewNodesProps>) => (
  <ODSTreeViewNodes {...props}>{children}</ODSTreeViewNodes>
);
