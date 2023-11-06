import constants from './dashboard.constants';

export default class DomainDnsZoneHistoryDashboardController {
  constructor(
    $translate,
    $stateParams,
    $state,
    $q,
    $document,
    Domain,
    DNSZoneService,
  ) {
    this.$translate = $translate;
    this.$stateParams = $stateParams;
    this.$state = $state;
    this.Domain = Domain;
    this.DNSZoneService = DNSZoneService;
    this.$document = $document;
    this.$q = $q;

    this.listOfDnsZonesUrls = [];
    this.dnsEntriesForComparison = [];
    this.dnsZoneData = null;
    this.loadingDnsZoneData = false;
    this.zoneName = '';
    this.loading = true;
    this.vizualizeDnsZoneDataPopup = false;
  }

  goToDiffViewer() {
    this.$state.go('app.zone.details.zone-history.diff', {
      selectedDates: this.dnsEntriesForComparison
        .filter((u) => u.active)
        .map((u) => u.date),
      productId: this.zoneName,
    });
  }

  closePopup() {
    this.vizualizeDnsZoneDataPopup = false;
  }

  checkTwoElementsAreSelected() {
    return this.dnsEntriesForComparison.filter((u) => u.active).length === 2;
  }

  visualizeDnsDataInPopup(url) {
    // TODO: handle error case here too!
    this.loadingDnsZoneData = true;
    this.DNSZoneService.readDnsFileData(url).then((res) => {
      this.dnsZoneData = res;
      this.loadingDnsZoneData = false;
    });
    this.vizualizeDnsZoneDataPopup = true;
  }

  restoreDnsAtDate(date) {
    return this.DNSZoneService.restore(this.zoneName, date);
  }

  downloadDnsZoneFile(url) {
    const link = this.$document[0].createElement('a');
    if (link.download !== undefined) {
      link.setAttribute('href', url);
      link.setAttribute('download', constants.DNS_FILENAME);
      link.style = 'visibility:hidden';
      this.$document[0].body.appendChild(link);
      link.click();
      this.$document[0].body.removeChild(link);
    }
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
    this.zoneName = this.$stateParams.productId;
    // TODO: handle error case with a toast for instance ? => See with PO
    this.getZoneHistory(this.$stateParams.productId).then((dates) => {
      this.dates = dates;
      this.dates.map((u, idx) =>
        this.dnsEntriesForComparison.push({ id: idx, active: false, date: u }),
      );
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
