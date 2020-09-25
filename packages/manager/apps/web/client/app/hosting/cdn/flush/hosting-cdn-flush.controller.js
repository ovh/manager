import get from 'lodash/get';
import { HOSTING_CDN_ORDER_CDN_VERSION_V1 } from '../order/hosting-cdn-order.constant';

export default class HostingFlushCdnCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $rootScope,
    $stateParams,
    $translate,
    atInternet,
    Hosting,
    HostingCdnSharedService,
    Alerter,
  ) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.Hosting = Hosting;
    this.HostingCdnSharedService = HostingCdnSharedService;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.loading = false;
    this.$scope.flushCdn = () => this.flushCdn();
    this.isV1CDN =
      get(this.$scope.cdnProperties, 'version', '') ===
      HOSTING_CDN_ORDER_CDN_VERSION_V1;

    this.atInternet.trackPage({
      name: this.isV1CDN
        ? 'web::hosting::cdn::empty-cache'
        : 'web::hosting::multisites::purge-cdn',
    });
  }

  flushCdn() {
    const flushPromise = this.isV1CDN
      ? this.flushV1CDN()
      : this.flushSharedCDN();
    return flushPromise
      .then(() => {
        this.Alerter.success(
          this.$translate.instant('hosting_dashboard_cdn_flush_success'),
          this.$scope.alerts.main,
        );
        this.$rootScope.$broadcast('hosting.cdn.flush.refresh');
      })
      .catch((err) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('hosting_dashboard_cdn_flush_error'),
          get(err, 'data', err),
          this.$scope.alerts.main,
        );
      })
      .finally(() => {
        this.$scope.resetAction();
      });
  }

  /**
   * Flushed all domains, stay to cover V1 CDN Client
   */
  flushV1CDN() {
    this.sendTrackClick('web::hosting::cdn::empty-cache::confirm');
    return this.Hosting.flushCdn(this.$stateParams.productId);
  }

  /**
   * Flushed by domain, implemented for CDN V2
   */
  flushSharedCDN() {
    this.sendTrackClick('web::hosting::multisites::purge-cdn::confirm');
    const { serviceName } = this.$scope.hosting;
    const { domain } = this.$scope.currentActionData;
    return this.HostingCdnSharedService.flushCDNDomainCache(
      serviceName,
      domain.domain,
    );
  }

  sendTrackClick(hit) {
    this.atInternet.trackClick({
      name: hit,
      type: 'action',
    });
  }
}
