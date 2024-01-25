import React, { useEffect, useState } from 'react';
import { useShell } from '@/context';
import ServerSidebarVirtual from './SidebarVirtual';
import style from './index.module.scss';
import {
  filterBySearch,
  flattenMenu,
  selectActiveItem,
  SidebarMenuItem,
  updateSearchFields,
  updateSidebarItemLabel,
} from './sidebarMenu';
import { useLocation } from 'react-router-dom';
import { OsdsSpinner } from '@ovhcloud/ods-stencil/components/react';
import { OdsSpinnerMode, OdsSpinnerSize } from '@ovhcloud/ods-core';

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
    <OsdsSpinner mode={OdsSpinnerMode.INDETERMINATE} size={OdsSpinnerSize.md} className={style.spinnerLoading} />
  );
}
