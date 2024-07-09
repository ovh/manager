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

    const newUsers = decodedIdentities.filter(
      (i) => i.type === IDENTITY_TYPE.USER,
    );

    const newGroups = decodedIdentities.filter(
      (i) => i.type === IDENTITY_TYPE.GROUP,
    );

    const newAccounts = decodedIdentities.filter(
      (i) => i.type === IDENTITY_TYPE.ACCOUNT,
    );

    const newServiceAccounts = decodedIdentities.filter(
      (i) => i.type === IDENTITY_TYPE.SERVICE_ACCOUNT,
    );

    if (!angular.equals(newUsers, this.userIdentities)) {
      this.userIdentities = newUsers;
    }

    if (!angular.equals(newGroups, this.groupIdentities)) {
      this.groupIdentities = newGroups;
    }

    if (!angular.equals(newAccounts, this.accountIdentities)) {
      this.accountIdentities = newAccounts;
    }

    if (!angular.equals(newServiceAccounts, this.serviceAccountIdentities)) {
      this.serviceAccountIdentities = newServiceAccounts;
    }
  }

  onAddIdentities(urns) {
    this.onAdd({ urns });
  }

  onRemoveIdentity(urn) {
    this.onRemove({ urn });
  }
}
