import React, { useEffect, useState } from 'react';
import { OsdsSkeleton } from '@ovhcloud/ods-components/react';
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

const AVERAGE_NUMBER_OF_MENU_ENTRIES = 7;

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
    <>
      {Array(AVERAGE_NUMBER_OF_MENU_ENTRIES)
        .fill(0)
        .map((_: number, index: number) => (
          <div
            className="flex justify-center h-[35px] m-auto"
            key={`menu_entries_skeleton_${index}`}
          >
            <OsdsSkeleton className="w-[20px] ml-1 mr-3" inline />
            <OsdsSkeleton inline />
          </div>
        ))}
    </>
  );
}
