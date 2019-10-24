import map from 'lodash/map';

export default class PhonesController {
  /* @ngInject */
  constructor(
    $state,
    $translate,
    OvhApiTelephony,
    TucToast,
    TucToastError,
  ) {
    this.$state = $state;
    this.$translate = $translate;
    this.OvhApiTelephony = OvhApiTelephony;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
  }

  loadRow({ spare }) {
    return this.OvhApiTelephony
      .Spare()
      .v6()
      .getSpare({ spare })
      .$promise;
  }


  orderNewPhone() {
    return this.$state.go('spare.phones.order');
  }

  refresh() {
    this.phones = null;

    // reset cache to force reload
    this.OvhApiTelephony.Spare().v6().resetAllCache();

    return this.OvhApiTelephony.Spare()
      .v6()
      .query()
      .$promise.then((phones) => {
        this.phones = map(phones, spare => ({ spare }));
      });
  }
}
