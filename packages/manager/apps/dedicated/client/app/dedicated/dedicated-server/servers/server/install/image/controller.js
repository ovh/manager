import get from 'lodash/get';
import filter from 'lodash/filter';

import { BYOI_GUIDE_URLS } from './constants';

export default class DedicatedServerInstallImageCtrl {
  /* @ngInject */
  constructor(atInternet, dedicatedServerInstallImage) {
    this.atInternet = atInternet;
    this.dedicatedServerInstallImage = dedicatedServerInstallImage;

    this.launchInstallError = null;
  }

  /*= =====================================
  =            Initialization            =
  ====================================== */

  $onInit() {
    this.byoiGuideLink = get(
      BYOI_GUIDE_URLS,
      this.user.ovhSubsidiary,
      get(BYOI_GUIDE_URLS, 'GB'),
    );
  }

  /* -----  End of Initialization  ------*/

  /*= =============================
  =            Events            =
  ============================== */

  onImageFormSubmit() {
    this.atInternet.trackClick({
      name: `dedicated::dedicated::server::system-install::public-catalog::configdrive::${
        this.model.configdrive.enable ? 'activate' : 'deactivate'
      }`,
      type: 'action',
    });
    this.atInternet.trackClick({
      name:
        'dedicated::dedicated::server::system-install::personalized-image::install',
      type: 'action',
    });
    this.loaders.launchInstall = true;
    this.launchInstallError = null;

    const httpHeader = filter(
      this.model.httpHeader,
      ({ model }) => model.key && model.value,
    ).map(({ model }) => model);

    let configdrive = {
      enable: this.model.configdrive.enable || false,
    };
    if (configdrive.enable) {
      configdrive = {
        ...configdrive,
        hostname: this.model.configdrive.hostname,
        sshKey: this.model.configdrive.sshKey,
        userData: this.model.configdrive.userData,
        userMetadatas: filter(
          this.model.configdrive.metadata,
          ({ model }) => model.key && model.value,
        ).map(({ model }) => model),
      };
    }

    const installData = {
      URL: this.model.url,
      checkSum: this.model.checkSum,
      checkSumType: this.model.checkSumType,
      description: this.model.description,
      diskGroupId: this.model.diskGroup.diskGroupId,
      type: this.model.imageType,
      httpHeader,
      configdrive,
    };

    return this.dedicatedServerInstallImage
      .startInstall(this.server.name, installData)
      .then(() => this.goDashboard())
      .catch((error) => {
        this.launchInstallError = error;
      })
      .finally(() => {
        this.loaders.launchInstall = false;
      });
  }

  onLaunchInstallErrorDismiss() {
    this.launchInstallError = null;
  }

  /* -----  End of Events  ------*/
}
