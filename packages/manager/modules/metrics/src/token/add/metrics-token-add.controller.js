import indexOf from 'lodash/indexOf';

export default class MetricsTokenAddCtrl {
  /* @ngInject */
  constructor($state, $stateParams, $translate, MetricService) {
    this.$state = $state;
    this.serviceName = $stateParams.serviceName;
    this.$translate = $translate;
    this.MetricService = MetricService;

    this.token = {};
    this.token.labels = [{ key: null, value: null }];

    this.permissions = [];
  }

  $onInit() {
    this.token.permission = 'read';
    this.token.serviceName = this.serviceName;
    this.permissions.push({
      value: 'read',
      text: this.$translate.instant('metrics_token_add_permission_read'),
    });
    this.permissions.push({
      value: 'write',
      text: this.$translate.instant('metrics_token_add_permission_write'),
    });
  }

  confirm() {
    this.loading = true;
    this.checkLabels();
    this.MetricService.addToken(this.token)
      .then(() =>
        this.$state.go('metrics.detail.token', {
          serviceName: this.serviceName,
        }),
      )
      .finally(() => {
        this.loading = false;
      });
  }

  static cancel() {
    window.history.back();
  }

  addLabel() {
    this.token.labels.push({ key: null, value: null });
  }

  removeLabel(label) {
    const index = indexOf(this.token.labels, label);
    if (index !== -1) {
      this.token.labels.splice(index, 1);
    }
  }

  static checkLabel(label) {
    return !!label.key && label.value !== null;
  }

  checkLabels() {
    this.token.labels = this.token.labels.filter((label) =>
      this.constructor.checkLabel(label),
    );
  }
}
