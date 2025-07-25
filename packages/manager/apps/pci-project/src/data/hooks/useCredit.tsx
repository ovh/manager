import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getCreditDetails } from '@/data/api/credit';
import { CreditDetailsResponse } from '@/data/types/credit.type';
import { getCreditBalance, getStartupProgram } from '../api/credit';
import { TStartupProgram } from '../types/credit';

export interface VoucherCreditDetail {
  voucher: string;
  description: string;
  balance: string;
  expirationDate: string | null;
}

export const useCreditDetails = (projectId: string) => {
  return useQuery({
    queryKey: ['credit', projectId],
    queryFn: () => getCreditDetails(projectId),
    select: (response) => {
      const formattedData: VoucherCreditDetail[] =
        response.data?.map((creditDetail: CreditDetailsResponse) => ({
          voucher: creditDetail.voucher || 'Unknown',
          description: creditDetail.description || 'No description',
          balance: creditDetail.available_credit?.text || '0',
          expirationDate: creditDetail.validity?.to || null,
        })) || [];

      return formattedData;
    },
    enabled: !!projectId,
    refetchOnWindowFocus: false,
  });
};

export const useIsStartupProgramAvailable = (): UseQueryResult<boolean> => {
  return useQuery({
    queryKey: ['/me/credit/balance'],
    queryFn: getCreditBalance,
    select: (data) => data.includes('STARTUP_PROGRAM'),
  });
};

export const useStartupProgramAmountText = (
  isAvailable: boolean,
): UseQueryResult<string> => {
  return useQuery({
    queryKey: ['/me/credit/balance/STARTUP_PROGRAM'],
    queryFn: getStartupProgram,
    enabled: isAvailable,
    select: (data) => data.amount.text,
  });
};
