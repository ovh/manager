export type GetTypeByServiceNameParams = {
  serviceName: string;
};

export enum FailoverRoutedServiceType {
  DEDICATED = 'dedicated',
  PCC = 'pcc',
  CLOUD = 'cloud',
  VPS = 'vps',
  VRACK = 'vrack',
  LOADBALANCER = 'lb',
  PARKING = 'parking',
}

export const getTypeByServiceName = ({
  serviceName,
}: GetTypeByServiceNameParams): FailoverRoutedServiceType => {
  const dedicatedRegex = new RegExp(/^([a-z]{2}\d+.ip-[\d-]+.\w+)/);
  const pccRegex = new RegExp(/^(pcc[\d-]+)/);
  const cloudRegex = new RegExp(/^[\w\d]{32}/);
  const vpsRegex = new RegExp(/^vps[\w\d-.]+/);
  const vrackRegex = new RegExp(/^pn[\w\d-.]+/);
  const loadBalancerRegex = new RegExp(/^loadbalancer-[\w\d]+/);

  if (dedicatedRegex.test(serviceName))
    return FailoverRoutedServiceType.DEDICATED;
  if (pccRegex.test(serviceName)) return FailoverRoutedServiceType.PCC;
  if (cloudRegex.test(serviceName)) return FailoverRoutedServiceType.CLOUD;
  if (vpsRegex.test(serviceName)) return FailoverRoutedServiceType.VPS;
  if (vrackRegex.test(serviceName)) return FailoverRoutedServiceType.VRACK;
  if (loadBalancerRegex.test(serviceName))
    return FailoverRoutedServiceType.LOADBALANCER;

  return FailoverRoutedServiceType.PARKING;
};
