import { v6 } from '@ovh-ux/manager-core-api';

export type TServiceInfo = {
  canTerminate: boolean;
  engagedUpTo: string | null;
  contacts: {
    admin: string;
    tech: string;
    billing: string;
  };
};

export type TTerminateParams = {
  serviceName: string;
  reason?: string;
};

export type TChangeContactParams = {
  serviceName: string;
  contactType: 'admin' | 'tech' | 'billing';
  newContact: string;
};

export type TCommitmentParams = {
  serviceName: string;
  duration: '12' | '24';
};

export const getServiceInfo = async (
  serviceName: string,
): Promise<TServiceInfo> => {
  const { data } = await v6.get<TServiceInfo>(
    `/vps/${serviceName}/serviceInfos`,
  );
  return data;
};

export const terminateService = async (
  params: TTerminateParams,
): Promise<void> => {
  await v6.post(`/vps/${params.serviceName}/terminate`, {
    reason: params.reason,
  });
};

export const changeContact = async (
  params: TChangeContactParams,
): Promise<void> => {
  await v6.post(`/vps/${params.serviceName}/changeContact`, {
    contactType: params.contactType,
    contactNic: params.newContact,
  });
};

export const subscribeCommitment = async (
  params: TCommitmentParams,
): Promise<void> => {
  await v6.post(`/vps/${params.serviceName}/commitment`, {
    duration: params.duration,
  });
};
