import get from 'lodash/get';
import set from 'lodash/set';

import punycode from 'punycode';

export default class SharepointDomainsCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $translate,
    Alerter,
    MicrosoftSharepointLicenseService,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.sharepointService = MicrosoftSharepointLicenseService;
  }

  $onInit() {
    this.exchangeId = this.$stateParams.exchangeId;
    this.punycode = punycode;

    this.getSharepointUpnSuffixes();
  }

  getSharepointUpnSuffixes() {
    this.upnSuffixesIds = null;

    return this.sharepointService
      .getSharepointUpnSuffixes(this.exchangeId)
      .then((ids) => {
        this.upnSuffixesIds = ids.map((id) => ({ id }));
      })
      .catch((err) => {
        this.alerter.alertFromSWS(
          this.$translate.instant('sharepoint_accounts_err'),
          err,
          this.$scope.alerts.main,
        );
      });
  }

  showMoreInformation(domain) {
    const message = `${this.$translate.instant('sharepoint_accounts_err')} ${
      domain.cnameTooltip
    }`;
    this.alerter.alertFromSWS(message, undefined, this.$scope.alerts.main);
  }

  onTranformItem(suffix) {
    return (
      this.sharepointService
        .getSharepointUpnSuffixeDetails(this.exchangeId, suffix)
        // eslint-disable-next-line no-shadow
        .then((suffix) => {
          if (!suffix.ownershipValidated) {
            set(
              suffix,
              'cnameTooltip',
              this.$translate.instant(
                'sharepoint_domains_cname_check_tooltip',
                {
                  t0: suffix.cnameToCheck
                    ? `${suffix.cnameToCheck}.${suffix.suffix}`
                    : ' ',
                },
              ),
            );
          }
          get(suffix, 'displayName', this.punycode.toUnicode(suffix.suffix));
          return suffix;
        })
        .catch(() => ({
          userPrincipalName: suffix,
        }))
    );
  }
}
