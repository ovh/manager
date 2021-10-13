import { CDN_TYPE } from '../hosting-multisite.constants';
import { HOSTING_CDN_ORDER_CDN_VERSION_V1 } from '../../cdn/order/hosting-cdn-order.constant';

export default class HostingCdnFlushCtrl {
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
    this.isFlushing = false;

    const { type, version } = this.cdnProperties;
    const defaultOptionName = 'all';

    this.isAdvancedCdnType = type === CDN_TYPE.ADVANCED;
    this.isV1Cdn = version === HOSTING_CDN_ORDER_CDN_VERSION_V1;
    this.cdnFlushModel = {
      selectedOption: null,
      options: [
        {
          disabled: false,
          name: 'all',
          hint: null,
          fieldValue: '',
        },
        {
          disabled: !this.isAdvancedCdnType,
          name: 'folder',
          hint: '/FOLDER/',
          fieldValue: '',
        },
        {
          disabled: !this.isAdvancedCdnType,
          name: 'uri',
          hint: '/FOLDER/FILE.EXT',
          fieldValue: '',
        },
        {
          disabled: !this.isAdvancedCdnType,
          name: 'extension',
          hint: '/.EXT',
          fieldValue: '',
        },
        {
          disabled: !this.isAdvancedCdnType,
          name: 'regex',
          hint: '.*/FILE.EXT$',
          fieldValue: '',
        },
      ],
    };
    this.cdnFlushModel.selectedOption = this.getSelectedOption(
      defaultOptionName,
    );

    this.atInternet.trackPage({
      name: 'web::hosting::multisites::purge-cdn',
    });
  }

  getSelectedOption(optionName) {
    return this.cdnFlushModel.options.find(({ name }) => name === optionName);
  }

  sendTrackClick(hit) {
    this.atInternet.trackClick({
      name: hit,
      type: 'action',
    });
  }

  flushCdn() {
    this.isFlushing = true;

    const flushPromise = this.isV1Cdn
      ? this.flushBasicOrSecurityCdn()
      : this.flushAdvancedCdn();
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
            err.data?.message
          }`,
          'error',
        );
      })
      .finally(() => {
        this.isFlushing = false;
      });
  }

  /**
   * Flush CDN that have type basic or security
   * @returns {Promise}
   */
  flushBasicOrSecurityCdn() {
    this.sendTrackClick('web::hosting::cdn::empty-cache::confirm');
    return this.Hosting.flushCdn(this.serviceName);
  }

  /**
   * Flush CDN that have type advanced
   * @returns {Promise}
   */
  flushAdvancedCdn() {
    this.sendTrackClick('web::hosting::multisites::purge-cdn::confirm');
    return this.HostingCdnSharedService.flushCDNDomainCache(
      this.serviceName,
      this.domain,
    );
  }
}
