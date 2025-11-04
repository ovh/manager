import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, LinkType, Icon, ICON_NAME } from '@ovh-ux/muk';
import { useSidebarNodes } from '../../../hooks/useSidebarNodes';
import { MenuItem } from '../MenuItem/MenuItem.component';
import { Node } from '@/types/node';
import { NodeSubmenu } from '../../node-menu/NodeSubmenu/NodeSubmenu.component';
import { useSidebarAssistanceLinks } from '../../../hooks/useSidebarAssistanceLinks';
import { useNodeUrl } from '../../../hooks/useNodeUrl';
import { shouldHideElement } from '../../../sidebar/utils';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';
import NavReshuffleSwitchBack from '@/container/common/nav-reshuffle-switch-back';
import { SupportLink } from '../../../support-link';
import { LanguageSelector } from '../../language-selector/LanguageSelector/LanguageSelector.component';
import { LanguageSubmenu } from '../../language-selector/LanguageSubmenu/LanguageSubmenu.component';
import { SidebarMenuItem } from '../../common/SidebarMenuItem/SidebarMenuItem.component';

export const Sidebar = () => {
  const nodes: Node[] = useSidebarNodes();
  const {
    currentUniverse,
    setCurrentUniverse,
    isMobile,
  } = useProductNavReshuffle();
  const assistanceLinks = useSidebarAssistanceLinks();
  const getURL = useNodeUrl();
  const [showLanguageSubmenu, setShowLanguageSubmenu] = useState(false);

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

  const currentSubMenu = useMemo(() => {
    if (showLanguageSubmenu) {
      return (
        <LanguageSubmenu
          key="language-submenu"
          close={() => setShowLanguageSubmenu(false)}
        />
      );
    }

    if (!currentUniverse) return null;

    return (
      <NodeSubmenu
        key={currentUniverse.id}
        node={currentUniverse}
        close={closeSubMenu}
      />
    );
  }, [currentUniverse, showLanguageSubmenu]);

  return (
    <div className="relative flex flex-col w-[20rem] min-h-screen border-r border-solid border-gray-300 border-t-0 border-l-0 bg-white">
      <div className="border-b border-solid border-b-gray-300 border-t-0 border-l-0 border-r-0">
        <SidebarMenuItem
          icon={ICON_NAME.gridAlt}
          label={t('sidebar_dashboard')}
          href="/"
          variant="light"
        />
      </div>
      <div className="pl-2 pt-2 pb-1 text-xs">{t('sidebar_service')}</div>
      <ul className="pb-2 px-0">{menuItems}</ul>

      {currentSubMenu}

      <Link
        className="flex justify-center items-center w-auto mx-2 p-2 rounded-lg cursor-pointer bg-[var(--ods-color-primary-500)] text-white hover:bg-[var(--ods-color-primary-600)] focus:bg-[var(--ods-color-primary-600)] hover:no-underline focus:no-underline hover:after:transform-none focus:after:transform-none"
        href={getURL({ application: 'catalog', hash: '/' })}
      >
        <>
          <Icon name="plus" />
          {t('sidebar_service_add')}
        </>
      </Link>

      <div className="mt-auto">
        {isMobile && (
          <div className="w-full mt-auto px-2 pt-4 pb-4 bg-[var(--ods-color-primary-700)] flex flex-col gap-3">
            <NavReshuffleSwitchBack />
            <LanguageSelector onClick={() => setShowLanguageSubmenu(true)} />
            <div className="px-2">
              <SupportLink />
            </div>
          </div>
        )}

        <ul className="w-full px-2 pt-3 pb-[3rem] border-t border-solid border-t-gray-300 border-b-0 border-l-0 border-r-0">
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
    </div>
  );
};
