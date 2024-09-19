import { useShell } from '@/context';
import { apiClient } from '@ovh-ux/manager-core-api';
import { AxiosResponse } from 'axios';
import { SidebarMenuItem } from '../sidebarMenu';

type TService = {
  displayName: string;
  serviceName: string;
  url?: string;
  baseUrl?: string;
  extraParams?: Record<string, string>;
  stateParams?: (number | string)[];
  parentName?: string;
  searchParams?: string[];
};

const fetchServices = (
  path: string,
  subType: string,
): Promise<AxiosResponse<TService[]>> =>
  apiClient.aapi.get('/service', {
    params: {
      type: path,
      subType,
      external: false,
    },
  });

export default function useServiceLoader(appId: string) {
  const shell = useShell();
  const navigation = shell.getPlugin('navigation');

  return {
    async loadServices(
      path: string,
      subType?: string,
      applicationId = appId,
    ): Promise<SidebarMenuItem[]> {
      const { data: services } = await fetchServices(path, subType);

      const menuItems: SidebarMenuItem[] = services.map((service: TService) => {
        const item: SidebarMenuItem = {
          id: `service-${path}-${service.serviceName}`,
          label: service.displayName,
          extraParams: service.extraParams,
          stateParams: service.stateParams || [],
          searchParams: service.searchParams || [],
          href: navigation.getURL(
            applicationId,
            service.url || service.baseUrl || '',
          ),
          parentName: service.parentName,
          serviceName: service.serviceName,
        };

        return item;
      });

      return menuItems.sort((a: SidebarMenuItem, b: SidebarMenuItem) =>
        a.label?.localeCompare(b.label),
      );
    },
  };
}
