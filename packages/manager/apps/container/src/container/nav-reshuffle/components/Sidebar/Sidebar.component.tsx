import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Link, LinkType } from '@ovh-ux/muk';
import { useSidebarNodes } from '../../hooks/useSidebarNodes';
import { MenuItem } from '../MenuItem/MenuItem.component';
import { Node } from '../../data/config/navigation/types/node';
import { SubMenu } from '../Submenu/Submenu.component';
import { useSidebarAssistanceLinks } from '../../hooks/useSidebarAssistanceLinks';
import { useNodeUrl } from '../../hooks/useNodeUrl';
import { shouldHideElement } from '../../sidebar/utils';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

export const Sidebar = () => {
  const nodes: Node[] = useSidebarNodes();
  const { currentUniverse, setCurrentUniverse } = useProductNavReshuffle();
  const assistanceLinks = useSidebarAssistanceLinks();
  const getURL = useNodeUrl();

  const openSubmenu = (node: Node) => {
    setCurrentUniverse(node);
  };

  const closeSubMenu = () => {
    setCurrentUniverse(null);
  };

  const { t } = useTranslation('sidebar');

  const visibleNodes = useMemo(
    () => nodes.filter((node) => !shouldHideElement(node, false)),
    [nodes],
  );

  const menuItems = useMemo(
    () =>
      visibleNodes.map((node) => (
        <li key={node.id}>
          <MenuItem
            node={node}
            onClick={() => openSubmenu(node)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                openSubmenu(node);
              }
            }}
          />
        </li>
      )),
    [visibleNodes],
  );

  const subMenus = useMemo(
    () =>
      visibleNodes.map((node) => (
        <SubMenu
          key={node.id}
          node={node}
          open={node.id === currentUniverse?.id}
          close={closeSubMenu}
        />
      )),
    [visibleNodes, currentUniverse?.id],
  );

  return (
    <div className="relative flex flex-col w-[20rem] min-h-screen border-r border-solid border-gray-300 bg-white">
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
      <ul className="pb-2 px-0">{menuItems}</ul>

      {subMenus}

      <Link
        className="flex justify-center items-center w-auto mx-2 p-2 rounded-lg cursor-pointer bg-[var(--ods-color-primary-500)] text-white hover:bg-[var(--ods-color-primary-600)] focus:bg-[var(--ods-color-primary-600)] hover:no-underline focus:no-underline hover:after:transform-none focus:after:transform-none"
        href={getURL({ application: 'catalog', hash: '/' })}
      >
        <>
          <Icon name="plus" />
          {t('sidebar_service_add')}
        </>
      </Link>

      <ul className="mt-auto w-full px-2 pt-3 pb-[3rem] border-t border-solid border-t-gray-300 border-b-0 border-l-0 border-r-0">
        {assistanceLinks.map((node: Node) => (
          <li key={node.id}>
            <Link
              href={node.url as string}
              target={node.isExternal ? '_blank' : '_top'}
              rel={node.isExternal ? 'noopener noreferrer' : ''}
              type={node.isExternal && LinkType.external}
              className="py-1 text-gray-400 font-normal hover:no-underline [&:not([href]):not([tabindex])]:text-gray-400"
            >
              {t(node.translation)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
