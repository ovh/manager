import { capitalize, isString, mapValues } from 'lodash-es';
import { OvhAtInternetConfig } from './config';
import {
  IOvhAtInternetTrack,
  LegacyTrackingData,
  GenericTrackingData,
  ImpressionTrackingData,
  PageTrackingData,
} from './track';
import {
  AT_INTERNET_CUSTOM_PROPS,
  AT_INTERNET_LEVEL2,
  AT_INTERNET_WEBSITE,
} from './constants';
import { ATInternetTagOptions } from '.';

function getPageTrackingData(
  page: LegacyTrackingData,
): Partial<PageTrackingData> {
  const parts = (page.name || '').split('::');
  const len = parts.length;
  return {
    page: len >= 1 ? parts.slice(Math.min(len - 1, 3)).join('::') : '',
    page_chapter1: len >= 2 ? parts[0] : '',
    page_chapter2: len >= 3 ? parts[1] : '',
    page_chapter3: len >= 4 ? parts[2] : '',
  };
}

function filterTrackingData(data: any) {
  return mapValues(data, (value) => {
    if (isString(value)) {
      // if value is enclosed in brackets, remove then
      return value.replace(/^\[/, '').replace(/\]$/, '');
    }
    return value;
  });
}

export default class OvhAtInternet extends OvhAtInternetConfig {
  /**
   * Reference to ATInternet Tag object from their JS library.
   */
  private atinternetTag: ATInternetTagOptions = null;

  private trackQueue: Array<IOvhAtInternetTrack> = [];

  // protected defaults;
  /**
   * Log arguments if debug is enabled
   */
  private logDebugInfos(log: string, logData: unknown): void {
    if (this.debug) {
      console.info(log, logData);
    }
  }

  getGenericTrackingData(data: LegacyTrackingData): GenericTrackingData {
    const params = {
      ...this.defaults,
      ...data,
    };
    if (params.level2 === undefined) {
      params.level2 = '0';
      console.warn(
        'atinternet level2 attribute undefined: use default unclassified level2 "0". Please fix it!',
      );
    }

    const customProps: Partial<LegacyTrackingData> = {};
    Object.entries(AT_INTERNET_CUSTOM_PROPS).forEach(([oldKey, newKey]) => {
      if (oldKey in params) {
        customProps[newKey] = params[oldKey];
      }
    });

    return {
      ...customProps,
      country: params.subsidiary,
      website: AT_INTERNET_WEBSITE[params.subsidiary],
      full_url: data.pageUrl || encodeURIComponent(window.top.location.href),
      site_name: params.siteName,
      site_level2: AT_INTERNET_LEVEL2[params.level2] || params.level2,
      user_agent: params.userAgent || window.navigator.userAgent,
      currency: params.currencyCode,
      residential_country: params.countryCode,
      user_id: params.visitorId,
      user_category: capitalize(params.legalform),
    };
  }

  getImpressionTrackingData(data: LegacyTrackingData): ImpressionTrackingData {
    return {
      ...this.getGenericTrackingData(data),
      onsitead_type: 'Publisher',
      onsitead_campaign: data.campaignId,
      onsitead_creation: data.creation,
      onsitead_variant: data.variant,
      onsitead_format: data.format,
      onsitead_general_placement: data.generalPlacement,
      onsitead_detailed_placement: data.detailedPlacement,
      onsitead_advertiser: data.advertiserId,
      onsitead_url: data.url,
    };
  }

  /**
   * Check if the service is enabled and if the ATInternet js lib is loaded.
   */
  isTagAvailable(): boolean {
    const isEnabled = this.enabled;

    if (isEnabled && !this.atinternetTag) {
      console.error('atinternet missing smarttag.js dependency');
      return false;
    }

    return isEnabled;
  }

  clearTrackQueue(): void {
    this.trackQueue.splice(0, this.trackQueue.length);
  }

  processTrackQueue(): void {
    while (this.trackQueue.length) {
      const { type, data } = this.trackQueue.shift();
      const trackFunction = this[type] as CallableFunction;
      const boundFunction = trackFunction.bind(this);
      boundFunction(data);
    }
  }

  initTag(): void {
    this.atinternetTag = new window.ATInternet.Tracker.Tag({
      ClientSideUserId: { clientSideMode: 'always' },
      secure: true, // force HTTPS,
      disableCookie: !this.enabled,
    });
    this.processTrackQueue();
  }

  getTag(): ATInternetTagOptions {
    if (!this.atinternetTag) {
      this.initTag();
    }
    return this.atinternetTag;
  }

  init() {
    // Reference to ATInternet JS lib
    if (window.ATInternet && this.enabled) {
      try {
        this.initTag();
      } catch (err) {
        this.atinternetTag = null;
        console.error('atinternet tag initialization failed', err);
      }
    }
  }

  trackMVTest(data: LegacyTrackingData): void {
    if (this.isTagAvailable()) {
      const tracking = {
        ...this.getGenericTrackingData(data),
        mv_test: data.test,
        mv_wave: data.waveId,
        mv_creation: data.creation,
      };
      if (tracking.mv_test) {
        this.atinternetTag.events.send(
          'mv_test.display',
          filterTrackingData(tracking),
        );
        this.logDebugInfos('atinternet.trackMVTest: ', tracking);
      } else {
        console.error(
          'atinternet.trackPage invalid data: missing name attribute',
          data,
        );
      }
    } else {
      this.trackQueue.push({
        type: 'trackMVTest',
        data,
      });
    }
  }

  trackPage(data: LegacyTrackingData): void {
    if (this.isTagAvailable()) {
      const tracking = {
        ...this.getGenericTrackingData(data),
        ...getPageTrackingData(data),
      };
      if (tracking.page) {
        this.atinternetTag.events.send(
          'page.display',
          filterTrackingData(tracking),
        );
        this.logDebugInfos('atinternet.trackpage: ', tracking);
      } else {
        console.error(
          'atinternet.trackPage invalid data: missing name attribute',
          data,
        );
      }
    } else {
      this.trackQueue.push({
        type: 'trackPage',
        data,
      });
    }
  }

  trackClick(data: LegacyTrackingData): void {
    if (this.isTagAvailable()) {
      const pageTrackingData = getPageTrackingData(data);
      const tracking = {
        ...this.getGenericTrackingData(data),
        click: pageTrackingData.page,
        click_chapter1: pageTrackingData.page_chapter1,
        click_chapter2: pageTrackingData.page_chapter2,
        click_chapter3: pageTrackingData.page_chapter3,
      };
      if (['action', 'navigation', 'download', 'exit'].includes(data.type)) {
        this.atinternetTag.events.send(
          'click.action',
          filterTrackingData(tracking),
        );
        this.logDebugInfos('atinternet.trackclick: ', tracking);
      } else {
        console.error(
          "atinternet.trackClick invalid or missing 'type' attribute for data",
          data,
        );
      }
    } else {
      this.trackQueue.push({ type: 'trackClick', data });
    }
  }

  trackEvent(data: LegacyTrackingData): void {
    if (this.isTagAvailable()) {
      if (!data.page) {
        console.error('atinternet.trackEvent missing page attribute: ', data);
        return;
      }
      if (!data.event) {
        console.error('atinternet.trackEvent missing event attribute: ', data);
        return;
      }
      const tracking = {
        ...this.getGenericTrackingData(data),
        ...getPageTrackingData(data),
        event: data.event,
      };
      this.atinternetTag.events.send(
        'page.display',
        filterTrackingData(tracking),
      );
      this.logDebugInfos('atinternet.trackEvent: ', data);
    } else {
      this.trackQueue.push({ type: 'trackEvent', data });
    }
  }

  trackImpression(data: LegacyTrackingData): void {
    const tracking = this.getImpressionTrackingData(data);
    if (this.isTagAvailable()) {
      this.atinternetTag.events.send(
        'publisher.display',
        filterTrackingData(tracking),
      );
      if (!tracking.onsitead_campaign) {
        console.error(
          'atinternet.trackImpression missing data attribute: ',
          data,
        );
        return;
      }
      this.logDebugInfos('atinternet.trackImpression: ', tracking);
    } else {
      this.trackQueue.push({ type: 'trackImpression', data });
    }
  }

  trackClickImpression({ click: data }: { click: LegacyTrackingData }): void {
    const tracking = this.getImpressionTrackingData(data);
    if (this.isTagAvailable()) {
      this.atinternetTag.events.send(
        'publisher.click',
        filterTrackingData(tracking),
      );
      if (!tracking.onsitead_campaign) {
        console.error(
          'atinternet.trackClickImpression missing data attribute: ',
          data,
        );
        return;
      }
      this.logDebugInfos('atinternet.trackClickImpression: ', tracking);
    } else {
      this.trackQueue.push({ type: 'trackClickImpression', data });
    }
  }
}
