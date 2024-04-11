import {
  SIRET_TRACKING_PREFIX,
  SIRET_HIT_PREFIX,
  TRACKING_PREFIX_POPUP,
  KYC_TRACKING_PREFIX,
  KYC_HIT_PREFIX,
  KYC_STATUS,
} from './dashboard.constant';

export default class DashboardController {
  /* @ngInject */
  constructor(coreURLBuilder, atInternet, $window, $http) {
    this.coreURLBuilder = coreURLBuilder;
    this.atInternet = atInternet;
    this.$window = $window;
    this.SIRET_TRACKING_PREFIX = SIRET_TRACKING_PREFIX;
    this.SIRET_HIT_PREFIX = SIRET_HIT_PREFIX;
    this.TRACKING_PREFIX_POPUP = TRACKING_PREFIX_POPUP;
    this.KYC_HIT_PREFIX = KYC_HIT_PREFIX;
    this.$http = $http;
    this.myIdentitySectionLink = coreURLBuilder.buildURL(
      'dedicated',
      '#/identity-documents',
    );
    this.iamBannerLink = coreURLBuilder.buildURL('iam', '#/dashboard/policies');
  }

  $onInit() {
    this.availableSiretBanner = false;
    this.availableSiretPopup = false;
    this.showKycBanner = false;
    this.showKycBannerWaiting = false;
    this.displayRbx1EolBanner = {
      rbx1Eol: false,
    };
    this.$http
      .get(`/feature/identity-documents/availability`, {
        serviceType: 'aapi',
      })
      .then(({ data: featureAvailability }) => {
        if (featureAvailability['identity-documents']) {
          this.$http.get(`/me/procedure/identity`).then(({ data }) => {
            this.showKycBanner =
              data.status === KYC_STATUS.REQUIRED && !data.ticketId;
            this.showKycBannerWaiting =
              data.status === KYC_STATUS.REQUIRED && !!data.ticketId;
            if (this.showKycBanner)
              this.atInternet.trackPage({
                name: KYC_TRACKING_PREFIX,
                type: 'navigation',
              });
          });
        }
      });

    this.$http
      .get('/me')
      .then(({ data }) => {
        this.getNicInfo = data;
        this.userSiretFR =
          !this.getNicInfo.companyNationalIdentificationNumber &&
          this.getNicInfo.legalform === 'corporation' &&
          this.getNicInfo.country === 'FR';
      })
      .then(() => {
        return this.callFeatureAvailabilty;
      })
      .then((data) => {
        this.availableSiretBanner =
          data?.isFeatureAvailable('hub:banner-hub-invite-customer-siret') &&
          this.userSiretFR;
        this.availableSiretPopup =
          data?.isFeatureAvailable('hub:popup-hub-invite-customer-siret') &&
          this.userSiretFR;
        if (this.availableSiretBanner) {
          this.atInternet.trackPage({
            name: SIRET_TRACKING_PREFIX,
            type: 'navigation',
          });
        }
        if (this.availableSiretPopup) {
          this.atInternet.trackPage({
            name: TRACKING_PREFIX_POPUP,
            type: 'navigation',
          });
        }
        this.displayRbx1EolBanner.rbx1Eol = data?.isFeatureAvailable(
          'hub:banner-rbx1-eol',
        );
      });

    this.ACCOUNT_DASHBOARD_URL = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/useraccount/infos?fieldToFocus=siretForm',
    );

    this.trackingPrefix.then((prefix) => {
      this.prefix = prefix;
    });
  }

  goToSiretModification() {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX_POPUP}::confirm`,
      type: 'action',
    });
    return this.$window.open(this.ACCOUNT_DASHBOARD_URL, '_top');
  }

  cancelToSiretModification() {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX_POPUP}::cancel`,
      type: 'action',
    });
    this.availableSiretPopup = false;
  }

  trackClick(hit) {
    this.atInternet.trackClick({
      name: hit,
      type: 'action',
    });
  }
}
