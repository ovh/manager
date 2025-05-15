export const ServiceBillingState = {
  CANCELED: 'CANCELED',
  CANCELATION_PLANNED: 'CANCELATION_PLANNED',
  AUTOMATIC_RENEWAL: 'AUTOMATIC_RENEWAL',
  MANUAL_RENEWAL: 'MANUAL_RENEWAL',
  UNHANDLED: 'UNHANDLED',
} as const;

export type SlotService = {
  id: number;
  nextBillingDate?: string;
  state: keyof typeof ServiceBillingState;
};
