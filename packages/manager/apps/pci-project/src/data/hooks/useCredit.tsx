import { useQuery } from '@tanstack/react-query';
import { getCreditDetails, CreditDetailsResponse } from '@/data/api/credit';

export interface VoucherCreditDetail {
  voucher: string;
  description: string;
  balance: string;
  expirationDate: string | null;
}

export const useCreditDetails = (projectId: string) => {
  return useQuery({
    queryKey: ['credit', projectId],
    queryFn: async () => {
      const response = await getCreditDetails(projectId);

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
