export const EDITABLE_BANK_ACCOUNT_STATUS = [
  'ACTIVE',
  'BLOCKED',
  'DISABLED',
  'REJECTED',
];

export const canEditBankAccount = (bankAccount) =>
  EDITABLE_BANK_ACCOUNT_STATUS.includes(bankAccount.status);

export default {
  canEditBankAccount,
};
