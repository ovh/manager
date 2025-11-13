import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Link } from '@ovh-ux/muk';
import { useSidebarNodes } from '../../hooks/useSidebarNodes';
import { MenuItem } from '../MenuItem/MenuItem.component';
import { Node } from '../../sidebar/navigation-tree/node';
import { SubMenu } from '../Submenu/Submenu.component';

export const Sidebar = () => {
  const nodes: Node[] = useSidebarNodes();
  const [currentNode, setCurrentNode] = useState(null);

  const openSubmenu = (node: Node) => {
    console.log(node);
    setCurrentNode(node);
  };

  const closeSubMenu = () => {
    setCurrentNode(null);
  };

  const { t } = useTranslation('sidebar');
  return (
    <div className="relative w-[20rem] min-h-screen border-r border-solid border-gray-300 bg-white">
      <Link
        href="/"
        aria-label={t('sidebar_dashboard')}
        className="p-0 border-b border-solid border-b-gray-300 border-t-0 border-l-0 border-r-0 px-2 py-3 text-[var(--ods-color-primary-800)] w-full hover:no-underline hover:after:transform-none"
      >
        <>
          <Icon
            name="grid-alt"
            className="fill-[var(--ods-color-primary-800)]"
          />
          {t('sidebar_dashboard')}
        </>
      </Link>
      <div className="pl-2 pt-2 pb-1 text-xs">{t('sidebar_service')}</div>
      <ul className="pb-2 px-0 border-b border-solid border-b-gray-300 border-t-0 border-l-0 border-r-0">
        {nodes.map((node) => (
          <li>
            <MenuItem node={node} onClick={() => openSubmenu(node)} />
          </li>
        ))}
      </ul>
      {nodes.map((node) => (
        <SubMenu node={node} open={node.id === currentNode?.id} close={closeSubMenu} />
      ))}
    </div>
  );
};
