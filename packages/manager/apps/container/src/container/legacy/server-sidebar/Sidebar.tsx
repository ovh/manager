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
import { OsdsSpinner } from '@ovhcloud/ods-components/react';

import { ODS_SPINNER_MODE, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';

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
    <OsdsSpinner
      mode={ODS_SPINNER_MODE.indeterminate}
      size={ODS_SPINNER_SIZE.lg}
      inline
      className={style.spinnerLoading}
    />
  );
}
