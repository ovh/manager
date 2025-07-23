import { useState } from 'react';
import PaymentMethods from '@/components/payment/PaymentMethods';
import {
  Cart,
  CartConfiguration,
  OrderedProduct,
} from '@/data/types/cart.type';
import Voucher from '../components/Voucher';

export type PaymentStepProps = {
  cart: Cart;
  cartProjectItem: OrderedProduct;
};

export type PaymentForm = {
  voucherConfiguration: CartConfiguration | undefined;
};

export default function PaymentStep({
  cart,
  cartProjectItem,
}: PaymentStepProps) {
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    voucherConfiguration: undefined,
  });

  return (
    <div className="flex flex-col gap-8">
      <Voucher
        cartId={cart.cartId}
        itemId={cartProjectItem.itemId}
        voucherConfiguration={paymentForm.voucherConfiguration}
        setVoucherConfiguration={(voucherConfiguration) =>
          setPaymentForm((prev) => ({
            ...prev,
            voucherConfiguration,
          }))
        }
      />

      <PaymentMethods
        handlePaymentMethodChange={() => {}}
        handleSetAsDefaultChange={() => {}}
        paymentMethodHandler={() => {}}
        handleValidityChange={() => {}}
        handlePaymentMethodChallenge={true}
      />
    </div>
  );
}
