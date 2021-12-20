import { has, isNumber } from 'lodash-es';

import { OvhAtInternetConfig } from './config';
import { IOvhAtInternetTrack } from './track';
import { AT_INTERNET_CUSTOM_VARS, AtInternetCustomVar } from './constants';

export default class OvhAtInternet {
  /**
   * OVHAtInternet configuration object.
   */
  config: OvhAtInternetConfig;

  /**
   * Reference to ATInternet Tag object from their JS library.
   */
  private atinternetTag: any = null;

  private trackQueue: Array<IOvhAtInternetTrack> = [];

  constructor() {
    this.config = new OvhAtInternetConfig();
  }

  /**
   * Log arguments if debug is enabled
   */
  private logDebugInfos(log: string, logData: any): void {
    if (this.config.isDebugActive()) {
      console.info(log, logData);
    }
  }

  /**
   * Returns updated given data with defaults config and level2
   */
  private updateData(trackData: any): any {
    const data = {
      ...trackData,
      ...this.config.getDefaults(),
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
    data: any,
    varValue: any,
    varKey: string,
    customVars: any,
  ) {
    // if data has custom attribute
    if (has(data, varKey)) {
      const valuePath =
        varValue.path[this.config.getRegion()] || varValue.path.default;
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
          tmp[key] = varValue.format.replace('%s', data[varKey]);
        } else {
          tmp[key] = tmp[key] || {};
          tmp = tmp[key];
        }
      });
    }
  }

  private getCustomVarsWithDefaults(trackData: any) {
    const customVars = {};
    Object.keys(AT_INTERNET_CUSTOM_VARS).forEach((customVarKey: string) => {
      const customVarVal = AT_INTERNET_CUSTOM_VARS[customVarKey];
      this.updateCustomVars(
        this.config.getDefaults(),
        customVarVal,
        customVarKey,
        customVars,
      );
      this.updateCustomVars(trackData, customVarVal, customVarKey, customVars);
    });
    return customVars;
  }

  /**
   * Returns a randomized string of length "len"
   */
  private getRandomString(len: number): string {
    const alphabet =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return new Array(len)
      .map(() => alphabet.charAt(Math.floor(Math.random() * alphabet.length)))
      .join('');
  }

  /**
   * Returns an unique ID (used by orders and carts)
   * To ensure that the ID is unique, we generate it from current milliseconds
   * and concat a random string to avoid any collisions.
   */
  private getUniqueId(): string {
    // unique key : current milliseconds in base 36 concatenated with 8 random chars
    return new Date().valueOf().toString(36) + this.getRandomString(8);
  }

  /**
   * Check if the service is enabled and if the ATInternet js lib is loaded.
   */
  isTagAvailable(): boolean {
    const isEnabled = this.config.isEnabled();

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
      this[type](data);
    }
  }

  initTag(): void {
    this.atinternetTag = new window.ATInternet.Tracker.Tag({
      ClientSideUserId: { clientSideMode: 'always' },
      secure: true, // force HTTPS,
      disableCookie: !this.config.isEnabled(),
    });
    this.processTrackQueue();
  }

  getTag(): object {
    if (!this.atinternetTag) {
      this.initTag();
    }
    return this.atinternetTag;
  }

  init() {
    // Reference to ATInternet JS lib
    if (window.ATInternet && this.config.isEnabled()) {
      try {
        this.initTag();
      } catch (err) {
        this.atinternetTag = null;
        console.error('atinternet tag initialization failed', err);
      }
    }
  }

  /**
   * Send a page hit to ATInternet tracking service.
   * Page data is the following data-structure :
   *
   * ```
   * pageData {
   *   name: "your-page"    // the page identifier (required)
   *   level2: "1"          // the project id (required)
   *   chapter1: "..."      // section id (optional)
   *   chapter2: "..."      // sub-section id (optional)
   *   chapter3: "..."      // sub-sub-section id (optional)
   *   visitorId: "1234"    // identified visitor id (optional)
   *   customObject: {}     // custom javascript data (optional)
   * }
   * ```
   *
   * More informations here :
   * http://developers.atinternet-solutions.com/javascript-fr/contenus/pages-javascript/
   *
   * @param pageDataParam  Page data to be send.
   */
  trackPage(pageDataParam: any): void {
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

  /**
   * Send a click hit to ATInternet tracking service.
   * Click data is the following data-structure :
   *
   * ```
   * clickData {
   *   name: "your-action"  // the action identifier (required)
   *   level2: "1"          // the project id (required)
   *   type: "action"       // type of click : action || navigation || download
   *                           || exit (required)
   *   visitorId: "1234"    // identified visitor id (optional)
   *   chapter1: "..."      // section id (optional)
   *   chapter2: "..."      // sub-section id (optional)
   *   chapter3: "..."      // sub-sub-section id (optional)
   *   customObject: {}     // custom javascript data (optional)
   * }
   * ```
   *
   * More informations here :
   * http://developers.atinternet-solutions.com/javascript-fr/contenus/clics/
   *
   * @param clickData Click data to be sent.
   */
  trackClick(clickDataParam: any): void {
    let clickData = clickDataParam;
    if (this.isTagAvailable()) {
      clickData = this.updateData(clickData);
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

  /**
   * Simplified tracking of product order.
   * Product data is the following data-structure :
   *
   * ```
   * productData {
   *   name: "your-product"  // the product identifier (required)
   *   page: "your-page"     // page associated with the order (required)
   *                         //   WARNING: the page must be configured in ATInternet manager
   *                         //   to be a main objective page.
   *   level2: "1"           // the project id (required)
   *   price: 42             // price of product tax included (required only if priceTaxFree
   *                            not supplied)
   *   priceTaxFree: 42      // price of product tax free (required only if price is not
   *                            supplied)
   *   orderId: 1            // unique order ID, you can provide it or it will be automatically
   *                            enerated
   *   quantity: 1           // amount of product (default is 1)
   *   status: 3             // status of the order (default is 3 : validated)
   *
   *   visitorId: "1234"    // identified visitor id (optional)
   *   countryCode: "EU"     // country code identifier of the customer (optional)
   *   currencyCode: "EU"    // currency of order (optional)
   * }
   * ```
   *
   * More informations here :
   * http://developers.atinternet-solutions.com/javascript-fr/
   *
   * @param orderDataParam  Product data to be sent.
   */
  trackOrder(orderDataParam: any): void {
    let orderData = orderDataParam;
    if (this.isTagAvailable()) {
      orderData = this.updateData(orderData);

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

      const orderId = orderData.orderId || this.getUniqueId();
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

      let product = {
        productId: orderData.name,
        quantity: orderData.quantity || 1,
      } as any;

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
        };
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

  /**
   * implified tracking of events.
   * @param eventDataParam  Event data to be sent.
   */
  trackEvent(eventDataParam: any): void {
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

  /**
   * Simplified tracking of impression.
   * https://developers.atinternet-solutions.com/javascript-en/campaigns-javascript-en/on-site-ads-javascript-en/
   *
   * ```
   * Impression Data {
   *   impression: {
   *     campaignId: 'id[label]',
   *     creation: 'id[label]',
   *     variant: 'id[label]',
   *     format: '[120x40]',
   *     generalPlacement: '[label]',
   *     detailedPlacement: 'id[label]',
   *     advertiserId: 'id[label]',
   *     url: '[urlEncoded]'
   *   }
   * }
   * ```
   *
   * @param impressionData  Impression data to be sent.
   */
  trackImpression(impressionDataParam: any): void {
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

  /**
   * Simplified tracking of impression click event.
   * https://developers.atinternet-solutions.com/javascript-en/campaigns-javascript-en/on-site-ads-javascript-en/
   *
   * ```
   * Impression Data {
   *   impression: {
   *     campaignId: 'id[label]',
   *     creation: 'id[label]',
   *     variant: 'id[label]',
   *     format: '[120x40]',
   *     generalPlacement: '[label]',
   *     detailedPlacement: 'id[label]',
   *     advertiserId: 'id[label]',
   *     url: '[urlEncoded]'
   *   }
   * }
   * ```
   *
   * @param impressionDataParam  Click impression data to be sent.
   */
  trackClickImpression(impressionDataParam: any): void {
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
