import { useQuery, DefinedInitialDataOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { KycProcedures, KycStatus } from '@/types/kyc.type';
import { getKycStatus } from '@/data/api/kyc';

export const useKyc = (procedure: KycProcedures) => {
  const useKycStatus = (
    options?: Partial<DefinedInitialDataOptions<KycStatus, AxiosError>>,
  ) =>
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
