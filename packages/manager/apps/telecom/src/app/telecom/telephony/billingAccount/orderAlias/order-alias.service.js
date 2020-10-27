import assignIn from 'lodash/assignIn';
import filter from 'lodash/filter';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import isArray from 'lodash/isArray';
import map from 'lodash/map';
import pull from 'lodash/pull';
import set from 'lodash/set';

import { TELEPHONY_NUMBER_OFFER } from './order-alias.constant';

export default /* @ngInject */ function TelecomTelephonyBillingAccountOrderAliasService(
  $q,
  OvhApiTelephony,
  OvhApiMe,
) {
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
    const firstForeigns = pull(
      Object.keys(TELEPHONY_NUMBER_OFFER.prefix),
      country,
    ).slice(0, 3);
    return `${map(
      firstForeigns,
      (theCountry) => TELEPHONY_NUMBER_OFFER.prefix[theCountry],
    ).join(',&nbsp;')},&nbsp;...`;
  }

  /**
   * Get the current user country
   * @returns {Promise}
   */
  this.getUser = function getUser() {
    return OvhApiMe.v6()
      .get()
      .$promise.then((user) => {
        set(user, 'country', user.country.toLowerCase());
        set(
          user,
          'legalform',
          !user.companyNationalIdentificationNumber
            ? 'individual'
            : 'corporation',
        );
        return user;
      })
      .catch((err) => $q.reject(err));
  };

  /**
   * Get the detail all offers
   * @param          {String} billingAccount Billing account
   * @param          {String} country        Country for prices
   * @param  {Array | String} ids            List of Ids
   * @param          {Object} filters         Filter to apply on the 2API response
   * @returns {Promise}
   */
  this.getOfferDetails = function getOfferDetails(
    billingAccount,
    country,
    idsParam,
    filters,
  ) {
    // eslint-disable-next-line no-param-reassign
    TELEPHONY_NUMBER_OFFER.detail.international.clarification = `(${generateInternationalClarification(
      country,
    )})`;
    const ids = isArray(idsParam) ? idsParam : [idsParam];
    return OvhApiTelephony.Number()
      .Aapi()
      .prices({
        billingAccount,
        country,
      })
      .$promise.then(
        // No error from 2API
        (offers) =>
          flatten(
            ids.map((id) => {
              const prices = filter(
                offers,
                assignIn(
                  {
                    type: id,
                  },
                  filters,
                ),
              );

              return map(prices, (price) => {
                set(
                  price,
                  'withoutTax.text',
                  noBreakingSpace(price.withoutTax.text),
                );
                set(price, 'withTax.text', noBreakingSpace(price.withTax.text));
                return assignIn(price, TELEPHONY_NUMBER_OFFER.detail[id]);
              });
            }),
          ),

        // Error from 2API, send incomplete data
        () => ids.map((id) => TELEPHONY_NUMBER_OFFER.detail[id]),
      );
  };

  /**
   * Get all the offers
   * @param {String} billingAccount Billing account
   * @param          {String} country        Country for prices
   * @param {Object} filter         Filter to apply on the 2API response
   * @returns {Promise}
   */
  this.getOffers = function getOffers(billingAccount, country, filters) {
    return this.getOfferDetails(
      billingAccount,
      country,
      TELEPHONY_NUMBER_OFFER.list,
      filters,
    );
  };

  /**
   * Get predefined number
   * @param {String} country  be | ch | de | es | fr | gb
   * @param {string} type     geographic | nogeographic | special
   * @param {String} zone    Town
   * @param {String} range   Beginning of the number
   * @returns {*}
   */
  this.getPredefinedNumbers = function getPredefinedNumbers(
    country,
    type,
    zone,
    range,
  ) {
    return OvhApiTelephony.Number()
      .v6()
      .getSpecificNumbers({
        country,
        type,
        zone,
        range,
      })
      .$promise.then(
        (numbers) => ({
          premium: map(filter(numbers, { isPremium: true }), 'number'),
          common: map(filter(numbers, { isPremium: false }), 'number'),
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
  this.getPrice = function getPrice(billingAccount, country, type) {
    return this.getOfferDetails(billingAccount, country, type).then(
      (pricesParam) => {
        const prices = map(pricesParam, (price) => ({
          title: ['telephony_order_number_type', price.range, 'label'].join(
            '_',
          ),
          range: price.range,
          withTax: price.withTax,
          withoutTax: price.withoutTax,
        }));
        return {
          common: find(prices, { range: 'common' }),
          specific: find(prices, { range: 'specific' }),
        };
      },
    );
  };

  /**
   * Get all foreign countries
   * @return {Promise}
   */
  this.getForeignCountries = function getForeignCountries() {
    return this.getUser().then(() =>
      OvhApiTelephony.v6()
        .schema()
        .$promise.then(
          (schema) => schema.models['telephony.NumberCountryEnum'].enum,
        ),
    );
  };
}
