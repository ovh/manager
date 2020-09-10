export default class {
  /* @ngInject */
  constructor($scope, $translate) {
    this.$scope = $scope;
    this.$translate = $translate;
  }

  $onInit() {
    if (this.dedicatedCloud.isExpired) {
      this.setMessage(this.$translate.instant('common_expired'), 'danger');
    }
  }

  editDescription(value) {
    return this.editDetails({
      contextTitle: 'dedicatedCloud_description',
      productId: this.productId,
      destinationId: 'dedicatedCloud',
      successText: this.$translate.instant(
        'dedicatedCloud_dashboard_nameModifying_success',
      ),
      value,
    }).result.then((newDescription) => {
      this.dedicatedCloud.description = newDescription;
    });
  }
}
