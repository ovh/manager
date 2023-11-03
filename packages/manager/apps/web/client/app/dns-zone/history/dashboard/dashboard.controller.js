/**
 * TODO: make DNS tab selected
 */
export default class DomainDnsZoneHistoryDashboardController {
  constructor($translate, $stateParams, $state, $q, $document, Domain) {
    this.$translate = $translate;
    this.$stateParams = $stateParams;
    this.$state = $state;
    this.Domain = Domain;
    this.$document = $document;
    this.$q = $q;
    this.listOfDnsZonesUrls = [];
    this.loading = true;
  }

  goBack() {
    this.$state.go('app.zone.details.dashboard', this.$stateParams);
  }

  getZoneHistory(zoneName) {
    return this.Domain.getZoneHistory(zoneName);
  }

  getZoneDataAtDate(zoneName, date) {
    return this.Domain.getZoneDataAtDate(zoneName, date);
  }

  $onInit() {
    // TODO: handle error case with a toast for instance
    this.getZoneHistory(this.$stateParams.productId).then((dates) => {
      this.dates = dates;
      this.$q
        .all(
          dates.map((date) =>
            this.getZoneDataAtDate(this.$stateParams.productId, date),
          ),
        )
        .then((zoneUrls) => {
          this.listOfDnsZonesUrls = [...zoneUrls];
          this.loading = false;
        });
    });
  }
}
