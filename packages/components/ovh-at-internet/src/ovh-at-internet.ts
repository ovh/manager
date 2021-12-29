import { has, isNumber } from 'lodash-es';
import {
  OvhAtInternetConfig,
  PageData,
  OrderData,
  ClickData,
  ImpressionData,
  ImpressionDataClick,
  EventData,
} from './config';
import { IOvhAtInternetTrack } from './track';
import { getUniqueId } from './utils';
import {
  AT_INTERNET_CUSTOM_VARS,
  AtInternetCustomVar,
  IAtInternetCustomVar,
} from './constants';
import { ATInternetTagOptions } from '.';

interface Product {
  productId: string;
  quantity: number;
  unitPriceTaxIncluded?: number;
  amountTaxIncluded?: number;
}

export default class OvhAtInternet extends OvhAtInternetConfig {
  /**
   * Reference to ATInternet Tag object from their JS library.
   */
  private atinternetTag: ATInternetTagOptions = null;

  private trackQueue: Array<IOvhAtInternetTrack<PageData>> = [];

  // protected defaults;
  /**
   * Log arguments if debug is enabled
   */
  private logDebugInfos(log: string, logData: unknown): void {
    if (this.debug) {
      console.info(log, logData);
    }
  }

  /**
   * Returns updated given data with defaults config and level2
   */
  private updateData(trackData: PageData): PageData {
    const data = {
      ...trackData,
      ...this.defaults,
    };

    // Allow user to set identifiedVisitor id
    if (!data.visitorId) {
      this.atinternetTag.identifiedVisitor.set({ id: data.visitorId });
    }

    // no level2 ? use default and warn
    if (data.level2 === undefined) {
      data.level2 = '0';
      console.warn(
        'atinternet level2 attribute undefined: use default unclassified level2 "0". Please fix it!',
      );
    }

    return data;
  }

  private updateCustomVars(
    data: unknown,
    varValue: IAtInternetCustomVar,
    varKey: string,
    customVars: Record<string, string | Record<string, never>>,
  ) {
    // if data has custom attribute
    if (has(data, varKey)) {
      const valuePath = varValue.path[this.region] || varValue.path.default;
      const keys = valuePath.split('.');
      let tmp = customVars;

      /*
       * Populate attribute into customVars
       * example :
       *   myAttr : { path : "a.b.c", format : "[%s]" }
       * will result in :
       *   customVars : {
       *     a { b { c : [value] }}}
       */
      keys.forEach((key: AtInternetCustomVar, idx: number) => {
        if (idx === keys.length - 1 && varValue.format) {
          tmp[key] = varValue.format.replace(
            '%s',
            data[varKey as keyof typeof data] as string,
          );
        } else {
          tmp[key] = tmp[key] || {};
          tmp = tmp[key] as Record<string, never>;
        }
      });
    }
  }

  private getCustomVarsWithDefaults(trackData: unknown) {
    const customVars = {};
    Object.keys(AT_INTERNET_CUSTOM_VARS).forEach(
      (customVarKey: AtInternetCustomVar) => {
        const customVarVal = AT_INTERNET_CUSTOM_VARS[customVarKey];
        this.updateCustomVars(
          this.defaults,
          customVarVal,
          customVarKey,
          customVars,
        );
        this.updateCustomVars(
          trackData,
          customVarVal,
          customVarKey,
          customVars,
        );
      },
    );
    return customVars;
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
      trackFunction(data);
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

  trackPage(pageDataParam: PageData): void {
    let pageData = pageDataParam;
    if (this.isTagAvailable()) {
      pageData = this.updateData(pageData);
      if (pageData.name) {
        pageData.customVars = this.getCustomVarsWithDefaults({
          pageUrl: encodeURIComponent(window.location.href),
          ...pageDataParam,
        });
        this.atinternetTag.page.send(pageData);
        this.logDebugInfos('atinternet.trackpage: ', pageData);
      } else {
        console.error(
          'atinternet.trackPage invalid data: missing name attribute',
          pageData,
        );
      }
    } else {
      this.trackQueue.push({
        type: 'trackPage',
        data: pageData,
      });
    }
  }

  trackClick(clickDataParam: ClickData): void {
    let clickData = clickDataParam;
    if (this.isTagAvailable()) {
      clickData = this.updateData(clickData) as ClickData;
      if (
        ['action', 'navigation', 'download', 'exit'].includes(clickData.type)
      ) {
        this.atinternetTag.click.send(clickData);
        this.logDebugInfos('atinternet.trackclick: ', clickData);
      } else {
        console.error(
          "atinternet.trackClick invalid or missing 'type' attribute for data",
          clickData,
        );
      }
    } else {
      this.trackQueue.push({ type: 'trackClick', data: clickData });
    }
  }

  trackOrder(orderDataParam: OrderData): void {
    let orderData = orderDataParam;
    if (this.isTagAvailable()) {
      orderData = this.updateData(orderData) as OrderData;

      // Check if product data has all required attributes
      if (!orderData.page) {
        console.error(
          'atinternet.trackProduct missing page attribute: ',
          orderData,
        );
        return;
      }
      if (!orderData.name) {
        console.error(
          'atinternet.trackProduct missing name attribute: ',
          orderData,
        );
        return;
      }
      if (
        orderData.price === undefined &&
        orderData.priceTaxFree === undefined
      ) {
        console.error(
          'atinternet.trackProduct missing price attribute: ',
          orderData,
        );
        return;
      }

      const orderId = orderData.orderId || getUniqueId();
      const cartId = `cart-${orderId}`;

      // set the current page (page must be configured as "main objective" in ATInternet
      // manager!)
      this.atinternetTag.page.set({
        name: orderData.page,
        level2: orderData.level2,
      });

      // create the cart
      this.atinternetTag.cart.set({
        cardId: cartId,
      });

      let product: Product = {
        productId: orderData.name,
        quantity: orderData.quantity || 1,
      };

      const amount = {};
      let turnover = 0;

      const status = orderData.status || 3;

      if (isNumber(orderData.price)) {
        product = {
          ...product,
          unitPriceTaxIncluded: orderData.price,
          amountTaxIncluded: orderData.price * product.quantity,
        };
        turnover = orderData.price * product.quantity;
      }

      if (isNumber(orderData.priceTaxFree)) {
        product = {
          ...product,
          unitPriceTaxFree: orderData.priceTaxFree,
          amountTaxFree: orderData.priceTaxFree * product.quantity,
        } as Product;
        turnover = orderData.priceTaxFree * product.quantity;
      }

      // add the product to the cart
      this.atinternetTag.cart.add({ product });

      // create a valid order
      this.atinternetTag.order.set({
        orderId, // must be unique
        status,
        amount,
        turnover,
      });

      this.atinternetTag.customVars.set(
        this.getCustomVarsWithDefaults(orderData),
      );

      this.atinternetTag.dispatch();
      this.logDebugInfos('atinternet.trackOrder: ', orderData);
    } else {
      this.trackQueue.push({ type: 'trackOrder', data: orderData });
    }
  }

  trackEvent(eventDataParam: EventData): void {
    const eventData = eventDataParam;
    if (this.isTagAvailable()) {
      if (!eventData.page) {
        console.error(
          'atinternet.trackEvent missing page attribute: ',
          eventData,
        );
        return;
      }
      if (!eventData.event) {
        console.error(
          'atinternet.trackEvent missing eventData attribute: ',
          eventData,
        );
        return;
      }
      this.atinternetTag.page.set({
        name: eventData.page,
        level2: eventData.level2,
      });
      this.atinternetTag.customVars.set(
        this.getCustomVarsWithDefaults(eventData),
      );
      this.atinternetTag.dispatch();
      this.logDebugInfos('atinternet.trackEvent: ', eventData);
    } else {
      this.trackQueue.push({ type: 'trackEvent', data: eventData });
    }
  }

  trackImpression(impressionDataParam: ImpressionData): void {
    const impressionData = impressionDataParam;
    if (this.isTagAvailable()) {
      this.updateData(impressionData);
      if (!impressionData.campaignId) {
        console.error(
          'atinternet.trackImpression missing impressionData attribute: ',
          impressionData,
        );
        return;
      }
      this.atinternetTag.publisher.set({
        impression: impressionData,
      });
      this.atinternetTag.dispatch();
      this.logDebugInfos('atinternet.trackImpression: ', impressionData);
    } else {
      this.trackQueue.push({ type: 'trackImpression', data: impressionData });
    }
  }

  trackClickImpression(impressionDataParam: ImpressionDataClick): void {
    const impressionData = impressionDataParam;
    if (this.isTagAvailable()) {
      this.updateData(impressionData);
      if (!impressionData.click) {
        console.error(
          'atinternet.trackClickImpression missing impressionData attribute: ',
          impressionData,
        );
        return;
      }
      this.atinternetTag.publisher.send(impressionData);
      this.logDebugInfos('atinternet.trackClickImpression: ', impressionData);
    } else {
      this.trackQueue.push({
        type: 'trackClickImpression',
        data: impressionData,
      });
    }
  }
}
