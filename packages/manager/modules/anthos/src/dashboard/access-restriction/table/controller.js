import IpBlock from './ipblock.class';
import { TRACKING_CHUNK } from '../constants';

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
    const { id, isNew } = ipBlock;
    const trackingAction = isNew ? 'add-restriction' : 'edit-restriction';
    this.trackClick(`${TRACKING_CHUNK}::${trackingAction}`);
    this.focus[id] = true;
    ipBlock.startEdition();
  }

  cancelAccessRestrictionEdition(ipBlock) {
    ipBlock.cancelEdition();
    this.focus[ipBlock.id] = false;
    if (ipBlock.isNew) {
      const { rows } = this;
      this.trackClick(`${TRACKING_CHUNK}::add-restriction-cancel`);
      this.canAddAccessRestriction = true;
      rows.splice(rows.indexOf(ipBlock), 1);
    } else {
      this.trackClick(`${TRACKING_CHUNK}::edit-restriction-cancel`);
    }
  }

  saveAccessRestriction(ipBlock) {
    const { serviceName } = this;
    const { isNew, value, oldValue } = ipBlock;
    const promise = isNew
      ? this.service.createAccessRestriction(serviceName, value)
      : this.service.updateAccessRestriction(serviceName, oldValue, value);
    const trackingAction = isNew
      ? 'add-restriction-confirm'
      : 'edit-restriction-confirm';

    this.trackClick(`${TRACKING_CHUNK}::${trackingAction}`);

    ipBlock.startLoading();

    promise
      .then(() => {
        const hasNew = this.rows.find(({ id }) => id === 'new');
        this.canAddAccessRestriction = isNew || !hasNew;
        ipBlock.cancelEdition().update(value);
        this.showSuccess('save');
      })
      .catch((error) => this.showError(error))
      .finally(() => {
        ipBlock.stopLoading();
      });
  }

  deleteAccessRestriction(ipBlock) {
    this.trackClick(`${TRACKING_CHUNK}::delete-restriction`);
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
