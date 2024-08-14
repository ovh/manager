import get from 'lodash/get';
import { VPS_SNAPSHOT_GUIDE_URL } from './vps-rebuild.constants';

export default class VpsRebuildController {
  /* @ngInject */
  constructor(vpsRebuild, coreConfig) {
    this.vpsRebuild = vpsRebuild;
    this.coreConfig = coreConfig;
    this.VPS_SNAPSHOT_GUIDE_URL =
      VPS_SNAPSHOT_GUIDE_URL[coreConfig.getUser().ovhSubsidiary] ||
      VPS_SNAPSHOT_GUIDE_URL.DEFAULT;
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
