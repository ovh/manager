import find from 'lodash/find';

export default class {
  /* @ngInject */
  constructor($translate, DedicatedCloud) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
  }

  deleteEntries() {
    this.loading = true;
    this.DedicatedCloud[
      this.selectedPolicies.length > 1
        ? 'deleteSecurityPolicies'
        : 'deleteSecurityPolicy'
    ](this.productId, this.selectedPolicies)
      .then(() =>
        this.goBack(
          this.selectedPolicies.length > 1
            ? this.$translate.instant(
                'dedicatedCloud_configuration_SECURITY_policy_delete_success_other',
              )
            : this.$translate.instant(
                'dedicatedCloud_configuration_SECURITY_policy_delete_success_one',
              ),
        ),
      )
      .catch((err) =>
        this.goBack(
          `${this.$translate.instant(
            this.selectedPolicies.length > 1
              ? 'dedicatedCloud_configuration_SECURITY_policy_delete_fail_other'
              : 'dedicatedCloud_configuration_SECURITY_policy_delete_fail_one',
          )} ${err.message || err}`,
          'danger',
        ),
      );
  }

  getPolicyIP(id) {
    return find(this.policies, { id }).network;
  }
}
