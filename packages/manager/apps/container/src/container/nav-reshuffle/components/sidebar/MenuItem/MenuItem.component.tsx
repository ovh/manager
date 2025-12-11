import React from 'react';
import { useTranslation } from 'react-i18next';
import { Node } from '@/types/node';
import { useNodeUrl } from '../../../hooks/useNodeUrl';
import { SidebarMenuItem } from '../../common/SidebarMenuItem/SidebarMenuItem.component';

interface MenuItemProps {
  node: Node;
  onClick: () => void;
  onKeyUp?: React.KeyboardEventHandler<HTMLElement>;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  node,
  onClick,
  onKeyUp,
}) => {
  const { t } = useTranslation('sidebar');
  const url = useNodeUrl()(node.routing);

  return (
    <SidebarMenuItem
      icon={node.icon}
      label={t(node.translation)}
      href={url}
      onClick={onClick}
      onKeyUp={onKeyUp}
      variant="light"
    />
  );
};
