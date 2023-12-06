import { useMutation } from '@tanstack/react-query';
import { addVoucher } from '@/data/voucher';

type Props = {
  projectId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export function useAddVoucher({ projectId, onError, onSuccess }: Props) {
  const mutation = useMutation({
    mutationFn: (code: string) => {
      return addVoucher(`${projectId}`, code);
    },
    onError,
    onSuccess,
  });

  return {
    add: (code: string) => {
      return mutation.mutate(code);
    },
    ...mutation,
  };
}

export default useAddVoucher;
