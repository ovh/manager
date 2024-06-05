import { useQuery } from '@tanstack/react-query';
import { getServiceInfos } from '../services';
import { OKMS } from '@/interface';
import { ErrorResponse } from '../GET/apiv2/services';

type ServiceLifecycleCurrent = {
  creationDate: string;
};

type ServiceLifecycle = {
  current: ServiceLifecycleCurrent;
};

type ServiceBilling = {
  engagement?: string | null;
  expirationDate?: string | null;
  nextBillingDate: string;
  lifecycle: ServiceLifecycle;
};

type ServiceContact = {
  customerCode: string;
  type: string;
};

type ServiceCustomer = {
  contacts: ServiceContact[];
};

export type KMSServiceInfos = {
  billing: ServiceBilling;
  customer: ServiceCustomer;
};

export const useKMSServiceInfos = (okms: OKMS) => {
  return useQuery<{ data: KMSServiceInfos }, ErrorResponse>({
    queryKey: ['okms/service/infos', okms.id],
    queryFn: () => getServiceInfos({ okms: okms.id }),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};
