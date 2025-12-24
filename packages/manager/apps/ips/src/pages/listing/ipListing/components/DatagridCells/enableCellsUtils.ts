import { IpDetails } from '@/data/api';
import { IpTypeEnum } from '@/data/constants';
import { getTypeByServiceName } from '@/utils';

export const isAdditionalOrDedicated = (ipDetails?: IpDetails) =>
  ipDetails?.type === IpTypeEnum.ADDITIONAL ||
  ipDetails?.type === IpTypeEnum.DEDICATED;

export const isLinkedServiceNameDedicated = (ipDetails?: IpDetails) =>
  getTypeByServiceName(ipDetails?.routedTo?.serviceName) ===
  IpTypeEnum.DEDICATED;

export const isGameFirewallAvailable = (ipDetails?: IpDetails) =>
  isAdditionalOrDedicated(ipDetails) && isLinkedServiceNameDedicated(ipDetails);

export const isAntiDdosAvailable = (ipDetails?: IpDetails) =>
  ipDetails?.version === 4;

export const isVmacAvailable = (ipDetails?: IpDetails) =>
  isAdditionalOrDedicated(ipDetails) && isLinkedServiceNameDedicated(ipDetails);
