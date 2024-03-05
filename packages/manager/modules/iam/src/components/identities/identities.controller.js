import { IDENTITY_TYPE } from '../../iam.constants';
import { decodeIdentityUrn } from '../../iam.paramTypes';

export default class IdentitiesController {
  /* @ngInject */
  constructor($scope) {
    this.$scope = $scope;

    this.userIdentities = [];
    this.groupIdentities = [];
    this.accountIdentities = [];
    this.serviceAccountIdentities = [];
  }

  $onInit = async () => {
    this.loading = true;

    this.$scope.$watch('$ctrl.identities', async () => {
      this.decodeIdentities();
    });
  };

  decodeIdentities = async () => {
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
  };
}
