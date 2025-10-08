export enum IpTypeEnum {
  CDN = 'cdn',
  CLOUD = 'cloud',
  DEDICATED = 'dedicated',
  ADDITIONAL = 'failover',
  HOSTED_SSL = 'hosted_ssl',
  HOUSING = 'housing',
  LOAD_BALANCING = 'loadBalancing',
  MAIL = 'mail',
  OVERTHEBOX = 'overthebox',
  PCC = 'pcc',
  PCI = 'pci',
  PRIVATE = 'private',
  VPN = 'vpn',
  VPS = 'vps',
  VRACK = 'vrack',
  XDSL = 'xdsl',
}

export const PRODUCT_PATHS_AND_CATEGORIES = {
  [IpTypeEnum.CLOUD]: { path: '/cloud/project', category: IpTypeEnum.CLOUD },
  [IpTypeEnum.DEDICATED]: {
    path: '/dedicated/server',
    category: IpTypeEnum.DEDICATED,
  },
  [IpTypeEnum.VPS]: { path: '/vps', category: IpTypeEnum.VPS },
  [IpTypeEnum.VRACK]: { path: '/vrack', category: IpTypeEnum.VRACK },
  [IpTypeEnum.PCC]: { path: '/dedicatedCloud', category: IpTypeEnum.PCC },
  [IpTypeEnum.LOAD_BALANCING]: {
    path: '/ipLoadbalancing',
    category: IpTypeEnum.LOAD_BALANCING,
  },
  [IpTypeEnum.XDSL]: {
    pathList: ['/xdsl', '/pack/xdsl'],
    category: IpTypeEnum.XDSL,
  },
  [IpTypeEnum.OVERTHEBOX]: {
    path: '/overTheBox',
    category: IpTypeEnum.OVERTHEBOX,
  },
};
