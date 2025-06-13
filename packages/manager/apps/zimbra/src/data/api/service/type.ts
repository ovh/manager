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

export const SlotServiceTerminationPolicy = {
  empty: 'empty',
  terminateAtEngagementDate: 'terminateAtEngagementDate',
  terminateAtExpirationDate: 'terminateAtExpirationDate',
} as const;

export const SlotServiceRenewMode = {
  automatic: 'automatic',
  manual: 'manual',
} as const;

export type SlotServiceBodyParamsType = {
  displayName?: string;
  terminationPolicy?: keyof typeof SlotServiceTerminationPolicy;
  renew?: {
    mode?: keyof typeof SlotServiceRenewMode;
    period?: string;
  };
};
