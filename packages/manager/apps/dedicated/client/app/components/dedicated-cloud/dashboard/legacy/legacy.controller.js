import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import snakeCase from 'lodash/snakeCase';

export default class {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.allowDedicatedServerComplianceOptions =
      this.coreConfig.getRegion() !== 'US';
  }

  openModalToEditDescription() {
    return this.editDetails({
      contextTitle: 'dedicatedCloud_description',
      productId: this.productId,
      successText: this.$translate.instant(
        'dedicatedCloud_dashboard_nameModifying_success',
      ),
      value: this.currentService.description,
    });
  }

  buildDescription() {
    const productName = this.$translate.instant(
      `dedicatedCloud_type_${this.currentService.solution}`,
    );
    const versionDisplayValue =
      this.currentService.solution === 'VSPHERE' && this.currentService.version
        ? ` ${this.currentService.version.major}`
        : '';

    return `${productName}${versionDisplayValue}`;
  }

  getUserAccessPolicyLabel() {
    const policy = this.currentService.userAccessPolicy;
    const formattedPolicy = snakeCase(policy).toUpperCase();

    return isString(formattedPolicy) && !isEmpty(formattedPolicy)
      ? this.$translate.instant(
          `dedicatedCloud_user_access_policy_${formattedPolicy}`,
        )
      : '-';
  }
}
