import apiClient from '@/api/client';

export enum RenewalTypeEnum {
  automaticForcedProduct = 'automaticForcedProduct',
  automaticV2012 = 'automaticV2012',
  automaticV2014 = 'automaticV2014',
  automaticV2016 = 'automaticV2016',
  manual = 'manual',
  oneShot = 'oneShot',
  option = 'option',
}

export enum ServiceStateEnum {
  expired = 'expired',
  inCreation = 'inCreation',
  ok = 'ok',
  pendingDebt = 'pendingDebt',
  unPaid = 'unPaid',
}

export type ServiceInfos = {
  canDeleteAtExpiration: boolean;
  contactAdmin: string;
  contactBilling: string;
  contactTech: string;
  creation: string;
  domain: string;
  engagedUpTo: string;
  expiration: string;
  possibleRenewPeriod: number[];
  renew: {
    automatic: boolean;
    deleteAtExpiration: boolean;
    forced: boolean;
    manualPayment: boolean;
    period: number;
  };
  renewalType: RenewalTypeEnum;
  serviceId: number;
  status: ServiceStateEnum;
};

export async function getServiceInfos(
  serviceType: string,
  serviceName: string,
): Promise<ServiceInfos> {
  const { data } = await apiClient.v6.get(
    `/${serviceType}/${serviceName}/serviceInfos`,
  );
  return data;
}

export default ServiceInfos;
