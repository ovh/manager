import { ClientNavigationApi } from '@ovh-ux/shell/dist/types/plugin/navigation';

import { IpTypeEnum } from '@/data/constants';

import { getTypeByServiceName } from './getTypeByServiceName';

export type GetLinkByServiceNameParams = {
  serviceName?: string | null;
  navigation: ClientNavigationApi;
};

export const getLinkByServiceName = ({
  serviceName,
  navigation,
}: GetLinkByServiceNameParams): Promise<string> => {
  if (!serviceName || !navigation) {
    return Promise.resolve('#');
  }

  const serviceType = getTypeByServiceName(serviceName);

  switch (serviceType) {
    case IpTypeEnum.DEDICATED:
      return navigation.getURL(
        'dedicated',
        `#/server/${serviceName}`,
        {},
      ) as Promise<string>;
    case IpTypeEnum.PCC:
      return navigation.getURL(
        'dedicated',
        `#/dedicated_cloud/${serviceName}`,
        {},
      ) as Promise<string>;
    case IpTypeEnum.CLOUD:
      return navigation.getURL(
        'public-cloud',
        `#/pci/project/${serviceName}`,
        {},
      ) as Promise<string>;
    case IpTypeEnum.VRACK:
      return navigation.getURL(
        'dedicated',
        `#/vrack/${serviceName}`,
        {},
      ) as Promise<string>;
    case IpTypeEnum.VPS:
      return navigation.getURL(
        'dedicated',
        `#/vps/${serviceName}`,
        {},
      ) as Promise<string>;
    case IpTypeEnum.LOAD_BALANCING:
      return navigation.getURL(
        'dedicated',
        `#/iplb/${serviceName}`,
        {},
      ) as Promise<string>;
    default:
      return Promise.resolve('#');
  }
};
