angular.module('App').controller(
  'DedicatedCloudOperationExecutionDateEditCtrl',
  class {
    constructor(
      $locale,
      $stateParams,
      $uibModalInstance,
      DedicatedCloud,
      operationToEdit,
    ) {
      this.$locale = $locale;
      this.$stateParams = $stateParams;
      this.$uibModalInstance = $uibModalInstance;
      this.DedicatedCloud = DedicatedCloud;
      this.operationToEdit = angular.copy(operationToEdit);

      this.model = {
        newExecutionDate: new Date().toISOString(),
      };

      this.loading = {
        save: false,
      };

      // angular locale formating is not the same as flatpickr
      this.dateFormat = this.$locale.DATETIME_FORMATS.short
        .replace('dd', 'd')
        .replace('MM', 'm')
        .replace('y', 'Y')
        .replace('HH', 'H')
        .replace('mm', 'i');
    }

    onExecutionDateEditFormSubmit() {
      this.loading.save = true;

      return this.DedicatedCloud.updateOperation(this.$stateParams.productId, {
        taskId: this.operationToEdit.taskId,
        data: {
          executionDate: this.model.newExecutionDate,
        },
      })
        .then(() => {
          this.$uibModalInstance.close();
        })
        .catch((error) => {
          this.$uibModalInstance.close(error);
        })
        .finally(() => {
          this.loading.save = false;
        });
    }
  },
);
