import {
  GUIDE_LINKS,
  LV1_LV2_REGEX,
} from './lv1-lv2-migration-banner.constants';

export default class DedicatedCloudLv1Lv2MigrationBanner {
  /* @ngInject */
  constructor($http, $q, coreConfig, iceberg) {
    this.$http = $http;
    this.$q = $q;
    this.coreConfig = coreConfig;
    this.iceberg = iceberg;
  }

  $onInit() {
    this.loading = false;
    this.GUIDE_LINK =
      GUIDE_LINKS[this.coreConfig.getUserLanguage().toUpperCase()] ||
      GUIDE_LINKS.DEFAULT;
    this.checkLv1Lv2MigrationBannerVisibility();
  }

  fetchFilersForDatacenter(productId, datacenter) {
    return this.iceberg(
      `/dedicatedCloud/${productId}/datacenter/${datacenter}/filer`,
    )
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data }) => data);
  }

  checkLv1Lv2MigrationBannerVisibility() {
    this.loading = true;
    return this.$http
      .get(`/dedicatedCloud/${this.productId}/datacenter`)
      .then(({ data: datacenters }) =>
        this.$q.all(
          datacenters.map((datacenter) =>
            this.fetchFilersForDatacenter(this.productId, datacenter),
          ),
        ),
      )
      .then((data) => {
        const filers = data.reduce(
          (accumulator, filersForDC) => accumulator.concat(filersForDC),
          [],
        );
        this.displayMigrationBanner = filers.some(
          (filer) =>
            !filer.isManagedByOvh && filer.master?.match(LV1_LV2_REGEX),
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
