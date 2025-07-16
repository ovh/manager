import PaymentMethods from '@/components/payment/PaymentMethods';

export default function PaymentStep() {
  return (
    <PaymentMethods
      handlePaymentMethodChange={() => {}}
      handleSetAsDefaultChange={() => {}}
      paymentMethodHandler={() => {}}
      handleValidityChange={() => {}}
      handlePaymentMethodChallenge={true}
    />
  );
}
