import { SUCCESS_KEY } from './upgrade-pack.constants';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.planCode = '';
    this.isStateLoading = false;
    this.packs = [];
  }

  $onInit() {
    this.planCode = this.pack?.planCode;
    this.packs = [this.packInfo.current, ...this.packInfo.upgrades];
    this.workflowOptions.getPlanCode = () => this.planCode;
    this.workflowOptions.onValidateSubmit = () => this.trackChangePack();
  }

  onSendCurrentState({ isLoading }) {
    this.isStateLoading = isLoading;
  }

  onSuccess(result) {
    const { autoPayWithPreferredPaymentMethod, url } = result;

    if (autoPayWithPreferredPaymentMethod) {
      this.goBack(this.$translate.instant(`${SUCCESS_KEY}_auto`), 'success');
    } else {
      const text = this.$translate.instant(`${SUCCESS_KEY}_order`);
      const link = this.$translate.instant(`${SUCCESS_KEY}_order_link`);
      this.trackChangePack('success');
      this.goBack(
        `<div>${text}</div><a href="${url}" target="_blank" rel="noopener">${link}</a>`,
        'success',
      );
    }
  }

  onError(error) {
    this.trackChangePack('error');
    return this.goBack(
      this.$translate.instant(
        `anthos_tenant_dashboard_general_information_upgrade_pack_error`,
        { error: error.data?.message || error.message },
      ),
      'error',
    );
  }
}
