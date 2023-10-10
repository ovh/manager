import { aapi } from '@ovh-ux/manager-core-api';
import { useShell } from '@/context';
import { SidebarMenuItem } from '../sidebarMenu';

export default function useServiceLoader(appId: string) {
  const shell = useShell();
  const navigation = shell.getPlugin('navigation');

  return {
    async loadServices(
      path: string,
      subType?: string,
      applicationId = appId
    ): Promise<SidebarMenuItem[]> {
      const services = await aapi
        .get('/service', {
          params: {
            type: path,
            subType,
            external: false,
          },
        })
        .then(({ data }) => data);
      return services
        .map((service: any) => ({
          id: `service-${path}-${service.serviceName}`,
          label: service.displayName,
          extraParams: service.extraParams,
          stateParams: service.stateParams || [],
          searchParams: service.searchParams || [],
          href: navigation.getURL(applicationId, service.url || service.baseUrl || ''),
          parentName: service.parentName,
          serviceName: service.serviceName,
        }))
        .sort((a: SidebarMenuItem, b: SidebarMenuItem) => {
          return a.label?.localeCompare(b.label);
        });
    },
  };
}
