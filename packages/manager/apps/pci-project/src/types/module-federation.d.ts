import { TWillPaymentConfig } from './WillPayment.type';

declare module 'willPayment/WillPayment' {
  export default function setupWillPayment(
    slot: HTMLSlotElement,
    config: {
      configuration: TWillPaymentConfig;
    },
  ): void;
}
