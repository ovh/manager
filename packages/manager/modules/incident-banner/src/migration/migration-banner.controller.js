export default class BannerController {
  /* @ngInject */
  constructor($http, $q, coreURLBuilder, ovhFeatureFlipping) {
    this.$http = $http;
    this.$q = $q;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    this.isActive = false;
    this.migrationLink = this.coreURLBuilder.buildURL(
      'hub',
      `#/incident/${this.incident.toUpperCase()}/migration`,
    );
    return this.getImpactedService();
  }

  getImpactedService() {
    return this.$q
      .all({
        hasRise: this.ovhFeatureFlipping.checkFeatureAvailability('sbg:rise'),
        services: this.$http.get(
          `/me/incident/${this.incident}/migrateServices`,
        ),
      })
      .then(({ hasRise, services }) => {
        this.isActive = !!services.data.length;
        this.hasRise = hasRise.isFeatureAvailable('sbg:rise');
      })
      .catch(() => {
        this.isActive = false;
      });
  }
}
