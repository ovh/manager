export default class {
  /* @ngInject */
  constructor($translate, OvhApiVrack, Poller) {
    this.Vrack = OvhApiVrack;
    this.$translate = $translate;
    this.Poller = Poller;
  }

  $onInit() {
    if (!this.interface) {
      this.goBack();
    }
  }

  detach() {
    this.loading = true;
    return this.Vrack.DedicatedServerInterface()
      .v6()
      .delete({
        serviceName: this.interface.vrack,
        dedicatedServerInterface: this.interface.id,
      })
      .$promise.then((task) => {
        return this.goBack(
          this.$translate.instant('server_vrack_detach_in_progress', {
            vRackname: this.interface.vrack,
          }),
          'success',
        ).then(() => {
          this.interface.operation = 'detach';
          this.interface.setTaskInProgress(true);
          this.checkStatus(this.interface.vrack, task.data.id).then(() => {
            this.interface.setVrack(null);
            this.interface.setTaskInProgress(false);
          });
        });
      })
      .catch(({ data, message }) => {
        return this.goBack(
          this.$translate.instant('server_error_vrack_detach', {
            vRackname: this.interface.vrack,
            error: data?.message || message,
          }),
          'error',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  checkStatus(vrack, taskId) {
    return this.Poller.poll(
      `/vrack/${vrack}/task/${taskId}`,
      {},
      {
        method: 'get',
        retryMaxAttempts: 6,
        successRule: {
          status: 'done',
        },
      },
    );
  }
}
