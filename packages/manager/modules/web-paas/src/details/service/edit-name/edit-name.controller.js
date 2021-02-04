import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($q, $translate, WebPaas) {
    this.$q = $q;
    this.$translate = $translate;
    this.WebPaas = WebPaas;
  }

  $onInit() {
    this.isEditing = false;
    this.name = this.project.projectName;
  }

  edit() {
    this.isEditing = true;
    return this.WebPaas.updateName(this.projectId, this.name)
      .then(() => {
        this.project.projectName = this.name;
        return this.goBack(
          this.$translate.instant('web_paas_details_service_name_success'),
        );
      })
      .catch((error) =>
        this.goBack(
          this.$translate.instant('web_paas_details_service_name_error', {
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      )
      .finally(() => {
        this.isEditing = false;
      });
  }
}
