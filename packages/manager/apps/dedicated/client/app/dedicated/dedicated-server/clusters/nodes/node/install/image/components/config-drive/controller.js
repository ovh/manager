import some from 'lodash/some';

import { DOCUMENTATION_LINK, SUPPORTED_SSH_KEY_FORMATS } from './constants';

export default class DedicatedServerInstallImageConfigDriveCtrl {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
    this.documentationLink = DOCUMENTATION_LINK;
    this.supportedSshFormatsNames = SUPPORTED_SSH_KEY_FORMATS.map(
      ({ name }) => name,
    );

    this.validateSshFormat =
      DedicatedServerInstallImageConfigDriveCtrl.validateSshFormat;
  }

  /*= =====================================
  =            Initialization            =
  ====================================== */

  $onInit() {
    this.addMetadata();
  }

  /* -----  End of Initialization  ------*/

  addMetadata() {
    this.model.configdrive.metadata.push({
      added: false,
      model: {},
    });
  }

  static validateSshFormat(sshKey) {
    return some(SUPPORTED_SSH_KEY_FORMATS, ({ regex }) => regex.test(sshKey));
  }

  /*= =============================
  =            Events            =
  ============================== */

  onMetadataAddBtnClick(index) {
    this.model.configdrive.metadata[index].added = true;
    this.addMetadata();
  }

  onMetadataDeleteBtnClick(index) {
    this.model.configdrive.metadata.splice(index, 1);
  }
  /* -----  End of Events  ------*/
}
