import difference from 'lodash/difference';

export default class {
  /* @ngInject */
  constructor($translate, DedicatedCloud) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.selectedAccessPolicy = {
      policies: [],
      value: null,
    };

    this.initAvailablePolicies();
  }

  initAvailablePolicies() {
    this.selectedAccessPolicy.policies = angular.copy(
      this.dedicatedCloud.userAccessPolicyEnum,
    );

    if (this.dedicatedCloud.capabilities.userAccessPolicyStatus !== 'ACTIVE') {
      this.selectedAccessPolicy.policies = difference(
        this.selectedAccessPolicy.policies,
        ['FILTERED'],
      );
    }
  }

  modifyPolicyAccess() {
    this.loading = true;
    return this.DedicatedCloud.modifyPolicyAccess(
      this.productId,
      this.selectedAccessPolicy.value,
    )
      .then(() => {
        this.goBack(
          this.$translate.instant(
            'dedicatedCloud_configuration_SECURITY_policy_access_success',
          ),
        );
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_configuration_SECURITY_policy_access_fail',
          )} ${err.message || err}`,
          'danger',
        );
      });
  }
}
