import get from 'lodash/get';

angular.module('App').controller(
  'NameEditionCtrl',
  class NameEditionCtrl {
    /* @ngInject */
    constructor(
      $translate,
      $interval,
      $state,
      $uibModalInstance,
      Alerter,
      DedicatedCloud,
      data,
    ) {
      this.$translate = $translate;
      this.$interval = $interval;
      this.$state = $state;
      this.$uibModalInstance = $uibModalInstance;
      this.Alerter = Alerter;
      this.DedicatedCloud = DedicatedCloud;
      this.data = data;
      this.$poll = null;
    }

    pollTask(taskId) {
      this.$poll = this.$interval(() => {
        this.DedicatedCloud.getOperation(this.data.productId, {
          taskId,
        })
          .then(({ state }) => {
            if (state === 'done') {
              this.stopPollTask();
              this.$state.reload();
            }
          })
          .catch(this.stopPollTask);
      }, 3000);
    }

    stopPollTask() {
      if (this.$poll) {
        this.$interval.cancel(this.$poll);
        this.$poll = null;
      }
    }

    updateDescription() {
      this.updating = true;

      return this.updateName()
        .then((data) => {
          if (this.data.successText) {
            this.Alerter.success(
              this.data.successText,
              this.data.destinationId,
            );
          }

          this.$uibModalInstance.close(this.newValue);
          if (data?.taskId) {
            this.pollTask(data.taskId);
          }
        })
        .catch((err) => {
          const message = this.$translate.instant(
            `${this.modalContextTitle}_edit_error`,
            {
              t0: this.newValue,
            },
          );
          const errorMessage = get(err, 'message', '');
          this.Alerter.error(
            `${message}. ${errorMessage}`.trim(),
            this.data.destinationId,
          );
          this.$uibModalInstance.dismiss();
        })
        .finally(() => {
          this.updating = false;
        });
    }

    $onInit() {
      this.newValue = this.data.value;
      this.contextTitle = this.data.contextTitle;

      switch (this.data.contextTitle) {
        case 'dedicatedCloud_description':
          this.modalContextTitle = 'dedicatedCloud_description';
          this.updateName = () =>
            this.DedicatedCloud.updateDescription(
              this.data.productId,
              this.newValue,
            );
          break;
        case 'dedicatedCloud_datacenter_name':
        case 'dedicatedCloud_datacenter_description':
          this.modalContextTitle = this.data.contextTitle;
          this.updateName = () =>
            this.DedicatedCloud.updateDatacenterData(
              this.data.productId,
              this.data.datacenterId,
              this.modalContextTitle.endsWith('name')
                ? { name: this.newValue }
                : { description: this.newValue },
            );
          break;
        default:
          this.modalContextTitle = 'description';
          this.updateName = angular.noop;
          break;
      }
    }

    $onDestroy() {
      this.stopPollTask();
    }
  },
);
