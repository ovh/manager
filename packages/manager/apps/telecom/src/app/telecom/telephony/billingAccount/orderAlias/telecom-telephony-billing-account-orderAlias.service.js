angular.module('managerApp').service('TelecomTelephonyBillingAccountOrderAliasService', function ($q, OvhApiTelephony, OvhApiMe, TELEPHONY_NUMBER_OFFER) {
  /**
   * Replace all spaces by no-breaking-spaces
   * @param {String} str Input string
   * @returns {String}
   */
  function noBreakingSpace(str) {
    return str.replace(/\s/g, '&nbsp;');
  }

  /**
   * Generate the liste of the 3 first foreign phone prefixes
   * @param  {String} country Country code
   * @return {String}         Display list
   */
  function generateInternationalClarification(country) {
    const firstForeigns = _.pull(Object.keys(TELEPHONY_NUMBER_OFFER.prefix), country).slice(0, 3);
    return `${_.map(firstForeigns, theCountry => TELEPHONY_NUMBER_OFFER.prefix[theCountry]).join(',&nbsp;')},&nbsp;...`;
  }

  /**
   * Get the current user country
   * @returns {Promise}
   */
  this.getUser = function () {
    return OvhApiMe.v6()
      .get().$promise
      .then((user) => {
        _.set(user, 'country', user.country.toLowerCase());
        _.set(user, 'legalform', !user.companyNationalIdentificationNumber ? 'individual' : 'corporation');
        return user;
      })
      .catch(err => $q.reject(err));
  };

  /**
   * Get the detail all offers
   * @param          {String} billingAccount Billing account
   * @param          {String} country        Country for prices
   * @param  {Array | String} ids            List of Ids
   * @param          {Object} filter         Filter to apply on the 2API response
   * @returns {Promise}
   */
  this.getOfferDetails = function (billingAccount, country, idsParam, filter) {
    TELEPHONY_NUMBER_OFFER.detail.international.clarification = `(${generateInternationalClarification(country)})`; // eslint-disable-line
    const ids = _.isArray(idsParam) ? idsParam : [idsParam];
    return OvhApiTelephony.Number().Aapi().prices({
      billingAccount,
      country,
    }).$promise.then(

      // No error from 2API
      offers => _.flatten(ids.map((id) => {
        const prices = _.filter(
          offers,
          _.extend(
            {
              type: id,
            },
            filter,
          ),
        );

        return _.map(prices, (price) => {
          _.set(price, 'withoutTax.text', noBreakingSpace(price.withoutTax.text));
          _.set(price, 'withTax.text', noBreakingSpace(price.withTax.text));
          return _.extend(price, TELEPHONY_NUMBER_OFFER.detail[id]);
        });
      })),

      // Error from 2API, send incomplete data
      () => ids.map(id => TELEPHONY_NUMBER_OFFER.detail[id]),
    );
  };

  /**
   * Get all the offers
   * @param {String} billingAccount Billing account
   * @param          {String} country        Country for prices
   * @param {Object} filter         Filter to apply on the 2API response
   * @returns {Promise}
   */
  this.getOffers = function (billingAccount, country, filter) {
    return this.getOfferDetails(billingAccount, country, TELEPHONY_NUMBER_OFFER.list, filter);
  };

  /**
   * Get predefined number
   * @param {String} country  be | ch | de | es | fr | gb
   * @param {string} type     geographic | nogeographic | special
   * @param {String} zone    Town
   * @param {String} range   Beginning of the number
   * @returns {*}
   */
  this.getPredefinedNumbers = function (country, type, zone, range) {
    return OvhApiTelephony.Number().v6().getSpecificNumbers({
      country,
      type,
      zone,
      range,
    }).$promise.then(
      numbers => ({
        premium: _.map(_.filter(numbers, { isPremium: true }), 'number'),
        common: _.map(_.filter(numbers, { isPremium: false }), 'number'),
      }),
      (err) => {
        $q.reject(err);
      },
    );
  };

  /**
   * Get prices from API
   * @param {String} billingAccount Billing account
   * @param {String} country        be | ch | de | es | fr | gb
   * @param {string} type           geographic | nogeographic | special
   */
  this.getPrice = function (billingAccount, country, type) {
    return this.getOfferDetails(
      billingAccount,
      country,
      type,
    ).then((pricesParam) => {
      const prices = _.map(
        pricesParam,
        price => ({
          title: ['telephony_order_number_type', price.range, 'label'].join('_'),
          range: price.range,
          withTax: price.withTax,
          withoutTax: price.withoutTax,
        }),
      );
      return {
        common: _.find(prices, { range: 'common' }),
        specific: _.find(prices, { range: 'specific' }),
      };
    });
  };

  /**
   * Get all foreign countries
   * @return {Promise}
   */
  this.getForeignCountries = function () {
    return this.getUser()
      .then(() => OvhApiTelephony.v6().schema().$promise.then(schema => schema.models['telephony.NumberCountryEnum'].enum));
  };
});
