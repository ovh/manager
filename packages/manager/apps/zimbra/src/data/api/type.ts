export const ZimbraOffer = {
  STARTER: 'STARTER',
  PRO: 'PRO',
} as const;

export enum ZimbraPlanCodes {
  ZIMBRA_STARTER = 'zimbra-account-pp-starter',
  ZIMBRA_STARTER_BETA = 'zimbra-account-pp-starter-beta',
  ZIMBRA_PRO = 'zimbra-account-pp-pro',
}

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

export const CurrentAccountStatus = {
  BILLINGLOCKED: 'BILLINGLOCKED',
  BLOCKEDFORSPAM: 'BLOCKEDFORSPAM',
} as const;
