import get from 'lodash/get';
import includes from 'lodash/includes';

export default class OutgoingTraficComponentCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    coreConfig,
    CucControllerHelper,
    ovhManagerRegionService,
    CucServiceHelper,
    CLOUD_GEOLOCALISATION,
    CLOUD_UNIT_CONVERSION,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.CucControllerHelper = CucControllerHelper;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.CucServiceHelper = CucServiceHelper;
    this.apacRegions = CLOUD_GEOLOCALISATION.instance.APAC;
    this.CLOUD_UNIT_CONVERSION = CLOUD_UNIT_CONVERSION;
    this.FREE_TRAFFIC_PER_APAC_REGION = 1024;
  }

  $onInit() {
    this.toggle = {
      accordions: {
        outgoingTraffic: false,
      },
    };
    this.initCurrency();
  }

  initCurrency() {
    this.currency = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.$q
          .when(this.coreConfig.getUser())
          .then((me) => me.currency)
          .catch((error) =>
            this.CucServiceHelper.errorHandler('cpb_error_message')(error),
          ),
    });
    return this.currency.load();
  }

  isAPACRegion(region) {
    return includes(this.apacRegions, region);
  }

  getTrafficByRegion(regionByBandwidth) {
    if (this.isAPACRegion(regionByBandwidth.region)) {
      const bandwidthUsedInGiB = get(
        regionByBandwidth,
        'outgoingBandwidth.quantity.value',
        0,
      );
      // convert GiB to GB
      const bandwidthUsedInGB =
        (this.CLOUD_UNIT_CONVERSION.GIBIBYTE_TO_BYTE * bandwidthUsedInGiB) /
        this.CLOUD_UNIT_CONVERSION.GIGABYTE_TO_BYTE;
      return `${bandwidthUsedInGB.toFixed(2)}/${
        this.FREE_TRAFFIC_PER_APAC_REGION
      } ${this.$translate.instant('unit_size_GB')}`;
    }
    return this.$translate.instant('cpbc_hourly_instance_trafic_unlimitted');
  }

  getPriceByRegion(regionByBandwidth) {
    if (this.isAPACRegion(regionByBandwidth.region)) {
      const bandwidthUsedInTb =
        regionByBandwidth.outgoingBandwidth.quantity.value;
      if (bandwidthUsedInTb > 1) {
        const totalPrice = regionByBandwidth.outgoingBandwidth
          ? regionByBandwidth.outgoingBandwidth.totalPrice
          : 0;
        return `${totalPrice} ${this.currency.data.symbol}`;
      }
    }
    return this.$translate.instant('cpbc_hourly_instance_trafic_included');
  }
}
