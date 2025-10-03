import { IpDetails, IpTypeEnum } from '@/data/api';
import { IPRoutedServiceType, getTypeByServiceName } from '@/utils';

export const isAdditionalOrDedicated = (ipDetails: IpDetails) =>
  ipDetails?.type === IpTypeEnum.ADDITIONAL ||
  ipDetails?.type === IpTypeEnum.DEDICATED;

export const isLinkedServiceNameDedicated = (ipDetails: IpDetails) =>
  getTypeByServiceName({ serviceName: ipDetails?.routedTo?.serviceName }) ===
  IPRoutedServiceType.DEDICATED;

export const isGameFirewallEnabled = (ipDetails: IpDetails) =>
  isAdditionalOrDedicated(ipDetails) && isLinkedServiceNameDedicated(ipDetails);

export const isAntiDdosEnabled = (ipDetails: IpDetails) =>
  ipDetails?.version === 4;

export const isVmacEnabled = (ipDetails: IpDetails) =>
  isAdditionalOrDedicated(ipDetails) && isLinkedServiceNameDedicated(ipDetails);
