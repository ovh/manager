import {
  useIsStartupProgramAvailable,
  useStartupProgramAmountText,
} from '@/data/hooks/useCredit';
import {
  Cart,
  CartConfiguration,
  OrderedProduct,
} from '@/data/types/cart.type';
import { GlobalStateStatus } from '@/types/WillPayment.type';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import WillPaymentComponent from '../components/payment/WillPayment.component';
import StartupProgram from '../components/startup-program/StartupProgram';
import Voucher from '../components/voucher/Voucher';

export type PaymentStepProps = {
  cart: Cart;
  cartProjectItem: OrderedProduct;
  onPaymentStatusChange?: (willPaymentStatus: GlobalStateStatus) => void;
  onNoUserActionNeeded: (event: CustomEvent) => void;
  onRequiredChallengeEvent: (event: CustomEvent) => void;
  onVoucherChange?: (voucher: string | null) => void;
};

export default function PaymentStep({
  cart,
  cartProjectItem,
  onPaymentStatusChange,
  onNoUserActionNeeded,
  onRequiredChallengeEvent,
  onVoucherChange,
}: Readonly<PaymentStepProps>) {
  const [searchParams] = useSearchParams();
  const [voucherConfiguration, setVoucherConfiguration] = useState<
    CartConfiguration | undefined
  >(undefined);

  const initialVoucher = searchParams.get('voucher') ?? null;

  const handleVoucherConfigurationChange = (
    voucherConfig: CartConfiguration | undefined,
  ) => {
    setVoucherConfiguration(voucherConfig);
    if (voucherConfiguration) {
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
    <div className="flex flex-col gap-4">
      <Voucher
        cartId={cart.cartId}
        itemId={cartProjectItem.itemId}
        voucherConfiguration={voucherConfiguration}
        setVoucherConfiguration={handleVoucherConfigurationChange}
        initialVoucher={initialVoucher}
      />

      <WillPaymentComponent
        onPaymentStatusChange={onPaymentStatusChange}
        onNoUserActionNeeded={onNoUserActionNeeded}
        onRequiredChallengeEvent={onRequiredChallengeEvent}
      />

      {isStartupProgramAvailable && startupProgramAmountText && (
        <StartupProgram value={startupProgramAmountText} />
      )}
    </div>
  );
}
