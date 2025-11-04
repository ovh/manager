import { TreeView as OdsTreeView } from '@ovhcloud/ods-react';

import { TreeViewProps } from '@/components/tree-view/TreeView.props';

export const TreeView = ({ children, ...others }: TreeViewProps) => (
  <OdsTreeView {...others}>{children}</OdsTreeView>
);
