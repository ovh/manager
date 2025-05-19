import {
  ACCOUNT_FORMAT,
  ACCOUNT_PATTERN,
  ACCOUNT_URN,
} from './accountDelegation.constants';

export default class {
  /* @ngInject */
  constructor(coreConfig) {
    this.ACCOUNT_PATTERN = ACCOUNT_PATTERN;
    this.ACCOUNT_FORMAT = ACCOUNT_FORMAT;
    this.region = coreConfig.getRegion().toLowerCase();
    this.delegatedAccount = undefined;
  }

  onConfirm() {
    const urn = `${ACCOUNT_URN}${this.delegatedAccount.toLowerCase()}`.replace(
      '{region}',
      this.region,
    );
    this.onAddAccount({ urn });
    this.onClose();
  }
}
