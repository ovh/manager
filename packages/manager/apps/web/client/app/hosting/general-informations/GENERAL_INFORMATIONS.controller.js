import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';

import {
  CDN_ADVANCED,
  QUOTA_DECIMAL_PRECISION,
} from './general-informations.constants';
import { HOSTING_CDN_ORDER_CDN_VERSION_V1 } from '../cdn/order/hosting-cdn-order.constant';
import { NEW_OFFERS_NAME } from '../hosting.constants';

export default class HostingGeneralInformationsCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $state,
    $stateParams,
    $translate,
    atInternet,
    coreConfig,
    coreURLBuilder,
    Alerter,
    boostLink,
    flushCDNLink,
    localSEOLink,
    multisiteLink,
    runtimesLink,
    Hosting,
    hostingEmailService,
    HostingLocalSeo,
    HostingRuntimes,
    hostingSSLCertificate,
    OvhApiScreenshot,
    user,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;

    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
    this.Alerter = Alerter;
    this.boostLink = boostLink;
    this.flushCDNLink = flushCDNLink;
    this.localSEOLink = localSEOLink;
    this.multisiteLink = multisiteLink;
    this.runtimesLink = runtimesLink;
    this.Hosting = Hosting;
    this.hostingEmailService = hostingEmailService;
    this.HostingLocalSeo = HostingLocalSeo;
    this.HostingRuntimes = HostingRuntimes;
    this.hostingSSLCertificate = hostingSSLCertificate;
    this.OvhApiScreenshot = OvhApiScreenshot;
    this.user = user;

    this.CDN_ADVANCED = CDN_ADVANCED;
    this.CDN_VERSION_V1 = HOSTING_CDN_ORDER_CDN_VERSION_V1;
  }

  $onInit() {
    this.atInternet.trackPage({ name: 'web::hosting' });

    this.serviceName = this.$stateParams.productId;
    this.isCdnInDeleteAtExpiration =
      this.$scope.cdnServiceInfo?.renew.mode === 'deleteAtExpiration';
    this.defaultRuntime = null;
    this.isAvailableOfferOrDetach = false;
    this.contactManagementLink = this.coreConfig.isRegion('EU')
      ? this.coreURLBuilder.buildURL('dedicated', '#/contacts/services', {
          serviceName: this.serviceName,
          category: 'HOSTING',
        })
      : '';

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
      this.$scope.emailOptionDetachInformation[0].plancodes.length > 0 &&
      this.$scope.pendingTasks.length === 0;

    this.isPrivateDatabaseDetachable =
      this.$scope.privateDatabasesDetachable.length > 0 &&
      this.$scope.privateDatabasesDetachable[0].plancodes.length > 0 &&
      this.$scope.pendingTasks.length === 0;

    const quotaUsed = this.$scope.convertBytesSize(
      this.$scope.hosting?.quotaUsed.value,
      this.$scope.hosting?.quotaUsed.unit,
      QUOTA_DECIMAL_PRECISION,
    );
    const quotaSize = this.$scope.convertBytesSize(
      this.$scope.hosting?.quotaSize.value,
      this.$scope.hosting?.quotaSize.unit,
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
        this.isAvailableOffer(this.serviceName),
        this.isAvailableDetach(this.serviceName),
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

  isAvailableOffer(productId) {
    return this.Hosting.getAvailableOffer(productId).then((offers) => {
      if (offers.length > 0) {
        this.isAvailableOfferOrDetach = true;
      }
    });
  }

  isAvailableDetach(serviceName) {
    return this.Hosting.isServiceDetachable(serviceName).then(
      (isDetachable) => {
        if (isDetachable) {
          this.isAvailableOfferOrDetach = true;
        }
      },
    );
  }

  changeOffer() {
    this.sendTrackClick('web::hostname::general-informations::change-offer');
    this.$state.go('app.hosting.dashboard.upgrade', {
      productId: this.serviceName,
    });
  }

  goToPrivateSqlActivation() {
    return this.$state.go(
      'app.hosting.dashboard.database.private-sql-activation',
    );
  }

  doesEmailOfferExists() {
    // empty array means user has no email offer
    return !isEmpty(this.$scope.emailOptionIds);
  }

  activateEmailOffer() {
    this.$state.go('app.hosting.dashboard.activate', {
      serviceName: this.serviceName,
    });
  }

  goToMultisite() {
    this.sendTrackClick('web::hosting::configure-cdn');
  }

  orderCdn() {
    this.sendTrackClick(
      this.$scope.isCdnFree
        ? 'web::hosting::activate-cdn'
        : 'web::hosting::order-cdn',
    );
    this.$state.go('app.hosting.dashboard.cdn.order');
  }

  upgradeCdn() {
    this.sendTrackClick('web::hosting::upgrade-cdn');
    this.$state.go('app.hosting.dashboard.cdn.upgrade');
  }

  terminateCdn() {
    this.sendTrackClick('web::hosting::cdn::terminate');

    this.$state.go('app.hosting.dashboard.general-informations.cdn-terminate', {
      alerts: this.$scope.alerts,
      cdnServiceInfo: this.$scope.cdnServiceInfo,
    });
  }

  onCancelTerminateCdn() {
    this.sendTrackClick('web::hosting::cdn::cancel-terminate');

    return this.$state.go(
      'app.hosting.dashboard.general-informations.cdn-cancel-terminate',
      {
        alerts: this.$scope.alerts,
        cdnServiceInfo: this.$scope.cdnServiceInfo,
      },
    );
  }

  flushCdn(action) {
    this.sendTrackClick('web::hosting::empty-cdn-cache');
    this.$scope.setAction(action);
  }

  canOrderOrEditCdn() {
    if (!this.hasCdnRights()) {
      return false;
    }

    const {
      flushCdnState,
      hosting: { hasCdn, offer },
    } = this.$scope;

    const isFlushCdnStateOk = flushCdnState === 'ok';
    const isOfferStart10M = offer === 'START_10_M';

    return hasCdn || (isFlushCdnStateOk && !isOfferStart10M);
  }

  hasCdnRights() {
    const {
      hosting: {
        serviceInfos: { contactAdmin, contactBilling },
      },
    } = this.$scope;
    const { nichandle } = this.user;

    return [contactAdmin, contactBilling].includes(nichandle);
  }

  sendTrackClick(hit) {
    this.atInternet.trackClick({
      name: hit,
      type: 'action',
    });
  }

  getOfferName(offer) {
    const offerPrefix = NEW_OFFERS_NAME[offer];
    const translateKey = offerPrefix
      ? `hostings_offer_${offerPrefix}`
      : `hosting_dashboard_service_offer_${offer}`;

    return this.$translate.instant(translateKey);
  }
}
