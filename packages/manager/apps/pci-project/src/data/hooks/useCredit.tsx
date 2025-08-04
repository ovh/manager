import { useQuery } from '@tanstack/react-query';
import { getCreditDetails } from '@/data/api/credit';
import { CreditDetailsResponse } from '@/data/types/credit.type';

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
