import { PropsWithChildren } from 'react';

import { TreeViewNode as ODSTreeViewNode } from '@ovhcloud/ods-react';

import { TreeViewNodeProps } from './TreeViewNode.props';

export const TreeViewNode = ({ children, ...props }: PropsWithChildren<TreeViewNodeProps>) => (
  <ODSTreeViewNode {...props}>{children}</ODSTreeViewNode>
);
