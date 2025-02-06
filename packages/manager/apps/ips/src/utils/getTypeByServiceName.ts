export type GetTypeByServiceNameParams = {
  serviceName: string;
};

export enum IPRoutedServiceType {
  DEDICATED = 'dedicated',
  HOSTING = 'housing',
  PCC = 'pcc',
  CLOUD = 'cloud',
  VPS = 'vps',
  VRACK = 'vrack',
  LOADBALANCER = 'lb',
  PARKING = 'parking',
}

export const getTypeByServiceName = ({
  serviceName,
}: GetTypeByServiceNameParams): IPRoutedServiceType => {
  if (!serviceName) return IPRoutedServiceType.PARKING;

  const dedicatedRegex = new RegExp(/^([a-z]{2}\d+.ip-[\d-]+.\w+)/);
  const pccRegex = new RegExp(/^(pcc[\d-]+)/);
  const cloudRegex = new RegExp(/^[\w\d]{32}/);
  const vpsRegex = new RegExp(/^vps[\w\d-.]+/);
  const vrackRegex = new RegExp(/^pn[\w\d-.]+/);
  const loadBalancerRegex = new RegExp(/^loadbalancer-[\w\d]+/);

  if (dedicatedRegex.test(serviceName)) return IPRoutedServiceType.DEDICATED;
  if (pccRegex.test(serviceName)) return IPRoutedServiceType.PCC;
  if (cloudRegex.test(serviceName)) return IPRoutedServiceType.CLOUD;
  if (vpsRegex.test(serviceName)) return IPRoutedServiceType.VPS;
  if (vrackRegex.test(serviceName)) return IPRoutedServiceType.VRACK;
  if (loadBalancerRegex.test(serviceName))
    return IPRoutedServiceType.LOADBALANCER;

  return IPRoutedServiceType.PARKING;
};
