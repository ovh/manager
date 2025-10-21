import { TreeView as OdsTreeView } from '@ovhcloud/ods-react';

import { TreeViewProps } from '@/components';

export const TreeView = ({ children, ...others }: TreeViewProps) => (
  <OdsTreeView {...others}>{children}</OdsTreeView>
);
