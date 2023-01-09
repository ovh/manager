import { useShell } from '@/context';
import { SidebarMenuItem } from '../sidebarMenu';
import { useReket } from '@ovh-ux/ovh-reket';

export function useServiceLoader(appId: string) {
  const reketInstance = useReket();
  const shell = useShell();
  const navigation = shell.getPlugin('navigation');

  return {
    async loadServices(
      path: string,
      subType?: string,
    ): Promise<SidebarMenuItem[]> {
      const services = await reketInstance.get('/service', {
        requestType: 'aapi',
        params: {
          type: path,
          subType,
          external: false,
        },
      });
      return services
        .map((service: any) => ({
          id: `service-${path}-${service.serviceName}`,
          label: service.displayName,
          extraParams: service.extraParams,
          href: navigation.getURL(appId, service.url || service.baseUrl || ''),
          parentName: service.parentName,
          serviceName: service.serviceName,
        }))
        .sort((a: SidebarMenuItem, b: SidebarMenuItem) => {
          return a.label?.localeCompare(b.label);
        });
    },
  };
}
