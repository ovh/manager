import { CERTIFICATE_FILENAME } from '../../../databases.constants';

export default class PoolsInformationController {
  /* @ngInject */
  constructor(CucControllerHelper) {
    this.CucControllerHelper = CucControllerHelper;
  }

  downloadCertificate(database) {
    return this.CucControllerHelper.constructor.downloadContent({
      fileContent: database.certificate?.ca,
      fileName: CERTIFICATE_FILENAME,
    });
  }
}
