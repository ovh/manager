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

  attach() {
    this.loading = true;
    return this.Vrack.DedicatedServerInterface()
      .v6()
      .post(
        {
          serviceName: this.vrack,
        },
        {
          dedicatedServerInterface: this.interface.id,
        },
      )
      .$promise.then((task) => {
        return this.goBack(
          this.$translate.instant('server_vrack_attach_in_progress', {
            vRackname: this.vrack,
          }),
          'success',
        ).then(() => {
          this.interface.operation = 'attach';
          this.interface.setTaskInProgress(true);
          this.checkStatus(this.vrack, task.data.id).then(() => {
            this.interface.setVrack(this.vrack);
            this.interface.setTaskInProgress(false);
          });
        });
      })
      .catch(({ data, message }) => {
        return this.goBack(
          this.$translate.instant('server_error_vrack_attach', {
            vRackname: this.vrack,
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
