import { CERTIFICATE_FILENAME } from '../../../databases.constants';

export default class {
  /* @ngInject */
  constructor(CucControllerHelper) {
    this.CucControllerHelper = CucControllerHelper;
  }

  /**
   *
   * @param {*} database
   * @returns downloads file ca.pem
   */
  downloadCertificate(database) {
    return this.CucControllerHelper.constructor.downloadContent({
      fileContent: database.certificate?.ca,
      fileName: CERTIFICATE_FILENAME,
    });
  }
}
