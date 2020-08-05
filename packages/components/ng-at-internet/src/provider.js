import angular from 'angular';
import {
  isEmpty,
  slice,
  map,
  forOwn,
  has,
  each,
  indexOf,
  isUndefined,
  isNumber,
} from 'lodash-es';

/**
 * @ngdoc service
 * @require ATInternet smarttag.js library
 * @name atInternet
 * @description
 * Angular service wrapping the AtInternet tracking Javascript library.
 *
 * More informations : http://developers.atinternet-solutions.com/javascript-fr/bien-commencer-fr-javascript-fr/initialisation-du-tracker-javascript/
 */
/**
 * @ngdoc service
 * @require ATInternet smarttag.js library
 * @name atInternetProvider
 * @description
 * Provider allowing configuration for atInternet service.
 */
export default /* @ngInject */ function(AT_INTERNET_CUSTOM_VARS) {
  const config = {
    enabled: false, // enable or disable tracking
    debug: false, // enable or disable logging tracking in JS console
    defaults: {}, // default data to be sent with each hit
  };

  let defaultsPromise; // to be sure that defaults are setted after a promise resoltion

  // reference to ATInternet Tag object from their JS library
  let atinternetTag = null;

  /**
   * @ngdoc function
   * @name atInternet.isDefaultSet
   * @methodOf atInternetProvider
   * @description
   * Check if default data has been set.
   */
  this.isDefaultSet = function isDefaultSet() {
    return !isEmpty(config.defaults);
  };

  /**
   * @ngdoc function
   * @name atInternet.setDefaults
   * @methodOf atInternetProvider
   * @param {Object} def Default values to be sent.
   * @description
   * Configure default data to be sent with each tracking data.
   */
  this.setDefaults = function setDefaults(def) {
    config.defaults = def;
  };

  /**
   * @ngdoc function
   * @name atInternet.getDefaults
   * @methodOf atInternetProvider
   * @description
   * Retrieve default data to be sent with each tracking data.
   */
  this.getDefaults = function getDefaults() {
    return angular.copy(config.defaults);
  };

  /**
   * @ngdoc function
   * @name atInternet.getDefaultsPromise
   * @methodOf atInternetProvider
   * @description
   * Retrieve the default promise setted by atInternet.setDefaultsPromise method.
   */
  this.getDefaultsPromise = function getDefaultsPromise() {
    return defaultsPromise;
  };

  /**
   * @ngdoc function
   * @name atInternet.setEnabled
   * @methodOf atInternetProvider
   * @param {Boolean} state True to enable tracking, false otherwise.
   * @description
   * Enable or disable tracking.
   */
  this.setEnabled = function setEnabled(state) {
    config.enabled = state;
  };

  /**
   * @ngdoc function
   * @name atInternet.setDebug
   * @methodOf atInternetProvider
   * @param {Boolean} state True to enable console logs, false otherwise.
   * @description
   * Enable or disable logging of tracking data in the Javascript console.
   */
  this.setDebug = function setDebug(state) {
    config.debug = state;
  };

  this.$get = /* @ngInject */ function $get($window, $log) {
    // Reference to ATInternet JS lib
    if ($window.ATInternet) {
      try {
        atinternetTag = new $window.ATInternet.Tracker.Tag({
          secure: true, // force HTTPS
        });
      } catch (err) {
        atinternetTag = null;
        $log.error('atinternet tag initialization failed', err);
      }
    }

    /**
     * Check if the service is enabled and if the ATInternet js lib is loaded
     */
    function isAtInternetTagAvailable() {
      let available = config.enabled;
      if (available && !atinternetTag) {
        available = false;
        $log.error('atinternet missing smarttag.js dependency');
      }
      return available;
    }

    /**
     * Log arguments if debug is enabled
     */
    function logDebugInfos() {
      if (config.debug) {
        $log.info.apply(null, slice(arguments, 0)); // eslint-disable-line prefer-rest-params
      }
    }

    /**
     * Returns a randomized string of length "len"
     */
    function getRandomString(len) {
      const alphabet =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      return map(new Array(len), () =>
        alphabet.charAt(Math.floor(Math.random() * alphabet.length)),
      ).join('');
    }

    /**
     * Returns an unique ID (used by orders and carts)
     * To ensure that the ID is unique, we generate it from current milliseconds
     * and concat a random string to avoid any collisions.
     */
    function getUniqueId() {
      // unique key : current milliseconds in base 36 concatenated with 8 random chars
      return new Date().valueOf().toString(36) + getRandomString(8);
    }

    /**
     * Returns updated given data with defaults config and level2
     */
    function updateData(dataParam) {
      const data = dataParam;
      angular.extend(data || {}, config.defaults);

      // Allow user to set identifiedVisitor id
      if (!isEmpty(data.visitorId)) {
        atinternetTag.identifiedVisitor.set({ id: data.visitorId });
      }

      // no level2 ? use default and warn
      if (angular.isUndefined(data.level2)) {
        data.level2 = 0;
        $log.warn(
          'atinternet level2 attribute undefined: use default unclassified level2 "0". Please fix it!',
        );
      }
    }

    function updateCustomVars(data, conf, attr, customVars) {
      // if data has custom attribute
      if (has(data, attr)) {
        const keys = conf.path.split('.');
        let tmp = customVars;

        /*
         * Populate attribute into customVars
         * example :
         *   myAttr : { path : "a.b.c", format : "[%s]" }
         * will result in :
         *   customVars : {
         *     a { b { c : [value] }}}
         */
        each(keys, (key, idx) => {
          if (idx === keys.length - 1 && conf.format) {
            tmp[key] = conf.format.replace('%s', data[attr]);
          } else {
            tmp[key] = tmp[key] || {};
            tmp = tmp[key];
          }
        });
      }
    }

    function getCustomVarsWithDefaults(event) {
      const customVars = {};
      forOwn(AT_INTERNET_CUSTOM_VARS, (conf, attr) => {
        updateCustomVars(config.defaults, conf, attr, customVars);
        updateCustomVars(event, conf, attr, customVars);
      });
      return customVars;
    }

    return {
      isTagAvailable: isAtInternetTagAvailable,

      /**
       * @ngdoc function
       * @name atInternet.setDefaults
       * @methodOf atInternet
       * @param {Object} def Default values to be sent.
       * @description
       * Configure default data to be sent with each tracking data.
       */
      setDefaults(def) {
        config.defaults = def;
      },

      /**
       * @ngdoc function
       * @name atInternet.setDefaultsPromise
       * @methodOf atInternet
       * @param {Promise} promise A promise that needs to be resolved before sending hits.
       * @description
       * Configure the defaults promise that needs to be resolved before sending hits (to be sure
       * that defaults are setted).
       */
      setDefaultsPromise(promise) {
        const self = this;

        defaultsPromise = promise.then((defaults) => {
          self.setDefaults(defaults);
        });
      },

      /**
       * @ngdoc function
       * @name atInternet.setEnabled
       * @methodOf atInternet
       * @param {Boolean} state True to enable tracking, false otherwise.
       * @description
       * Enable or disable tracking.
       */
      setEnabled(state) {
        config.enabled = state;
      },

      getTag() {
        return atinternetTag;
      },

      /**
       * @ngdoc function
       * @name getConfig
       * @methodOf atInternet
       * @description
       *
       * Returns current atInternet's provider configuration.
       */
      getConfig() {
        return angular.copy(config);
      },

      /**
       * @ngdoc function
       * @name trackPage
       * @methodOf atInternet
       * @param {Object} pageData Page data to be sent.
       * @description
       *
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
       */
      trackPage(pageDataParam) {
        const pageData = pageDataParam;
        if (isAtInternetTagAvailable()) {
          updateData(pageData);
          if (pageData.name) {
            pageData.customVars = getCustomVarsWithDefaults(pageDataParam);
            atinternetTag.page.send(pageData);
            logDebugInfos('atinternet.trackpage: ', pageData);
          } else {
            $log.error(
              'atinternet.trackPage invalid data: missing name attribute',
              pageData,
            );
          }
        }
      },

      /**
       * @ngdoc
       * @name trackClick
       * @methodOf atInternet
       * @param {Object} clickData Click data to be sent.
       * @description
       *
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
       */
      trackClick(clickData) {
        if (isAtInternetTagAvailable()) {
          updateData(clickData);
          if (
            indexOf(
              ['action', 'navigation', 'download', 'exit'],
              clickData.type,
            ) >= 0
          ) {
            atinternetTag.click.send(clickData);
            logDebugInfos('atinternet.trackclick: ', clickData);
          } else {
            $log.error(
              "atinternet.trackClick invalid or missing 'type' attribute for data",
              clickData,
            );
          }
        }
      },

      /**
       * @ngdoc
       * @name trackOrder
       * @methodOf atInternet
       * @param {Object} productData Product data to be sent.
       * @description
       *
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
       */
      trackOrder(productData) {
        if (isAtInternetTagAvailable()) {
          updateData(productData);

          // Check if product data has all required attributes
          if (!productData.page) {
            $log.error(
              'atinternet.trackProduct missing page attribute: ',
              productData,
            );
            return;
          }
          if (!productData.name) {
            $log.error(
              'atinternet.trackProduct missing name attribute: ',
              productData,
            );
            return;
          }
          if (
            isUndefined(productData.price) &&
            isUndefined(productData.priceTaxFree)
          ) {
            $log.error(
              'atinternet.trackProduct missing price attribute: ',
              productData,
            );
            return;
          }

          const orderId = productData.orderId || getUniqueId();
          const cartId = `cart-${orderId}`;

          // set the current page (page must be configured as "main objective" in ATInternet
          // manager!)
          atinternetTag.page.set({
            name: productData.page,
            level2: productData.level2,
          });

          // create the cart
          atinternetTag.cart.set({
            cardId: cartId,
          });

          const product = {
            productId: productData.name,
            quantity: productData.quantity || 1,
          };

          const amount = {};
          let turnover = 0;

          const status = productData.status || 3;

          if (isNumber(productData.price)) {
            product.unitPriceTaxIncluded = productData.price;
            amount.amountTaxIncluded = productData.price * product.quantity;
            turnover = productData.price * product.quantity;
          }

          if (isNumber(productData.priceTaxFree)) {
            product.unitPriceTaxFree = productData.priceTaxFree;
            amount.amountTaxFree = productData.priceTaxFree * product.quantity;
            turnover = productData.priceTaxFree * product.quantity;
          }

          // add the product to the cart
          atinternetTag.cart.add({ product });

          // create a valid order
          atinternetTag.order.set({
            orderId, // must be unique
            status,
            amount,
            turnover,
          });

          atinternetTag.customVars.set(getCustomVarsWithDefaults(productData));

          atinternetTag.dispatch();
          logDebugInfos('atinternet.trackOrder: ', productData);
        }
      },

      /**
       * @ngdoc
       * @name trackEvent
       * @methodOf atInternet
       * @param {Object} eventData Event data to be sent.
       * @description
       *
       * Simplified tracking of events.
       */
      trackEvent(eventData) {
        if (isAtInternetTagAvailable()) {
          updateData(eventData);
          if (!eventData.page) {
            $log.error(
              'atinternet.trackEvent missing page attribute: ',
              eventData,
            );
            return;
          }
          if (!eventData.event) {
            $log.error(
              'atinternet.trackEvent missing eventData attribute: ',
              eventData,
            );
            return;
          }
          atinternetTag.page.set({
            name: eventData.page,
            level2: eventData.level2,
          });
          atinternetTag.customVars.set(getCustomVarsWithDefaults(eventData));
          atinternetTag.dispatch();
          logDebugInfos('atinternet.trackEvent: ', eventData);
        }
      },
    };
  };
}
