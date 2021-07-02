import some from 'lodash/some';

import { DOCUMENTATION_LINK, SUPPORTED_SSH_KEY_FORMATS } from './constants';

export default class BmServerComponentsOsInstallImageConfigDriveCtrl {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
    this.documentationLink = DOCUMENTATION_LINK;
    this.supportedSshFormatsNames = SUPPORTED_SSH_KEY_FORMATS.map(
      ({ name }) => name,
    );

    this.validateSshFormat =
    BmServerComponentsOsInstallImageConfigDriveCtrl.validateSshFormat;
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

  validateSshFormat() {
    const element = this.imageConfigDriveForm.sshKey;
    if (this.model.configdrive.sshKey) {
      const isValid = some(SUPPORTED_SSH_KEY_FORMATS, ({ regex }) =>
        regex.test(this.model.configdrive.sshKey),
      );
      element.$setValidity('ssh', isValid);
    } else {
      element.$setValidity('ssh', true);
    }
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
