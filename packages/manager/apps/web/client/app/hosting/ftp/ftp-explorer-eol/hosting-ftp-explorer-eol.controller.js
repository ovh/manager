import { FTP_EXPLORER_GUIDE } from '../hosting-ftp-constants';

angular.module('App').controller(
  'HostingFtpExplorerEolCtrl',
  class HostingFtpExplorerEolCtrl {
    /* @ngInject */
    constructor(coreConfig) {
      this.ovhSubsidiary = coreConfig.getUser().ovhSubsidiary;
      this.guideFileZillaUrl =
        FTP_EXPLORER_GUIDE.FILEZILLA[this.ovhSubsidiary] ||
        FTP_EXPLORER_GUIDE.FILEZILLA.DEFAULT;
      this.guideCyberduckUrl =
        FTP_EXPLORER_GUIDE.CYBERDUCK[this.ovhSubsidiary] ||
        FTP_EXPLORER_GUIDE.CYBERDUCK.DEFAULT;
    }
  },
);
