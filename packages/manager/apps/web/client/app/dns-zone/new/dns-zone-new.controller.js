import get from 'lodash/get';
import set from 'lodash/set';

export default class newDnsZoneCtrl {
  /**
   * Constructor
   * @param $scope
   * @param Alerter
   * @param newDnsZone
   * @param User
   */
  /* @ngInject */
  constructor($scope, $translate, Alerter, newDnsZone, User) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.newDnsZone = newDnsZone;
    this.User = User;
  }

  $onInit() {
    this.alerts = {
      main: 'newdnszone.alerts.main',
    };
    this.loading = {
      bc: false,
    };
    this.zoneName = null;
    this.zoneNameOrder = {
      zoneName: null,
      minimized: false,
      contractsValidated: false,
    };

    this.$scope.data = [];

    this.User.getUrlOf('guides').then((guides) => {
      this.guideForExternal = guides.dnsForExternalDomain;
    });
  }

  generateBc() {
    this.loading.bc = true;
    this.newDnsZone
      .orderZoneName(this.zoneNameOrder.zoneName, this.zoneNameOrder.minimized)
      .then((details) => {
        this.order = details;
      })
      .catch((err) => {
        set(err, 'type', err.type || 'ERROR');
        this.Alerter.alertFromSWS(
          this.$translate.instant('domains_newdnszone_order_step3_fail'),
          err,
          this.alerts.main,
        );
      })
      .finally(() => {
        this.loading.bc = false;
      });
  }

  clean() {
    this.zoneNameOrder.contractsValidated = false;
    this.zoneNameOrder.minimized = false;
    this.zoneName = get(this.zoneNameOrder, 'zoneName', '').toLowerCase();
    this.order = null;
  }
}
