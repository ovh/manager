import { RECORD_TYPE_TO_HOSTING_IP } from '../hosting-multisite.constants';

export default class MultisiteDiagnosticCtrl {
  /* @ngInject */
  constructor($scope, coreURLBuilder, HostingDomain, coreConfig) {
    this.coreURLBuilder = coreURLBuilder;
    this.HostingDomain = HostingDomain;
    this.currentNic = coreConfig.getUser().auth.account;

    const { digStatus, recordType } = $scope.currentActionData;
    this.digStatus = digStatus;
    this.domain = digStatus.domain;
    this.zone = digStatus.zone;
    this.recordType = recordType;
    this.ip = digStatus[recordType]?.ip;
    this.hostingIp = $scope.hosting[RECORD_TYPE_TO_HOSTING_IP[this.recordType]];
    this.isOVHZone = digStatus.isOVHZone;
    this.canChangeDns = false;
    this.hasError = false;
    this.closeModal = () => $scope.resetAction();
  }

  $onInit() {
    if (this.isOVHZone) {
      this.loading = true;
      this.linkToARecordModification = this.coreURLBuilder.buildURL(
        'web',
        '#/domain/:zone/zone',
        {
          zone: this.zone,
        },
      );
      this.HostingDomain.getZoneServiceInfos(this.zone)
        .then(({ contactAdmin, contactTech }) => {
          this.canChangeDns = [contactAdmin, contactTech].includes(
            this.currentNic,
          );
          this.contactAdmin = contactAdmin;
        })
        .catch(() => {
          this.hasError = true;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
}
