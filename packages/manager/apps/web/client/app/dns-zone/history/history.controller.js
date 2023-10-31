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
  ) {
    this.$filter = $filter;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$stateParams = $stateParams;
    this.$state = $state;
    this.DNSZoneService = DNSZoneService;
    this.Domain = Domain;

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
    this.$state.go('app.zone.details.dashboard', this.$stateParams);
  }

  async getBaseDnsZoneForChosenDate() {
    const { zoneFileUrl } = await this.getZoneDataAtDate(
      this.$stateParams.productId,
      this.base_dns_chosen,
    );
    this.baseDnsZoneData = await this.DNSZoneService.readDnsFileData(
      zoneFileUrl,
    );
    this.gitDiff = unidiff.diffAsText(
      this.baseDnsZoneData,
      this.modifiedDnsZoneData,
    );
    this.updateInnerHtml();
  }

  async getModifiedDnsZoneForChosenDate() {
    const { zoneFileUrl } = await this.getZoneDataAtDate(
      this.$stateParams.productId,
      this.modified_dns_chosen,
    );
    this.modifiedDnsZoneData = await this.DNSZoneService.readDnsFileData(
      zoneFileUrl,
    );
    this.gitDiff = unidiff.diffAsText(
      this.baseDnsZoneData,
      this.modifiedDnsZoneData,
    );
    this.updateInnerHtml();
  }

  updateInnerHtml() {
    let innerHTML = Diff2Html.html(this.gitDiff, {
      drawFileList: true,
      outputFormat: 'side-by-side',
      matching: 'lines',
      synchronisedScroll: false,
    });
    innerHTML = innerHTML.replace(
      /class="d2h-file-name"/,
      'style="visibility: hidden;"',
    );
    innerHTML = innerHTML.replace(
      /class="d2h-file-list-title"/,
      'style="visibility: hidden;"',
    );
    innerHTML = innerHTML.replace(
      /class="d2h-icon .*"/,
      'style="visibility: hidden;"',
    );
    document.getElementById('destination-elem-id').innerHTML = innerHTML;
  }

  $onInit() {
    this.getZoneHistory(this.$stateParams.productId).then((dates) => {
      this.base_dns_zone_mocks = [...dates];
      this.modified_dns_zone_mocks = [...dates];
    });
  }
}
