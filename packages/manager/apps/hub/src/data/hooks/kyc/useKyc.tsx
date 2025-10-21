import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { getKycStatus } from '@/data/api/kyc';
import { KycProcedures, KycStatus } from '@/types/kyc.type';

export const useKyc = (procedure: KycProcedures) => {
  const useKycStatus = (options?: Partial<DefinedInitialDataOptions<KycStatus, AxiosError>>) =>
    useQuery<KycStatus, AxiosError>({
      ...options,
      queryKey: ['getKycStatus', procedure],
      queryFn: () => getKycStatus(procedure),
      retry: 0,
    });

  return {
    useKycStatus,
  };
};
