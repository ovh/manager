import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useIsStartupProgramAvailable,
  useStartupProgramAmountText,
} from '@/data/hooks/useCredit';
import {
  Cart,
  CartConfiguration,
  OrderedProduct,
} from '@/data/types/cart.type';
import { TPaymentMethod } from '@/data/types/payment/payment-method.type';
import { GlobalStateStatus } from '@/types/WillPayment.type';
import WillPaymentComponent from '../components/payment/WillPayment.component';
import StartupProgram from '../components/startup-program/StartupProgram';
import Voucher from '../components/voucher/Voucher';
import { useWillPaymentConfig } from '../hooks/useWillPaymentConfig';

export type PaymentStepProps = {
  cart: Cart;
  cartProjectItem: OrderedProduct;
  onPaymentStatusChange?: (willPaymentStatus: GlobalStateStatus) => void;
  onRegisteredPaymentMethodSelected: (event: CustomEvent) => void;
  onRequiredChallengeEvent: (event: CustomEvent) => void;
  onVoucherChange?: (voucher: string | null) => void;
};

type PaymentForm = {
  voucherConfiguration: CartConfiguration | undefined;
  paymentMethod: TPaymentMethod | undefined;
  isAsDefault: boolean;
};

export default function PaymentStep({
  cart,
  cartProjectItem,
  onPaymentStatusChange,
  onRegisteredPaymentMethodSelected,
  onRequiredChallengeEvent,
  onVoucherChange,
}: Readonly<PaymentStepProps>) {
  const [searchParams] = useSearchParams();
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    voucherConfiguration: undefined,
    paymentMethod: undefined,
    isAsDefault: false,
  });

  const willPaymentConfig = useWillPaymentConfig({
    onPaymentStatusChange,
  });

  const initialVoucher = searchParams.get('voucher') ?? null;

  const handleVoucherConfigurationChange = (
    voucherConfiguration: CartConfiguration | undefined,
  ) => {
    setPaymentForm((prev) => ({
      ...prev,
      voucherConfiguration,
    }));
    if (voucherConfiguration) {
      // Needed because the voucher configuration might be empty but attached
      if (voucherConfiguration?.value !== '') {
        onVoucherChange?.(voucherConfiguration?.value);
      }
    } else {
      onVoucherChange?.(null);
    }
  };

  const { data: isStartupProgramAvailable } = useIsStartupProgramAvailable();
  const { data: startupProgramAmountText } = useStartupProgramAmountText(
    isStartupProgramAvailable ?? false,
  );

  return (
    <div className="flex flex-col gap-8">
      <Voucher
        cartId={cart.cartId}
        itemId={cartProjectItem.itemId}
        voucherConfiguration={paymentForm.voucherConfiguration}
        setVoucherConfiguration={handleVoucherConfigurationChange}
        initialVoucher={initialVoucher}
      />

      <WillPaymentComponent
        config={willPaymentConfig}
        onRegisteredPaymentMethodSelected={onRegisteredPaymentMethodSelected}
        onRequiredChallengeEvent={onRequiredChallengeEvent}
      />

      {isStartupProgramAvailable && startupProgramAmountText && (
        <StartupProgram value={startupProgramAmountText} />
      )}
    </div>
  );
}
