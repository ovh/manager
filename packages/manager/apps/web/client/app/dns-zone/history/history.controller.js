import * as Diff2Html from 'diff2html';
import 'diff2html/bundles/css/diff2html.min.css';

export default class DomainDnsZoneHistoryController {
  /* @ngInject */
  constructor($filter, $timeout, $translate, $window, $stateParams, $state) {
    this.$filter = $filter;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$stateParams = $stateParams;
    this.$state = $state;
  }

  goBack() {
    this.$state.go('app.zone.details.dashboard', this.$stateParams);
  }

  $onInit() {
    this.strInput =
      '--- a/dns_properties\n' +
      '+++ b/dns_properties\n' +
      '@@ -1,8 +1,8 @@\n' +
      '           IN NS        dns14.ovh.net.\n' +
      '           IN NS        ns14.ovh.net.\n' +
      '           IN MX        50 mx2.mail.ovh.net.\n' +
      '+           IN TXT      reaeraerjkdjkjdgkjfksgjksfjgfjsgkfjsgfs\n' +
      ' cam       IN CNAME jeedom.test.ovh.\n' +
      ' ha        IN CNAME jeedom.test.ovh.\n' +
      '-jeedom 60 IN A         93.28.77.229\n' +
      '+jeedom 60 IN A         213.186.77.5\n' +
      ' nas    60 IN CNAME     jeedom.test.ovh.\n' +
      '-plex      IN           jeedom.test.ovh';
    let innerHTML = Diff2Html.html(this.strInput, {
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
      /class="d2h-icon d2h-changed"/,
      'style="visibility: hidden;"',
    );
    document.getElementById('destination-elem-id').innerHTML = innerHTML;
  }
}
