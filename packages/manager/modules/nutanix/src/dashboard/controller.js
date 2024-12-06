import moment from 'moment';

import { GUIDE_URL, LICENSE_REGISTRATION_ENDS_IN_DAYS } from './constants';

export default class NutanixDashboardCtrl {
  /* @ngInject */
  constructor($translate, atInternet, coreConfig) {
    this.$translate = $translate;
    this.user = coreConfig.getUser();
    this.atInternet = atInternet;
  }

  $onInit() {
    this.nutanixGuideUrl =
      GUIDE_URL.ALL_GUIDE[this.user.ovhSubsidiary] ||
      GUIDE_URL.ALL_GUIDE.DEFAULT;
    this.trackWarning();
  }

  trackWarning() {
    if (this.isLicenceRegisterDateExpired()) {
      this.atInternet.trackPage({
        name: 'hpc::nutanix::cluster::banner-register-cluster',
      });
    }
  }

  getLicenseRegistrationEndDate() {
    return moment(this.serviceInfo.creation)
      .add(moment.duration(LICENSE_REGISTRATION_ENDS_IN_DAYS, 'days'))
      .format('DD/MM/YYYY');
  }

  isLicenceRegisterDateExpired() {
    const diff = moment().diff(moment(this.serviceInfo.creation), 'days');
    return (
      diff >= 0 &&
      diff <= LICENSE_REGISTRATION_ENDS_IN_DAYS &&
      this.getTechnicalDetails?.nutanixCluster?.license.edition ===
        'Personal license'
    );
  }
}
