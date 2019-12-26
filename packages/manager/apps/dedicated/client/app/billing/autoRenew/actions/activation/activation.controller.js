import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, atInternet) {
    this.$translate = $translate;
    this.atInternet = atInternet;
  }

  activate() {
    this.atInternet.trackClick({
      name: 'autorenew::activate',
      type: 'action',
      chapter1: 'dedicated',
      chapter2: 'account',
      chapter3: 'billing',
    });

    this.isActivating = true;
    return this.activateAutorenew()
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'billing_autorenew_service_activation_success',
          ),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'billing_autorenew_service_activation_error',
            { message: get(error, 'data.message') },
          ),
          'danger',
        ),
      );
  }
}
