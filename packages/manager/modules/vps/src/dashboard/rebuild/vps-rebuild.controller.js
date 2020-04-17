import get from 'lodash/get';

export default class VpsRebuildController {
  /* @ngInject */
  constructor(vpsRebuild) {
    this.vpsRebuild = vpsRebuild;
  }

  $onInit() {
    this.vpsOptions = {
      doNotSendPassword: false,
    };
  }

  rebuildVps(options) {
    this.isLoading = true;
    return this.vpsRebuild
      .rebuildVps(this.serviceName, options)
      .then(() => this.goBack(false, 'success', {}, { reload: true }))
      .then(() => {
        this.displaySuccess();
      })
      .catch((error) =>
        this.goBack().then(() => {
          const errorDetail = get(error, 'data.message', error.message);
          this.displayError('vps_configuration_reinstall_fail', errorDetail);
        }),
      );
  }
}
