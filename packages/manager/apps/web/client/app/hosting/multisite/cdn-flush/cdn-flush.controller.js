import { CDN_TYPE } from '../hosting-multisite.constants';
import { HOSTING_CDN_ORDER_CDN_VERSION_V1 } from '../../cdn/order/hosting-cdn-order.constant';
import { PURGE_TYPE_ENUM } from './cdn-flush.constants';

export default class HostingMultisiteCdnFlushCtrl {
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

    this.PURGE_TYPE_ENUM = PURGE_TYPE_ENUM;
  }

  $onInit() {
    this.isFlushing = false;

    const { type, version } = this.cdnProperties;

    this.isAdvancedCdnType = type === CDN_TYPE.ADVANCED;
    this.isV1Cdn = version === HOSTING_CDN_ORDER_CDN_VERSION_V1;
    this.cdnFlushModel = {
      selectedOption: null,
      options: [
        {
          disabled: false,
          patternType: PURGE_TYPE_ENUM.ALL,
          hint: null,
          pattern: '',
        },
        {
          disabled: !this.isAdvancedCdnType,
          patternType: PURGE_TYPE_ENUM.FOLDER,
          hint: '/folder/',
          pattern: '',
        },
        {
          disabled: !this.isAdvancedCdnType,
          patternType: PURGE_TYPE_ENUM.URI,
          hint: '/folder/file.jpg',
          pattern: '',
        },
        {
          disabled: !this.isAdvancedCdnType,
          patternType: PURGE_TYPE_ENUM.EXTENSION,
          hint: 'jpg',
          pattern: '',
        },
        {
          disabled: !this.isAdvancedCdnType,
          patternType: PURGE_TYPE_ENUM.REGEX,
          hint: '.*/file.jpg$',
          pattern: '',
        },
      ],
    };

    // Used to preselect a default option
    this.cdnFlushModel.selectedOption = this.getSelectedOption(
      PURGE_TYPE_ENUM.ALL,
    );
  }

  getSelectedOption(patternType) {
    return this.cdnFlushModel.options.find(
      (option) => option.patternType === patternType,
    );
  }

  getPurgeQueryParams() {
    const { pattern, patternType } = this.cdnFlushModel.selectedOption;

    if (this.isAdvancedCdnType && patternType !== PURGE_TYPE_ENUM.ALL) {
      return new URLSearchParams({ pattern, patternType }).toString();
    }

    return '';
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
      ? this.flushV1Cdn()
      : this.flushSharedCdn();
    return flushPromise
      .then(({ data: operation }) => {
        this.onFlushSuccess(operation);
        return this.goBack(
          this.$translate.instant('hosting_multisite_cdn_flush_success'),
        );
      })
      .catch((err) => {
        return this.goBack(
          `${this.$translate.instant('hosting_multisite_cdn_flush_error')} ${
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
   * Flush v1 CDN version
   * @returns {Promise}
   */
  flushV1Cdn() {
    this.sendTrackClick('web::hosting::cdn::empty-cache::confirm');

    return this.Hosting.flushCdn(this.serviceName);
  }

  /**
   * Flush Shared CDN
   * @returns {Promise}
   */
  flushSharedCdn() {
    this.sendTrackClick(
      `web::hosting::multisites::purge-cdn::confirm::${this.cdnFlushModel.selectedOption.patternType}`,
    );

    return this.HostingCdnSharedService.flushCDNDomainCache(
      this.serviceName,
      this.domain,
      this.getPurgeQueryParams(),
    );
  }
}
