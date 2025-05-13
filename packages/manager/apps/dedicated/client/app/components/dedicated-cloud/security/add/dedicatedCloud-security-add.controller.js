export default class {
  /* @ngInject */
  constructor($translate, DedicatedCloud, REGEX) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.REGEX = REGEX;
  }

  $onInit() {
    this.regex = this.REGEX;
    this.newNetwork = {
      value: null,
    };
  }

  addEntry() {
    this.loading = true;
    return this.DedicatedCloud.addSecurityPolicy(
      this.productId,
      this.newNetwork,
    )
      .then(() => {
        this.goBack(
          this.$translate.instant(
            'dedicatedCloud_configuration_SECURITY_policy_add_success',
          ),
        );
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_configuration_SECURITY_policy_add_fail',
            {
              t0: this.newNetwork.value,
            },
          )} ${err.message || err}`,
          'danger',
        );
      });
  }
}
