import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($locale, $translate, DedicatedCloud, $timeout) {
    this.$locale = $locale;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.$timeout = $timeout;
  }

  $onInit() {
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
    this.$timeout(() => {
      return this.DedicatedCloud.updateOperation(this.productId, {
        taskId: this.operationToEdit.taskId,
        data: {
          executionDate: this.model.newExecutionDate,
        },
      })
        .then(() =>
          this.goBack(
            this.$translate.instant('dedicatedCloud_OPERATIONS_success'),
          ),
        )
        .catch((error) =>
          this.goBack(
            `${this.$translate.instant(
              'dedicatedCloud_OPERATIONS_error',
            )} ${get(error, 'message', '')}`,
            'danger',
          ),
        );
    }, 500); // to wait for newExecutionDate change sync
  }
}
