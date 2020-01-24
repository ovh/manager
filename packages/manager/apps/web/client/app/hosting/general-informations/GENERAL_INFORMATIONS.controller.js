import head from 'lodash/head';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';

import { QUOTA_DECIMAL_PRECISION } from './general-informations.constants';

export default class HostingGeneralInformationsCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $state,
    $stateParams,
    $translate,
    atInternet,
    Alerter,
    Hosting,
    hostingEmailService,
    HostingLocalSeo,
    HostingRuntimes,
    hostingSSLCertificate,
    OvhApiScreenshot,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;

    this.atInternet = atInternet;
    this.Alerter = Alerter;
    this.Hosting = Hosting;
    this.hostingEmailService = hostingEmailService;
    this.HostingLocalSeo = HostingLocalSeo;
    this.HostingRuntimes = HostingRuntimes;
    this.hostingSSLCertificate = hostingSSLCertificate;
    this.OvhApiScreenshot = OvhApiScreenshot;
  }

  $onInit() {
    this.serviceName = this.$stateParams.productId;
    this.defaultRuntime = null;
    this.availableOffers = [];

    this.loading = {
      defaultRuntime: true,
      localSeo: true,
      screenshot: true,
    };

    this.localSeo = {
      isActive: false,
      quantity: 0,
    };

    const quotaUsed = this.$scope.convertBytesSize(
      this.$scope.hosting.quotaUsed.value,
      this.$scope.hosting.quotaUsed.unit,
      QUOTA_DECIMAL_PRECISION,
    );
    const quotaSize = this.$scope.convertBytesSize(
      this.$scope.hosting.quotaSize.value,
      this.$scope.hosting.quotaSize.unit,
      QUOTA_DECIMAL_PRECISION,
    );

    this.quotaInformations = `${quotaUsed} / ${quotaSize}`;

    this.$scope.$on('hosting.ssl.reload', () =>
      this.retrievingSSLCertificate(),
    );
    return this.$q
      .all([
        this.getUserLogsToken(),
        this.getScreenshot(),
        this.retrievingSSLCertificate(),
        this.retrievingAvailableOffers(this.serviceName),
        this.getEmailOfferDetails(this.serviceName),
      ])
      .then(() => this.HostingRuntimes.getDefault(this.serviceName))
      .then((runtime) => {
        this.defaultRuntime = runtime;
      })
      .then(() => this.initializeLocalSeo(this.serviceName))
      .finally(() => {
        this.loading.defaultRuntime = false;
        this.loading.localSeo = false;
        this.loading.screenshot = false;
      });
  }

  getScreenshot() {
    if (!this.$scope.hosting.isExpired) {
      return this.OvhApiScreenshot.Aapi()
        .get({ url: this.serviceName })
        .$promise.then((screenshot) => {
          this.screenshot = screenshot;
        });
    }

    return this.$q.when();
  }

  getUserLogsToken() {
    return this.Hosting.getUserLogsToken(this.serviceName, {
      params: {
        remoteCheck: true,
        ttl: 3600,
      },
    }).then((userLogsToken) => {
      this.userLogsToken = userLogsToken;
    });
  }

  initializeLocalSeo(serviceName) {
    if (!this.$scope.localSeoAvailable) {
      return false;
    }

    return this.HostingLocalSeo.getAccounts(serviceName)
      .then((accountIds) => {
        if (!accountIds || accountIds.length <= 0) {
          throw new Error('No LocalSEO Accounts');
        }
        return this.HostingLocalSeo.getAccount(serviceName, head(accountIds));
      })
      .then((account) => {
        this.localSeo.isActive = account.status === 'created';
      })
      .then(() => this.HostingLocalSeo.getLocations(serviceName))
      .then((locationIds) => {
        this.localSeo.quantity = locationIds.length;
      });
  }

  retrievingSSLCertificate() {
    this.isRetrievingSSLCertificate = true;

    return this.hostingSSLCertificate
      .retrievingCertificate(this.serviceName)
      .then((certificate) => {
        this.sslCertificate = certificate;
      })
      .catch((error) => {
        // 404 error means that the user has no SSL certificate
        if (error.status !== 404) {
          this.Alerter.alertFromSWS(
            this.$translate.instant('hosting_dashboard_ssl_details_error'),
            error,
            this.$scope.alerts.main,
          );
        }
      })
      .finally(() => {
        this.isRetrievingSSLCertificate = false;
      });
  }

  hasSSLCertificate() {
    return isObject(this.sslCertificate);
  }

  canOrderSSLCertificate() {
    return !this.hasSSLCertificate();
  }

  canRegenerateSSLCertificate() {
    return (
      this.hasSSLCertificate() &&
      this.sslCertificate.regenerable &&
      this.hostingSSLCertificate.constructor.testCanBeHandled(
        this.sslCertificate,
      )
    );
  }

  canDeleteSSLCertificate() {
    return (
      this.hasSSLCertificate() &&
      this.hostingSSLCertificate.constructor.testCanBeHandled(
        this.sslCertificate,
      )
    );
  }

  hasSSLCertificateCreationReport() {
    return this.hasSSLCertificate() && this.sslCertificate.isReportable;
  }

  selectSSLCertificateStatusText() {
    if (!this.hasSSLCertificate()) {
      return this.$translate.instant('common_no');
    }

    if (
      this.hostingSSLCertificate.constructor.testCanBeHandled(
        this.sslCertificate,
      )
    ) {
      return `${this.$translate.instant('common_yes')} - ${
        this.sslCertificate.provider
      } - ${this.sslCertificate.type}`;
    }

    return this.$translate.instant(
      `hosting_dashboard_service_ssl_${this.sslCertificate.status}`,
    );
  }

  retrievingAvailableOffers(productId) {
    return this.Hosting.getAvailableOffer(productId).then((offers) => {
      this.availableOffers = offers;
    });
  }

  changeOffer() {
    this.atInternet.trackClick({
      name: 'web::hostname::general-informations::change-offer',
      type: 'action',
    });
    this.$state.go('app.hosting.upgrade', { productId: this.serviceName });
  }

  changeMainDomain() {
    this.atInternet.trackClick({
      name: 'web::hostname::general-informations::change-main-domain',
      type: 'action',
    });
    this.$scope.setAction(
      'change-main-domain/hosting-change-main-domain',
      this.$scope.hosting,
    );
  }

  isHostingOffer() {
    return !includes(
      [
        'KIMSUFI_2015',
        '__60_FREE',
        'DEMO_1_G',
        'START_1_M',
        'START_10_M',
        '_ASPFREE',
      ],
      this.$scope.hosting.offer,
    );
  }

  goToBoostTab() {
    this.$scope.$parent.$ctrl.setSelectedTab('BOOST');
  }

  goToPrivateSqlActivation() {
    return this.$state.go('app.hosting.database.private-sql-activation');
  }

  getEmailOfferDetails(serviceName) {
    this.isRetrievingEmailOffer = true;
    return this.hostingEmailService
      .getEmailOfferDetails(serviceName)
      .then((offer) => {
        this.emailOffer = offer;
      })
      .catch((error) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('hosting_dashboard_email_offer_get_error'),
          error,
          this.$scope.alerts.main,
        );
      })
      .finally(() => {
        this.isRetrievingEmailOffer = false;
      });
  }

  doesEmailOfferExists() {
    // empty array means user has no email offer
    return !isEmpty(this.emailOffer);
  }

  activateEmailOffer() {
    this.$state.go('app.hosting.activate', { serviceName: this.serviceName });
  }
}
