export type ServiceLinkName =
  | 'anticipatePayment'
  | 'buySMSCredits'
  | 'cancelCommitment'
  | 'cancelResiliation'
  | 'configureExchangeAccountsRenewal'
  | 'configureRenewal'
  | 'configureSMSAutoReload'
  | 'manageCommitment'
  | 'modifyExchangeBilling'
  | 'payBill'
  | 'renewManually'
  | 'resiliate'
  | 'resiliateByDeletion'
  | 'seeService'
  | 'warnBillingNic';

export type ServiceLinks = Partial<Record<ServiceLinkName, string>>;
