export default class {
  /* @ngInject */
  constructor(
    $stateParams,
    OvhApiPackXdslHubic,
    TucToastError,
  ) {
    this.$stateParams = $stateParams;
    this.OvhApiPackXdslHubic = OvhApiPackXdslHubic;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    return this.OvhApiPackXdslHubic
      .Aapi()
      .query({ packId: this.$stateParams.packName })
      .$promise
      .then((data) => {
        this.hubicList = data;
      },
      err => new this.TucToastError(err));
  }
}
