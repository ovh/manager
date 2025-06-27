import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default class extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    ovhManagerRegionService,
    Alerter,
    ouiDatagridService,
    constants,
    VpsService,
  ) {
    super($q, ouiDatagridService);
    this.$translate = $translate;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.Alerter = Alerter;
    this.locationInfo = {};
    this.constants = constants;
    this.VpsService = VpsService;
  }

  $onInit() {
    super.$onInit();
  }

  loadResource($row) {
    if (this.locationInfo[$row.zone]) {
      return this.$q.when(this.buildRow($row));
    }

    return this.VpsService.getVpsLocation($row.name)
      .then((locationInfo) => {
        const region = this.ovhManagerRegionService.getRegion(
          locationInfo.name,
        );
        this.locationInfo[$row.zone] = {
          ...locationInfo,
          region,
          locationName: `${region.microRegion.text} - ${region.country}`,
        };
        return this.buildRow($row);
      })
      .catch((error) => {
        const errorMessage = error.data?.message || error.data || error;
        this.Alerter.error(
          [
            this.$translate.instant('vps_list_loadLocation_error'),
            errorMessage ? `(${errorMessage})` : '',
          ].join(' '),
          'vps',
        );
        return this.buildRow($row);
      });
  }

  getRegionsGroup(regions) {
    let detailedRegions = [];
    if (regions) {
      detailedRegions = !Array.isArray(regions)
        ? [this.ovhManagerRegionService.getRegion(regions)]
        : regions.map((region) =>
            this.ovhManagerRegionService.getRegion(region),
          );
    }
    this.regionsGroup = Object.groupBy(
      detailedRegions,
      (region) => region.country,
    );
  }

  buildRow($row) {
    return {
      ...$row,
      locationName: this.buildLocationInfo($row, 'locationName'),
      region: this.buildLocationInfo($row, 'region'),
    };
  }

  buildLocationInfo($row, field) {
    if (this.locationInfo[$row.zone] && this.locationInfo[$row.zone][field]) {
      return this.locationInfo[$row.zone][field];
    }
    return null;
  }
}
