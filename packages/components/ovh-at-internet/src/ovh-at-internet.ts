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
import { loadManagerTMS } from './manager-tms';
import { debug } from './utils';

import initMixCommander from './mix-commander';

function getPageTrackingData(
  page: LegacyTrackingData,
): Partial<PageTrackingData> {
  const parts = (page?.name || '').split('::');
  const len = parts?.length;
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

function isTrackingDebug() {
  return window.localStorage?.getItem('MANAGER_TRACKING_DEBUG');
}

export default class OvhAtInternet extends OvhAtInternetConfig {
  /**
   * Reference to ATInternet Tag object from their JS library.
   */
  private tag: any = null;

  private trackQueue: Array<IOvhAtInternetTrack> = [];

  private afterSendEventHook: CallableFunction = null;

  getGenericTrackingData(data: LegacyTrackingData): GenericTrackingData {
    const params = {
      ...this.defaults,
      ...data,
    };
    if (params.level2 === undefined) {
      params.level2 = '0';
      console.warn(
        'tracking level2 attribute undefined: use default unclassified level2 "0". Please fix it!',
      );
    }

    const customProps: Partial<LegacyTrackingData> = {};
    Object.entries(AT_INTERNET_CUSTOM_PROPS).forEach(([oldKey, newKey]) => {
      if (oldKey in params) {
        customProps[newKey] = `${params[oldKey]}`;
      }
    });

    return {
      ...customProps,
      country: params.subsidiary,
      website: AT_INTERNET_WEBSITE[params.subsidiary],
      full_url: data.pageUrl || window.top.location.href,
      site_name_1: params.siteName,
      site_level2: AT_INTERNET_LEVEL2[params.level2] || '',
      user_agent: params.userAgent || window.navigator.userAgent,
      currency: params.currencyCode,
      residential_country: params.countryCode,
      user_id: params.visitorId,
      user_category: capitalize(params.legalform),
      page_category: params.page_category,
      complete_page_name: params.complete_page_name,
      page_theme: params.page_theme,
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

  canTrack(): boolean {
    return this.isDefaultSet() && this.enabled && this.tag;
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

  shouldUsePianoAnalytics() {
    if (isTrackingDebug()) {
      return true;
    }

    return (
      !!window.pa &&
      ['EU', 'CA'].includes(this.region) &&
      window.location?.hostname !== 'localhost'
    );
  }

  shouldUseMixCommander() {
    if (isTrackingDebug()) {
      return true;
    }

    return !!window.tC && window.location?.hostname !== 'localhost';
  }

  initTag(withConsent: boolean): Promise<void> {
    // check if the tag is not already initialized
    if (this.tag) {
      return Promise.resolve();
    }
    // if we don't have consent drop previous tracking attemps
    if (!withConsent) {
      this.clearTrackQueue();
    }
    if (this.shouldUsePianoAnalytics()) {
      debug(`tracking init: PianoAnalytics (consent=${withConsent})`);
      const isLocal = isTrackingDebug();
      window.pa.setConfigurations({
        site: isLocal ? 605597 : 563736, // EU & CA
        collectDomain: isLocal
          ? 'https://logs1409.xiti.com'
          : 'https://logs1406.xiti.com', // EU & CA
        addEventURL: 'true',
        cookieDomain: (window.location.hostname.match(/\..+/) || [])[0] || '',
        campaignPrefix: ['at_'],
      });
      this.tag = {};
    } else if (window.ATInternet) {
      debug(`tracking init: ATInternet (consent=${withConsent})`);
      this.tag = new window.ATInternet.Tracker.Tag({
        ClientSideUserId: { clientSideMode: 'always' },
        secure: true, // force HTTPS,
        disableCookie: !withConsent,
      });
    } else {
      debug(`tracking init: no backend (consent=${withConsent})`);
      this.tag = { debug: true };
    }
    return Promise.resolve(withConsent ? this.initVisitorId() : null).then(() =>
      this.processTrackQueue(),
    );
  }

  initVisitorId() {
    return loadManagerTMS().then(({ getVisitorId, updateVisitorId }) => {
      const id = getVisitorId();
      debug(`tracking tms visitor id = '${id}'`);
      if (this.shouldUsePianoAnalytics()) {
        if (id) {
          window.pa.setVisitorId(id);
        } else {
          this.afterSendEventHook = () => {
            updateVisitorId(window.pa.getVisitorId());
            this.afterSendEventHook = null;
          };
        }
      } else if (window.ATInternet) {
        if (id) {
          this.tag.clientSideUserId.set(id);
        } else {
          this.tag.clientSideUserId.get();
          this.tag.clientSideUserId.store();
          updateVisitorId(this.tag.clientSideUserId.get());
        }
      }
    });
  }

  init(withConsent: boolean): Promise<void> {
    try {
      // Init mix commander
      if (withConsent) {
        initMixCommander(this.getGenericTrackingData({ name: '', level2: '' }));
      }
      return this.initTag(withConsent);
    } catch (err) {
      console.error('tracking initialization failed', err);
      this.tag = null;
    }
    return Promise.resolve();
  }

  onConsentModalDisplay() {
    debug('tracking consent modal display');
    if (this.shouldUsePianoAnalytics()) {
      window.pa.privacy.createMode('beforeConsent', false);
      window.pa.privacy.include.property('*', 'beforeConsent');
      window.pa.privacy.include.event('*', 'beforeConsent');
      window.pa.privacy.exclude.storageKey('pa_uid', ['beforeConsent']);
      window.pa.privacy.setMode('beforeConsent');
    }
  }

  onUserConsentFromModal(consent: boolean) {
    debug(`tracking consent modal ${consent ? 'accept' : 'decline'}`);
    if (this.shouldUsePianoAnalytics() && consent) {
      window.pa.privacy.setMode('optin');
    } else if (window.ATInternet) {
      window.ATInternet.Utils.consentReceived(consent);
    }
    return this.init(consent)
      .then(() => {
        if (consent) {
          this.trackClick({
            type: 'action',
            name: 'cookie-banner-manager::accept',
          } as any);
        } else {
          this.trackClick({
            type: 'action',
            name: 'cookie-banner-manager::decline',
          } as any);
        }
      })
      .finally(() => {
        this.setEnabled(consent);
        if (!consent && this.shouldUsePianoAnalytics()) {
          document.cookie = `_pctx=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
          document.cookie = `_pcid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
        }
      });
  }

  sendEvent(type: string, data: any) {
    debug('tracking send', type, data);
    if (type.startsWith('mix-commander') && this.shouldUseMixCommander()) {
      window.tC.trackPage(
        data.user_id,
        data.country,
        data.page,
        data.tc_additional_params,
      );
    } else if (this.shouldUsePianoAnalytics()) {
      const trackingData = { ...filterTrackingData(data) };
      window.pa.setUser(trackingData.user_id, trackingData.user_category);
      delete trackingData.user_id;
      delete trackingData.user_category;
      window.pa.sendEvent(type, trackingData);
    } else if (window.ATInternet) {
      this.tag.events.send(type, filterTrackingData(data));
    }
    if (this.afterSendEventHook) {
      this.afterSendEventHook();
    }
  }

  trackMVTest(data: LegacyTrackingData): void {
    if (this.canTrack()) {
      const tracking = {
        ...this.getGenericTrackingData(data),
        mv_test: data.test,
        mv_wave: data.waveId,
        mv_creation: data.creation,
      };
      if (tracking.mv_test) {
        this.sendEvent('mv_test.display', filterTrackingData(tracking));
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
    if (this.canTrack()) {
      const tracking = {
        ...this.getGenericTrackingData(data),
        ...getPageTrackingData(data),
      };
      if (tracking.page) {
        this.sendEvent('page.display', filterTrackingData(tracking));
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

  trackMixCommanderS3(data: LegacyTrackingData): void {
    if (this.canTrack()) {
      const tracking = {
        ...this.getGenericTrackingData(data),
        ...getPageTrackingData(data),
        tc_additional_params: data.tc_additional_params,
      };
      if (tracking.page) {
        this.sendEvent('mix-commander.display', filterTrackingData(tracking));
      } else {
        console.error(
          'tC.trackPage invalid data: missing name attribute',
          data,
        );
      }
    } else {
      this.trackQueue.push({
        type: 'trackMixCommanderS3',
        data,
      });
    }
  }

  trackClick(data: LegacyTrackingData): void {
    if (this.canTrack()) {
      const pageTrackingData = getPageTrackingData(data);
      let tracking: any = {
        ...this.getGenericTrackingData(data),
        click: pageTrackingData.page,
        click_chapter1: pageTrackingData.page_chapter1,
        click_chapter2: pageTrackingData.page_chapter2,
        click_chapter3: pageTrackingData.page_chapter3,
        ...getPageTrackingData(data?.page),
      };

      if (['action', 'navigation', 'download', 'exit'].includes(data.type)) {
        this.sendEvent('click.action', filterTrackingData(tracking));
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
    if (this.canTrack()) {
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
      this.sendEvent('page.display', filterTrackingData(tracking));
    } else {
      this.trackQueue.push({ type: 'trackEvent', data });
    }
  }

  trackImpression(data: LegacyTrackingData): void {
    const tracking = this.getImpressionTrackingData(data);
    if (this.canTrack()) {
      this.sendEvent('publisher.display', filterTrackingData(tracking));
      if (!tracking.onsitead_campaign) {
        console.error(
          'atinternet.trackImpression missing data attribute: ',
          data,
        );
      }
    } else {
      this.trackQueue.push({ type: 'trackImpression', data });
    }
  }

  trackClickImpression({ click: data }: { click: LegacyTrackingData }): void {
    const tracking = this.getImpressionTrackingData(data);
    if (this.canTrack()) {
      this.sendEvent('publisher.click', filterTrackingData(tracking));
      if (!tracking.onsitead_campaign) {
        console.error(
          'atinternet.trackClickImpression missing data attribute: ',
          data,
        );
      }
    } else {
      this.trackQueue.push({ type: 'trackClickImpression', data });
    }
  }
}
