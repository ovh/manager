import { DNS_FILENAME } from './dashboard.constants';

export default class DomainDnsZoneHistoryDashboardController {
  /* @ngInject */
  constructor(
    $translate,
    $stateParams,
    $state,
    $q,
    $document,
    coreConfig,
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
    this.coreConfig = coreConfig;
  }

  checkTwoElementsAreSelected() {
    return this.dnsEntriesForComparison.filter((u) => u.active).length === 2;
  }

  downloadDnsZoneFile(url) {
    this.DNSZoneService.getDnsFile(url)
      .then((res) => {
        this.dnsZoneData = res;
        const myBlob = new Blob([res], { type: 'text/plain' });
        const blobURL = (window.URL || window.webkitURL).createObjectURL(
          myBlob,
        );
        const anchor = document.createElement('a');
        anchor.download = `${this.zoneId}_${DNS_FILENAME}`;
        anchor.href = blobURL;
        anchor.click();
      })
      .catch(({ message }) => {
        this.Alerter.error(
          this.$translate.instant('dashboard_history_error', { message }),
        );
      });
  }

  getZoneHistory(zoneId) {
    return this.Domain.getZoneHistory(zoneId);
  }

  getZoneDataByDate(zoneId, creationDate) {
    return this.Domain.getZoneDataByDate(zoneId, creationDate);
  }

  getCurrentDateText(creationDate, index) {
    const dateTimeFormat = new Intl.DateTimeFormat(
      this.coreConfig.getUserLocale().replace('_', '-'),
      {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      },
    );
    const formattedDate = dateTimeFormat.format(new Date(creationDate));
    return index === 0
      ? this.$translate.instant('dashboard_history_current_zone_date', {
          creationDate: formattedDate,
        })
      : formattedDate;
  }

  $onInit() {
    this.listOfDnsZonesUrls = [];
    this.dnsEntriesForComparison = [];
    this.dnsZoneData = null;
    this.loadingDnsZoneData = false;
    this.zoneId = '';
    this.loading = true;

    this.zoneId = this.$stateParams.productId;

    this.getZoneHistory(this.$stateParams.productId)
      .then((dates) => {
        this.dates = dates
          .sort((a, b) => {
            return new Date(b) - new Date(a);
          })
          .slice(0, 30);
        this.dates.map((u, idx) =>
          this.dnsEntriesForComparison.push({
            id: idx,
            active: false,
            date: u,
          }),
        );
        return this.$q
          .all(
            this.dates.map((date) =>
              this.getZoneDataByDate(this.$stateParams.productId, date),
            ),
          )
          .then((zoneUrls) => {
            this.listOfDnsZonesUrls = [...zoneUrls]
              .sort((a, b) => {
                return new Date(b.creationDate) - new Date(a.creationDate);
              })
              .slice(0, 30);
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
