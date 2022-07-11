export default class NashaComponentsTaskTracker {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  onDone($success, $error) {
    return this.goBack({
      reload: true,
      ...($success && {
        success: this.$translate.instant(
          `nasha_components_task_tracker_operation_${this.operation}_success`,
          this.params,
        ),
      }),
      ...($error && {
        error: this.$translate.instant(
          `nasha_components_task_tracker_operation_${this.operation}_error`,
          { ...this.params, error: $error },
        ),
      }),
    });
  }
}
