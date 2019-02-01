import { TELEPHONY_URL } from './constants';

export default class {
  /* @ngInject */
  constructor(
    $scope,
    OvhApiPackXdslVoipEcofax,
    $stateParams,
  ) {
    this.$scope = $scope;
    this.OvhApiPackXdslVoipEcofax = OvhApiPackXdslVoipEcofax;
    this.$stateParams = $stateParams;
  }

  $onInit() {
    this.loading = true;
    this.services = [];

    return this.OvhApiPackXdslVoipEcofax
      .v6()
      .query({
        packId: this.pack.packName,
      })
      .$promise
      .then((services) => {
        this.services = [...services];
      })
      .finally(() => {
        this.loading = false;
      });
  }

  static generateV3Url(service) {
    // Build link to manager v3 for fax
    return TELEPHONY_URL.replace('{line}', service);
  }
}
