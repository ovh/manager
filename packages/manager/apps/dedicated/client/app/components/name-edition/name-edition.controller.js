import get from 'lodash/get';

angular
  .module('App')
  .controller('NameEditionCtrl', class NameEditionCtrl {
    /* @ngInject */
    constructor(
      $translate,
      $uibModalInstance,
      Alerter,
      DedicatedCloud,
      data,
    ) {
      this.$translate = $translate;
      this.$uibModalInstance = $uibModalInstance;
      this.Alerter = Alerter;
      this.DedicatedCloud = DedicatedCloud;
      this.data = data;
    }

    updateDescription() {
      this.updating = true;

      return this.updateName()
        .then(() => {
          if (this.data.successText) {
            this.Alerter.success(this.data.successText, this.data.destinationId);
          }

          this.$uibModalInstance.close(this.newValue);
        })
        .catch((err) => {
          const message = this.$translate.instant(`${this.modalContextTitle}_edit_error`, {
            t0: this.newValue,
          });
          const errorMessage = get(err, 'message', '');
          this.Alerter.error(`${message}. ${errorMessage}`.trim(), this.data.destinationId);
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
          this.updateName = () => this.DedicatedCloud.updateDescription(
            this.data.productId,
            this.newValue,
          );
          break;
        case 'dedicatedCloud_datacenter_name':
          this.modalContextTitle = 'dedicatedCloud_datacenter_name';
          this.updateName = () => this.DedicatedCloud.updateDatacenterName(
            this.data.productId,
            this.data.datacenterId,
            this.newValue,
          );
          break;
        case 'dedicatedCloud_datacenter_description':
          this.modalContextTitle = 'dedicatedCloud_datacenter_description';
          this.updateName = () => this.DedicatedCloud.updateDatacenterDescription(
            this.data.productId,
            this.data.datacenterId,
            this.newValue,
          );
          break;
        default:
          this.modalContextTitle = 'description';
          this.updateName = angular.noop;
          break;
      }
    }
  });
