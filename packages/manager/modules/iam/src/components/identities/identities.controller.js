import { IDENTITY_TYPE } from '../../iam.constants';
import { decodeIdentityUrn } from '../../iam.paramTypes';

export default class IdentitiesController {
  /* @ngInject */
  constructor() {
    this.userIdentities = [];
    this.groupIdentities = [];
    this.accountIdentities = [];
    this.serviceAccountIdentities = [];
  }

  $onChanges() {
    this.decodeIdentities();
  }

  decodeIdentities() {
    const decodedIdentities = this.identities.map(decodeIdentityUrn);

    this.userIdentities = decodedIdentities.filter(
      (i) => i.type === IDENTITY_TYPE.USER,
    );

    this.groupIdentities = decodedIdentities.filter(
      (i) => i.type === IDENTITY_TYPE.GROUP,
    );

    this.accountIdentities = decodedIdentities.filter(
      (i) => i.type === IDENTITY_TYPE.ACCOUNT,
    );

    this.serviceAccountIdentities = decodedIdentities.filter(
      (i) => i.type === IDENTITY_TYPE.SERVICE_ACCOUNT,
    );
  }
}
