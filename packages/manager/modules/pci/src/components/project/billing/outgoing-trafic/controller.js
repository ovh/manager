import get from 'lodash/get';
import includes from 'lodash/includes';

export default class OutgoingTraficComponentCtrl {
  /* @ngInject */
  constructor(
    $translate,
    CucControllerHelper,
    CucRegionService,
    CucServiceHelper,
    OvhApiMe,
    CLOUD_GEOLOCALISATION,
    CLOUD_UNIT_CONVERSION,
  ) {
    this.$translate = $translate;
    this.CucControllerHelper = CucControllerHelper;
    this.OvhApiMe = OvhApiMe;
    this.CucRegionService = CucRegionService;
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
        this.OvhApiMe.v6()
          .get()
          .$promise.then((me) => me.currency)
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
