export default class {
  /* @ngInject */
  constructor($translate, DedicatedCloud) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.maxSimultaneousConnections = {
      value: null,
      current: this.userLimitConcurrentSession,
    };
  }

  update() {
    this.loading = true;
    return this.DedicatedCloud.updateMaxConcurrentConnections(
      this.productId,
      this.maxSimultaneousConnections.value,
    )
      .then(() => {
        this.goBack(
          this.$translate.instant(
            'dedicatedCloud_SECURITY_change_nb_simultaneous_connection_success',
          ),
        );
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_SECURITY_change_nb_simultaneous_connection_failure',
          )} ${err.message || err}`,
        );
      });
  }
}
