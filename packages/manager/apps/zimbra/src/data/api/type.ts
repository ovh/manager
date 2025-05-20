export const ZimbraOffer = {
  STARTER: 'STARTER',
  PRO: 'PRO',
} as const;

export const ZimbraPlanCodes = {
  ZIMBRA_ACCOUNT_PP_STARTER: 'zimbra-account-pp-starter',
  ZIMBRA_ACCOUNT_PP_PRO: 'zimbra-account-pp-pro',
} as const;

export type AccountStatistics = {
  offer: keyof typeof ZimbraOffer;
  configuredAccountsCount: number;
  availableAccountsCount: number;
};

export type ErrorResponse = {
  response: {
    status: number;
    data: { message: string };
  };
};

export const ResourceStatus = {
  CREATING: 'CREATING',
  DELETING: 'DELETING',
  ERROR: 'ERROR',
  READY: 'READY',
  UPDATING: 'UPDATING',
  SUSPENDED: 'SUSPENDED',
} as const;
