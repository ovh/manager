import {
  TRACKING_PREFIX,
  getDiagnosticDashboardTrackingContext,
} from '../../../../cloud-connect.constants';

export default class DatacenterExtraConfiguration {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
  }

  $onInit() {
    this.firstExtraConfiguration = this.datacenter.getFirstExtraConfiguration();
  }

  runCheckBgpPeering(popConfigId, dcConfigId, extraConfigId) {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}tile::button::check-bgp-peering::cloud-connect`,
      type: 'action',
      ...getDiagnosticDashboardTrackingContext(
        'cloud-connect::dashboard::configure',
      ),
    });

    return this.checkBgpPeering({
      popConfigId,
      dcConfigId,
      isExtra: true,
      extraConfigId,
    });
  }
}
