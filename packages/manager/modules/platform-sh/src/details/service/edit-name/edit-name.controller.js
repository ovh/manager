import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($q, $translate, PlatformSh) {
    this.$q = $q;
    this.$translate = $translate;
    this.PlatformSh = PlatformSh;
  }

  $onInit() {
    this.isEditing = false;
    this.name = this.project.projectName;
  }

  edit() {
    this.isEditing = true;
    return this.PlatformSh
      .updateName(this.projectId, this.name)
      .then(() => {
        this.project.projectName = this.name;
        return this.goBack(
          this.$translate.instant(
            'platform_sh_details_service_name_success',
          ),
        );
      })
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'platform_sh_details_service_name_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      )
      .finally(() => {
        this.isEditing = false;
      });
  }
}
