import constants from './dashboard.constants';

export default class DomainDnsZoneHistoryDashboardController {
  constructor(
    $translate,
    $stateParams,
    $state,
    $q,
    $document,
    Domain,
    Alerter,
    DNSZoneService,
  ) {
    this.$translate = $translate;
    this.$stateParams = $stateParams;
    this.$state = $state;
    this.Domain = Domain;
    this.Alerter = Alerter;
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
    this.vizualizeDnsRestorePopup = false;
  }

  goToDiffViewer() {
    this.$state.go('app.zone.details.zone-history.diff', {
      selectedDates: this.dnsEntriesForComparison
        .filter((u) => u.active)
        .map((u) => u.date),
      productId: this.zoneName,
    });
  }

  closeVisualizeDnsPopup() {
    this.vizualizeDnsZoneDataPopup = false;
  }

  checkTwoElementsAreSelected() {
    return this.dnsEntriesForComparison.filter((u) => u.active).length === 2;
  }

  visualizeDnsDataInPopup(url) {
    this.loadingDnsZoneData = true;
    this.DNSZoneService.readDnsFileData(url)
      .then((res) => {
        this.dnsZoneData = res;
        this.loadingDnsZoneData = false;
      })
      .catch(({ message }) => {
        this.Alerter.error(
          this.$translate.instant('dashboard_history_error', { message }),
        );
      });
    this.vizualizeDnsZoneDataPopup = true;
  }

  sortedByDate() {
    return this.listOfDnsZonesUrls.sort((a, b) => {
      return new Date(b.creationDate) - new Date(a.creationDate);
    });
  }

  closeDnsRestorePopup() {
    this.vizualizeDnsRestorePopup = false;
  }

  openModalDnsRestore(date) {
    this.chosenDateForRestoreDns = date;
    this.vizualizeDnsRestorePopup = true;
  }

  confirmRestoreDnsAtDate(date) {
    this.DNSZoneService.restore(this.zoneName, date)
      .catch(({ message }) => {
        this.Alerter.error(
          this.$translate.instant('dashboard_history_error', { message }),
        );
      })
      .finally(() => this.closeDnsRestorePopup());
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
    return this.Domain.getZoneHistory(zoneName, 30);
  }

  getZoneDataAtDate(zoneName, date) {
    return this.Domain.getZoneDataAtDate(zoneName, date);
  }

  $onInit() {
    this.zoneName = this.$stateParams.productId;
    this.getZoneHistory(this.$stateParams.productId)
      .then((dates) => {
        this.dates = dates.slice(0, 30);
        this.dates.map((u, idx) =>
          this.dnsEntriesForComparison.push({
            id: idx,
            active: false,
            date: u,
          }),
        );
        return this.$q
          .all(
            dates.map((date) =>
              this.getZoneDataAtDate(this.$stateParams.productId, date),
            ),
          )
          .then((zoneUrls) => {
            this.listOfDnsZonesUrls = [...zoneUrls];
            this.loading = false;
          });
      })
      .catch(({ message }) => {
        this.Alerter.error(
          this.$translate.instant('dashboard_history_error', { message }),
        );
      });
  }
}
