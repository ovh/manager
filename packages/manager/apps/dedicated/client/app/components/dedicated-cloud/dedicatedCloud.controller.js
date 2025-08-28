export default class {
  /* @ngInject */
  constructor($scope, $translate, constants) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.constants = constants;
  }

  $onInit() {
    this.isTabsHidden = this.hasVCDMigration;
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
        'dedicatedCloud_dashboard_editing_description_success',
      ),
      value,
    }).result;
  }
}
