import { DNS_FILENAME } from './dashboard.constants';

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
    goBack,
    goToDiffViewer,
  ) {
    this.$translate = $translate;
    this.$stateParams = $stateParams;
    this.$state = $state;
    this.Domain = Domain;
    this.Alerter = Alerter;
    this.DNSZoneService = DNSZoneService;
    this.$document = $document;
    this.$q = $q;
    this.goBack = goBack;
    this.goToDiffViewer = goToDiffViewer;
  }

  closeVisualizeDnsPopup() {
    this.vizualizeDnsZoneDataPopup = false;
  }

  checkTwoElementsAreSelected() {
    return this.dnsEntriesForComparison.filter((u) => u.active).length === 2;
  }

  visualizeDnsDataInPopup(url) {
    this.loadingDnsZoneData = true;
    this.DNSZoneService.getDnsFile(url)
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

  openModalDnsRestore(creationDate) {
    this.chosenDateForRestoreDns = creationDate;
    this.vizualizeDnsRestorePopup = true;
  }

  confirmRestoreDnsAtDate(creationDate) {
    this.DNSZoneService.restore(this.zoneId, creationDate)
      .catch(({ data: { message } }) => {
        this.Alerter.error(
          this.$translate.instant('dashboard_history_error', { message }),
          'dnsZoneAlert',
        );
      })
      .finally(this.closeDnsRestorePopup());
  }

  downloadDnsZoneFile(url) {
    const link = this.$document[0].createElement('a');
    if (link.download !== undefined) {
      link.setAttribute('href', url);
      link.setAttribute('download', DNS_FILENAME);
      link.style = 'visibility:hidden';
      this.$document[0].body.appendChild(link);
      link.click();
      this.$document[0].body.removeChild(link);
    }
  }

  getZoneHistory(zoneId) {
    return this.Domain.getZoneHistory(zoneId);
  }

  getZoneDataByDate(zoneId, creationDate) {
    return this.Domain.getZoneDataByDate(zoneId, creationDate);
  }

  $onInit() {
    this.listOfDnsZonesUrls = [];
    this.dnsEntriesForComparison = [];
    this.dnsZoneData = null;
    this.loadingDnsZoneData = false;
    this.zoneId = '';
    this.loading = true;
    this.vizualizeDnsZoneDataPopup = false;
    this.vizualizeDnsRestorePopup = false;

    this.zoneId = this.$stateParams.productId;
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
              this.getZoneDataByDate(this.$stateParams.productId, date),
            ),
          )
          .then((zoneUrls) => {
            this.listOfDnsZonesUrls = [...zoneUrls];
          });
      })
      .catch(({ data: { message } }) => {
        this.Alerter.error(
          this.$translate.instant('dashboard_history_error', { message }),
          'dnsZoneAlert',
        );
      })
      .finally((this.loading = false));
  }
}
