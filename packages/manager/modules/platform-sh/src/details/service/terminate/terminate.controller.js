import get from 'lodash/get';

export default class PlatformShTerminateCtrl {
  /* @ngInject */
  constructor($translate, PlatformSh) {
    this.$translate = $translate;
    this.PlatformSh = PlatformSh;
  }

  $onInit() {
    this.isDeleting = false;
  }

  terminate() {
    this.isDeleting = true;
    return this.PlatformSh.terminateProject(this.projectId)
      .then(() =>
        this.goBack(this.$translate.instant('platform_sh_service_terminate_success')),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('platform_sh_service_terminate_error', {
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }
}
