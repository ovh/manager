import IpBlock from './ipblock.class';

export default class AnthosHostTableCtrl {
  /* @ngInject */
  constructor($translate, $timeout, $element, AnthosTenantsService) {
    this.$translate = $translate;
    this.$element = $element;
    this.$timeout = $timeout;
    this.service = AnthosTenantsService;
    this.rows = [];
    this.focus = {};
    this.canAddAccessRestriction = true;
    this.isLoading = true;
  }

  $onInit() {
    return this.service
      .getAccessRestrictions(this.serviceName)
      .then(({ data }) => {
        this.rows = data.map((item) => new IpBlock(item));
      })
      .catch((error) => this.showError(error))
      .finally(() => {
        this.isLoading = false;
      });
  }

  newAccessRestriction() {
    const ipBlock = new IpBlock();
    this.canAddAccessRestriction = false;
    this.rows.unshift(ipBlock);
    this.startAccessRestrictionEdition(ipBlock);
  }

  startAccessRestrictionEdition(ipBlock) {
    ipBlock.startEdition();
    this.focus[ipBlock.id] = true;
  }

  cancelAccessRestrictionEdition(ipBlock) {
    ipBlock.cancelEdition();
    this.focus[ipBlock.id] = false;
    if (ipBlock.isNew) {
      const { rows } = this;
      this.canAddAccessRestriction = true;
      rows.splice(rows.indexOf(ipBlock), 1);
    }
  }

  saveAccessRestriction(ipBlock) {
    const { serviceName } = this;
    const { isNew, value, oldValue } = ipBlock;
    const promise = isNew
      ? this.service.createAccessRestriction(serviceName, value)
      : this.service.updateAccessRestriction(serviceName, oldValue, value);

    ipBlock.startLoading();

    promise
      .then(() => {
        this.canAddAccessRestriction = isNew;
        ipBlock.cancelEdition().update(value);
        this.showSuccess('save');
      })
      .catch((error) => this.showError(error))
      .finally(() => {
        ipBlock.stopLoading();
      });
  }

  deleteAccessRestriction(ipBlock) {
    ipBlock.startLoading();
    this.service
      .deleteAccessRestriction(this.serviceName, ipBlock.value)
      .then(() => {
        const { rows } = this;
        rows.splice(rows.indexOf(ipBlock), 1);
        this.showSuccess('delete');
      })
      .catch((error) => this.showError(error));
  }

  showSuccess(action) {
    const verbatim = `anthos_dashboard_access_restriction_table_${action}_success`;
    const message = this.$translate.instant(verbatim);
    this.displayAlerterMessage('success', message);
  }

  showError(error) {
    const message = error.data?.message || error.message;
    this.displayAlerterMessage('error', message);
  }
}
