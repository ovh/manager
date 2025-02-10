import {
  DIAGNOSTIC_TRACKING_PREFIX,
  DIAGNOSTIC_DASHBOARD_TRACKING_CONTEXT,
} from '../../../../cloud-connect.constants';

export default class DatacenterExtraConfiguration {
  constructor(atInternet) {
    this.atInternet = atInternet;
  }

  $onInit() {
    this.firstExtraConfiguration = this.datacenter.getFirstExtraConfiguration();
  }

  runCheckBgpPeering(popConfigId, dcConfigId, extraConfigId) {
    this.atInternet.trackClick({
      name: `${DIAGNOSTIC_TRACKING_PREFIX}tile::button::check-bgp-peering::cloud-connect`,
      type: 'action',
      ...DIAGNOSTIC_DASHBOARD_TRACKING_CONTEXT,
    });

    return this.checkBgpPeering({
      popConfigId,
      dcConfigId,
      isExtar: true,
      extraConfigId,
    });
  }
}
