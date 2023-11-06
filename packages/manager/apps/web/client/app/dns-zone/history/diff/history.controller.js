import * as Diff2Html from 'diff2html';
import 'diff2html/bundles/css/diff2html.min.css';
import * as unidiff from 'unidiff';

export default class DomainDnsZoneHistoryController {
  /* @ngInject */
  constructor(
    $filter,
    $timeout,
    $translate,
    $window,
    $stateParams,
    $state,
    DNSZoneService,
    Domain,
    Alerter,
  ) {
    this.$filter = $filter;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$stateParams = $stateParams;
    this.$state = $state;
    this.DNSZoneService = DNSZoneService;
    this.Domain = Domain;
    this.Alerter = Alerter;

    this.base_dns_zone_mocks = [];
    this.modified_dns_zone_mocks = [];
    this.base_dns_chosen = null;
    this.modified_dns_chosen = null;
    this.baseDnsZoneData = null;
    this.modifiedDnsZoneData = null;
    this.gitDiff = '';
  }

  getZoneHistory(zoneName) {
    return this.Domain.getZoneHistory(zoneName);
  }

  getZoneDataAtDate(zoneName, date) {
    return this.Domain.getZoneDataAtDate(zoneName, date);
  }

  goBack() {
    this.$state.go('app.zone.details.zone-history', this.$stateParams);
  }

  computeGitUnidiff() {
    return unidiff.diffAsText(this.baseDnsZoneData, this.modifiedDnsZoneData, {
      aname: 'dns',
      bname: 'dns',
    });
  }

  async getBaseDnsZoneForChosenDate() {
    const { zoneFileUrl } = await this.getZoneDataAtDate(
      this.$stateParams.productId,
      this.base_dns_chosen,
    );
    this.baseDnsZoneData = await this.DNSZoneService.readDnsFileData(
      zoneFileUrl,
    );
    this.gitDiff = this.computeGitUnidiff();
    return this.updateInnerHtml();
  }

  async getModifiedDnsZoneForChosenDate() {
    const { zoneFileUrl } = await this.getZoneDataAtDate(
      this.$stateParams.productId,
      this.modified_dns_chosen,
    );
    this.modifiedDnsZoneData = await this.DNSZoneService.readDnsFileData(
      zoneFileUrl,
    );
    this.gitDiff = this.computeGitUnidiff();
    return this.updateInnerHtml();
  }

  updateInnerHtml() {
    const innerHTML = Diff2Html.html(this.gitDiff, {
      drawFileList: false,
      outputFormat: 'side-by-side',
      matching: 'none',
      synchronisedScroll: false,
      rawTemplates: {
        'tag-file-changed':
          '<span class="d2h-tag d2h-changed d2h-changed-tag">Modifé</span>',
      },
    });
    document.getElementById('destination-elem-id').innerHTML = innerHTML;
  }

  async $onInit() {
    this.isLoading = true;

    const { selectedDates, productId } = this.$stateParams;
    [this.base_dns_chosen, this.modified_dns_chosen] = selectedDates;

    try {
      this.getBaseDnsZoneForChosenDate();
      this.getModifiedDnsZoneForChosenDate();

      const allDates = await this.getZoneHistory(productId);

      this.base_dns_zone_mocks = [...allDates];
      this.modified_dns_zone_mocks = [...allDates];
    } catch ({ message }) {
      this.Alerter.error(
        this.$translate.instant('dashboard_history_error', { message }),
      );
    } finally {
      this.isLoading = false;
    }
  }
}
