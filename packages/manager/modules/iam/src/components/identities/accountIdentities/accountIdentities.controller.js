import { IDENTITY_TYPE, ENTITY, URN_VERSION } from '../../../iam.constants';
import { encodeIdentityUrn } from '../../../iam.paramTypes';

export default class serviceAccountIdentitiesController {
  /* @ngInject */
  constructor(coreConfig) {
    this.region = coreConfig.getRegion();

    this.isAddingAccount = false;
  }

  // ADD ACCOUNT MODAL
  openAddAccountModal = () => {
    this.isAddingAccount = true;
  };

  closeAddAccountModal = () => {
    this.isAddingAccount = false;
  };

  onAddAccount = (account) => {
    const userUrn = encodeIdentityUrn({
      version: URN_VERSION,
      region: this.region,
      entity: ENTITY.IDENTITY,
      type: IDENTITY_TYPE.ACCOUNT,
      account,
    });

    this.addIdentities([userUrn]);
    this.isAddingAccount = false;
  };
}
