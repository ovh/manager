import { CIDR_FROM_EVERYWHERE } from './dedicatedCloud-security-add.constants';

export default class {
  /* @ngInject */
  constructor($translate, DedicatedCloud, REGEX, $http) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.$http = $http;
    this.REGEX = REGEX;
    this.isUnableToFetchIP = false;
  }

  $onInit() {
    this.regex = this.REGEX;
    this.newNetwork = {
      value: null,
    };
  }

  useMyCurrentIp() {
    this.loading = true;

    this.DedicatedCloud.getIpGeolocation()
      .then((data) => {
        this.newNetwork.value = data.ip;
      })
      .catch(() => {})
      .finally(() => {
        this.loading = false;
      });
  }

  useFromAnywhere() {
    this.newNetwork.value = CIDR_FROM_EVERYWHERE;
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
