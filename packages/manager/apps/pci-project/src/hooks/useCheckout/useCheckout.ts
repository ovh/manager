import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation } from '@tanstack/react-query';
import { checkoutCart } from '@/data/api/cart';
import { payWithRegisteredPaymentMean } from '@/data/api/payment';
import { CartSummary, PaymentMean } from '@/data/types/cart.type';

export const useCheckoutWithFidelityAccount = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (cartSummary: CartSummary) => void;
  onError?: (error: ApiError) => void;
}) =>
  useMutation({
    mutationFn: async ({ cartId }: { cartId: string }) => {
      const cartSummary = await checkoutCart(cartId);

      if (!cartSummary.orderId) {
        throw new Error('orderId should not be null');
      }

      if (cartSummary.prices.withTax.value === 0) {
        await payWithRegisteredPaymentMean(cartSummary.orderId, {
          paymentMean: PaymentMean.FIDELITY_ACCOUNT,
        });
      } else {
        throw new Error('A payment method is required for this order.');
      }

      return cartSummary;
    },
    onSuccess,
    onError,
  });
