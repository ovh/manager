import { useMutation } from '@tanstack/react-query';
import { challengePaymentMethod } from '@/data/api/payment/payment-challenge';

export type TPaymentChallengeParams = {
  challenge: string;
  paymentMethodId: string;
};

export const usePaymentChallenge = () => {
  return useMutation({
    mutationFn: async ({
      paymentMethodId,
      challenge,
    }: TPaymentChallengeParams) =>
      challengePaymentMethod(paymentMethodId, challenge),
  });
};
