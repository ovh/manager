export default class NashaComponentsEditNameController {
  /* @ngInject */
  constructor($scope, $translate, $http) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.$http = $http;
    this.isSubmitting = false;
    this.name = '';
  }

  get baseName() {
    return this.nasha?.customName || '';
  }

  get canSubmit() {
    return (
      (this.$scope.editNameForm?.$valid && this.name !== this.baseName) || false
    );
  }

  $onInit() {
    this.name = this.baseName;
  }

  submit() {
    const { name: customName } = this;
    const { serviceName } = this.nasha;
    this.isSubmitting = true;
    this.$http
      .put(`/dedicated/nasha/${serviceName}`, { customName })
      .then(() =>
        this.close({
          success: this.$translate.instant('nasha_dashboard_edit_name_success'),
        }),
      )
      .catch((error) => this.dismiss({ error }));
  }
}
