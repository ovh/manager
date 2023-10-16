import React, { useCallback, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useShell } from '@/context';
import ServerSidebarVirtual from './SidebarVirtual';
import {
  filterBySearch,
  flattenMenu,
  selectActiveItem,
  SidebarMenuItem,
  updateSearchFields,
  updateSidebarItemLabel,
} from './sidebarMenu';

export default function ServerSidebar({ menu }: { menu: SidebarMenuItem }) {
  const [items, setItems] = useState<SidebarMenuItem[]>([]);
  const shell = useShell();
  const location = useLocation();

  const refreshMenu = () => {
    updateSearchFields(menu);
    filterBySearch(menu, refreshMenu);
    setItems(flattenMenu(menu, { addNoResultsItems: true }));
  };

  useEffect(() => {
    if (menu) {
      refreshMenu();
    }
  }, [menu]);

  useEffect(() => {
    if (menu && location) {
      const appHash = location.pathname.replace(/^\/[^/]+/, '');
      selectActiveItem(menu, appHash, location.pathname, refreshMenu);
    }
  }, [menu, location]);

  useEffect(() => {
    shell
      .getPlugin('ux')
      .onUpdateMenuSidebarItemLabel((serviceName: string, label: string) => {
        if (menu && serviceName && label) {
          updateSidebarItemLabel(menu, serviceName, label);
          refreshMenu();
        }
      });
  }, [menu]);

  return menu ? (
    <ServerSidebarVirtual items={items} onMenuChange={refreshMenu} />
  ) : (
    <div className="text-center">
      <Spinner
        as="span"
        animation="border"
        role="status"
        aria-hidden="true"
        className="mt-4 mx-auto"
      />
    </div>
  );
}
