import { v6 } from '@ovh-ux/manager-core-api';
import { TChallengeStatus } from '@/data/types/payment/payment-challenge.type';

export const challengePaymentMethod = async (
  paymentMethodId: string,
  challenge: string,
): Promise<TChallengeStatus> =>
  v6
    .post(`/me/payment/method/${paymentMethodId}/challenge`, {
      challenge,
    })
    .then(() => 'success' as TChallengeStatus)
    .catch(({ status }) => {
      switch (status) {
        case 404:
        case 409:
          return 'deactivated' as TChallengeStatus;
        default:
          return 'retry' as TChallengeStatus;
      }
    });
