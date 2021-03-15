import { buildURL } from '@ovh-ux/ufrontend/url-builder';

export default class BannerController {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    this.isActive = false;
    this.migrationLink = buildURL(
      'hub',
      `#/incident/${this.incident.toUpperCase()}/migration`,
    );
    return this.getImpactedService();
  }

  getImpactedService() {
    return this.$http
      .get(`/me/incident/${this.incident}/migrateServices`)
      .then(({ data }) => {
        this.isActive = !!data.length;
      })
      .catch(() => {
        this.isActive = false;
      });
  }
}
