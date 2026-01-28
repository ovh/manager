import { IpTypeEnum } from '@/data/constants';

export const getTypeByServiceName = (
  serviceName?: string | null,
): IpTypeEnum | null => {
  if (!serviceName) {
    return null;
  }

  const dedicatedRegex = new RegExp(/^([a-z]{2}\d+.ip-[\d-]+.\w+)/);
  const pccRegex = new RegExp(/^(pcc[\d-]+)/);
  const cloudRegex = new RegExp(/^[\w\d]{32}/);
  const vpsRegex = new RegExp(/^vps[\w\d-.]+/);
  const vrackRegex = new RegExp(/^pn[\w\d-.]+/);
  const loadBalancerRegex = new RegExp(/^loadbalancer-[\w\d]+/);

  if (dedicatedRegex.test(serviceName)) return IpTypeEnum.DEDICATED;
  if (pccRegex.test(serviceName)) return IpTypeEnum.PCC;
  if (cloudRegex.test(serviceName)) return IpTypeEnum.CLOUD;
  if (vpsRegex.test(serviceName)) return IpTypeEnum.VPS;
  if (vrackRegex.test(serviceName)) return IpTypeEnum.VRACK;
  if (loadBalancerRegex.test(serviceName)) return IpTypeEnum.LOAD_BALANCING;

  return null;
};
