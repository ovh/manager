import { HOSTING_CDN_ORDER_CDN_VERSION_V1 } from '../order/hosting-cdn-order.constant';

export default class HostingFlushCdnCtrl {
  /* @ngInject */
  constructor(
    $translate,
    atInternet,
    Hosting,
    HostingCdnSharedService,
    Alerter,
  ) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.Hosting = Hosting;
    this.HostingCdnSharedService = HostingCdnSharedService;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.loading = false;
    this.isV1CDN =
      this.cdnProperties.version === HOSTING_CDN_ORDER_CDN_VERSION_V1;

    this.atInternet.trackPage({
      name: this.isV1CDN
        ? 'web::hosting::cdn::empty-cache'
        : 'web::hosting::multisites::purge-cdn',
    });
  }

  flushCdn() {
    this.loading = true;
    const flushPromise = this.isV1CDN
      ? this.flushV1CDN()
      : this.flushSharedCDN();
    return flushPromise
      .then(() => {
        this.onFlushSuccess();
        return this.goBack(
          this.$translate.instant('hosting_dashboard_cdn_flush_success'),
        );
      })
      .catch((err) => {
        return this.goBack(
          `${this.$translate.instant('hosting_dashboard_cdn_flush_error')} ${
            err.data
          }`,
          'error',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  /**
   * Flushed all domains, stay to cover V1 CDN Client
   */
  flushV1CDN() {
    this.sendTrackClick('web::hosting::cdn::empty-cache::confirm');
    return this.Hosting.flushCdn(this.serviceName);
  }

  /**
   * Flushed by domain, implemented for CDN V2
   */
  flushSharedCDN() {
    this.sendTrackClick('web::hosting::multisites::purge-cdn::confirm');
    return this.HostingCdnSharedService.flushCDNDomainCache(
      this.serviceName,
      this.domain,
    );
  }

  sendTrackClick(hit) {
    this.atInternet.trackClick({
      name: hit,
      type: 'action',
    });
  }
}
