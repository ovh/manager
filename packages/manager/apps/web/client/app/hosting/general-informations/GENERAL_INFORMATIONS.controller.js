import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import get from 'lodash/get';

import { QUOTA_DECIMAL_PRECISION } from './general-informations.constants';
import { HOSTING_CDN_ORDER_CDN_VERSION_V1 } from '../cdn/order/hosting-cdn-order.constant';
import { SHARED_CDN_GET_MORE_INFO } from '../cdn/shared/hosting-cdn-shared-settings.constants';

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
    RedirectionService,
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
    this.RedirectionService = RedirectionService;
  }

  $onInit() {
    this.atInternet.trackPage({ name: 'web::hosting' });

    this.serviceName = this.$stateParams.productId;
    this.defaultRuntime = null;
    this.availableOffers = [];
    this.contactManagementLink = this.RedirectionService.getURL(
      'contactManagement',
      { serviceName: this.serviceName, category: 'HOSTING' },
    );
    this.loading = {
      defaultRuntime: true,
      localSeo: true,
      screenshot: true,
    };

    this.localSeo = {
      isActive: false,
      quantity: 0,
    };

    this.goToDetachEmail = this.$scope.goToDetachEmail;
    this.goToDetachPrivateDB = this.$scope.goToDetachPrivateDB;
    this.isDetachEmailOptionAvailable =
      this.$scope.emailOptionDetachInformation.length > 0 &&
      this.$scope.emailOptionDetachInformation[0].detachPlancodes.length > 0 &&
      this.$scope.pendingTasks.length === 0;

    this.isPrivateDatabaseDetachable =
      this.$scope.privateDatabasesDetachable.length > 0 &&
      this.$scope.privateDatabasesDetachable[0].detachPlancodes.length > 0 &&
      this.$scope.pendingTasks.length === 0;

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
        this.getScreenshot(),
        this.retrievingSSLCertificate(),
        this.retrievingAvailableOffers(this.serviceName),
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
    this.sendTrackClick('web::hostname::general-informations::change-offer');
    this.$state.go('app.hosting.upgrade', { productId: this.serviceName });
  }

  goToBoostTab() {
    this.$scope.$parent.$ctrl.setSelectedTab('BOOST');
  }

  goToMultisiteTab() {
    this.$scope.$parent.$ctrl.setSelectedTab('MULTISITE');
  }

  goToPrivateSqlActivation() {
    return this.$state.go('app.hosting.database.private-sql-activation');
  }

  doesEmailOfferExists() {
    // empty array means user has no email offer
    return !isEmpty(this.$scope.emailOptionIds);
  }

  activateEmailOffer() {
    this.$state.go('app.hosting.activate', { serviceName: this.serviceName });
  }

  getCDNBannerKeyToTranslate() {
    if (
      get(this.$scope.cdnProperties, 'version') ===
      HOSTING_CDN_ORDER_CDN_VERSION_V1
    ) {
      return 'hosting_dashboard_service_cdn_customer_has_cdn_v1_banner_msg';
    }

    if (get(this.$scope.hosting, 'hasCdn') === false) {
      return 'hosting_dashboard_service_cdn_customer_has_no_cdn_banner_msg';
    }

    return null;
  }

  getCDNMoreInfoLink() {
    return SHARED_CDN_GET_MORE_INFO[this.$scope.ovhSubsidiary];
  }

  goToOrderOrUpgrade() {
    this.sendTrackClick('web::hosting::alert::order-cdn');
    return this.$state.go(
      this.$scope.hosting.hasCdn
        ? 'app.hosting.cdn.upgrade'
        : 'app.hosting.cdn.order',
    );
  }

  goToMultisite() {
    this.sendTrackClick('web::hosting::configure-cdn');
    this.goToMultisiteTab();
  }

  orderCdn() {
    this.sendTrackClick(
      this.$scope.isCdnFree
        ? 'web::hosting::activate-cdn'
        : 'web::hosting::order-cdn',
    );
    this.$state.go('app.hosting.cdn.order');
  }

  upgradeCdn() {
    this.sendTrackClick('web::hosting::upgrade-cdn');
    this.$state.go('app.hosting.cdn.upgrade');
  }

  terminateCdn(action) {
    this.sendTrackClick('web::hosting::terminate-cdn');
    this.$scope.setAction(action);
  }

  flushCdn(action) {
    this.sendTrackClick('web::hosting::empty-cdn-cache');
    this.$scope.setAction(action);
  }

  onMoreInfoLinkClicked() {
    this.sendTrackClick('web::hosting::alert::cdn-more-info');
  }

  sendTrackClick(hit) {
    this.atInternet.trackClick({
      name: hit,
      type: 'action',
    });
  }
}
