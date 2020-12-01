import get from 'lodash/get';
import kebabCase from 'lodash/kebabCase';

export default class BillingAutoRenewDeleteCtrl {
  /* @ngInject */
  constructor($translate, atInternet) {
    this.$translate = $translate;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.atInternet.trackPage({
      name: `autorenew::${kebabCase(this.service.serviceType)}::delete`,
      type: 'navigation',
      chapter1: 'dedicated',
      chapter2: 'account',
      chapter3: 'billing',
    });
  }

  deleteRenew() {
    this.atInternet.trackClick({
      name: `autorenew::${kebabCase(
        this.service.serviceType,
      )}::delete::confirm`,
      type: 'action',
      chapter1: 'dedicated',
      chapter2: 'account',
      chapter3: 'billing',
    });

    this.isDeleting = true;
    if (this.engagement) {
      return this.goBack();
    }

    this.service.setForResiliation();
    return this.updateService(this.service)
      .then(() =>
        this.goBack(
          `${this.$translate.instant('autorenew_service_delete_success')}
        <a data-href="${
          this.cancelResiliationUrl
        }" data-translate="autorenew_service_delete_cancel"></a>`,
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('autorenew_service_delete_error', {
            message: get(error, 'data.message'),
          }),
          'danger',
        ),
      );
  }
}
