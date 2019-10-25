import map from 'lodash/map';

export default class PhonesController {
  /* @ngInject */
  constructor(
    OvhApiTelephony,
  ) {
    this.OvhApiTelephony = OvhApiTelephony;
  }

  loadRow({ spare }) {
    return this.OvhApiTelephony
      .Spare()
      .v6()
      .getSpare({ spare })
      .$promise;
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
