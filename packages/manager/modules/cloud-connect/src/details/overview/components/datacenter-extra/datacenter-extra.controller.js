import { DIAGNOSTIC_TRACKING_PREFIX } from '../../../../cloud-connect.constants';

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
      level2: 99,
    });

    return this.checkBgpPeering({
      popConfigId,
      dcConfigId,
      isExtar: true,
      extraConfigId,
    });
  }
}
