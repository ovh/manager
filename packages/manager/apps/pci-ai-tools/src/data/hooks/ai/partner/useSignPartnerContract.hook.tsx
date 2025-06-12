import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AIError } from '@/data/api';
import {
  PartnerApp,
  signPartnerContract,
} from '@/data/api/ai/partner/partner.api';
import ai from '@/types/AI';

interface SignContractProps {
  onError: (cause: AIError) => void;
  onSuccess?: (contract: ai.partner.Contract) => void;
}

export function useSignPartnerContract({
  onError,
  onSuccess,
}: SignContractProps) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (contractInfo: PartnerApp) => {
      return signPartnerContract(contractInfo);
    },
    onError,
    onSuccess: (data, contractInfo) => {
      // invalidate applist to avoid displaying
      queryClient.invalidateQueries({
        queryKey: [
          projectId,
          'ai',
          'partners',
          'region',
          contractInfo.region,
          'partner',
        ],
      });
      onSuccess(data);
    },
  });

  return {
    signPartnerContract: (contractInfo: PartnerApp) => {
      return mutation.mutate(contractInfo);
    },
    ...mutation,
  };
}
