import get from 'lodash/get';

import {
  ANYCAST_PLAN_CODE,
  ANYCAST_PRICING_INTERVAL,
  ANYCAST_PRICING_INTERVAL_UNIT,
  CONFIGURATION_LABELS,
  DEFAULT_DURATION,
  DEFAULT_PRICING_MODE,
  DEFAULT_TEMPLATE,
  DNS_PRODUCT_ID,
  DNSSEC_PLAN_CODE,
  IAM_DNS_ZONE_RESOURCE_TYPE,
  INVALID_ZONE_ERROR_REGEX,
  ZONE_EXISTS_ERROR_REGEX,
  ZONE_NAME_REGEX,
  ZONE_PLAN_CODE,
} from './dns-zone-new.constants';

const APIV2_IAM_RESOURCE_URL = '/engine/api/v2/iam/resource';

export default class DnsZoneNewService {
  /* @ngInject */
  constructor($q, Apiv2Service, WucOrderCartService) {
    this.$q = $q;
    this.Apiv2Service = Apiv2Service;
    this.WucOrderCartService = WucOrderCartService;
  }

  /**
   * Extract the Anycast addon price for the yearly tier from the public `dns`
   * catalog. Mirrors the react-order configo (addon `anycast`, pricing
   * interval 12 / unit `month`).
   * @param {Object} catalog Public `dns` catalog
   * @return {Object|null}   Catalog price object ({ value, text, currencyCode })
   *  or null when not found.
   */
  // eslint-disable-next-line class-methods-use-this
  getAnycastPrice(catalog) {
    const addon = get(catalog, 'addons', []).find(
      ({ planCode }) => planCode === ANYCAST_PLAN_CODE,
    );
    const pricing = get(addon, 'pricings', []).find(
      (p) =>
        p.interval === ANYCAST_PRICING_INTERVAL &&
        p.intervalUnit === ANYCAST_PRICING_INTERVAL_UNIT,
    );
    return get(pricing, 'price', null);
  }

  /**
   * Validate the zone FQDN before the order, aligned with the react-order
   * `zone` configo (spec TUNNEL A — 1.4/1.6):
   *  1. local regex (shape),
   *  2. IAM ownership probe (the account must not already own the zone),
   *  3. cart `/checkout` probe (the zone must not already exist / be invalid).
   * The cart probe doubles as the DNSSEC-support lookup.
   *
   * @param {string} ovhSubsidiary
   * @param {string} zoneName
   * @return {Promise<{ valid: boolean, dnssecAvailable: boolean }>}
   */
  validateZone(ovhSubsidiary, zoneName) {
    if (!ZONE_NAME_REGEX.test(zoneName || '')) {
      return this.$q.resolve({
        valid: false,
        reason: 'invalid',
        dnssecAvailable: false,
      });
    }

    return this.$q
      .all({
        owned: this.checkZoneOwnership(zoneName),
        availability: this.checkZoneAvailability(ovhSubsidiary, zoneName),
      })
      .then(({ owned, availability }) => {
        const alreadyExists =
          owned ||
          (!availability.available && availability.reason === 'zone_exists');
        if (alreadyExists) {
          return {
            valid: false,
            reason: 'zone_exists',
            dnssecAvailable: false,
          };
        }

        const invalid =
          !availability.available && availability.reason === 'invalid_zone';
        if (invalid) {
          return { valid: false, reason: 'invalid', dnssecAvailable: false };
        }

        return {
          valid: true,
          reason: null,
          dnssecAvailable: availability.dnssecSupported,
        };
      });
  }

  /**
   * IAM ownership probe: `GET v2/iam/resource?resourceName={zone}
   * &resourceType=dnsZone`. A non-empty result means the account already
   * holds that DNS zone. Best-effort: any failure (401/403/network) resolves
   * to `false` so the order is not blocked — the express tunnel will still
   * catch a genuine duplicate.
   *
   * @param {string} zoneName
   * @return {Promise<boolean>} whether the account already owns the zone
   */
  checkZoneOwnership(zoneName) {
    return this.Apiv2Service.httpApiv2({
      method: 'get',
      url: APIV2_IAM_RESOURCE_URL,
      params: {
        resourceName: zoneName,
        resourceType: IAM_DNS_ZONE_RESOURCE_TYPE,
      },
    })
      .then(({ data }) => Array.isArray(data) && data.length > 0)
      .catch(() => false);
  }

  /**
   * Cart-based availability probe: spin up a virtual cart, add the `dns`/`zone`
   * product with its mandatory configuration, then run `/checkout` (rejects
   * with "already exists" / "Invalid zone provided") and read
   * `domain/options?domain={zone}` for DNSSEC support.
   *
   * Best-effort: a hard failure (auth/network/5xx, i.e. not a known checkout
   * rejection) soft-passes as `available: true` so the order flow is not
   * blocked.
   *
   * @param {string} ovhSubsidiary
   * @param {string} zoneName
   * @return {Promise<{ available: boolean, reason?: string, dnssecSupported: boolean }>}
   */
  checkZoneAvailability(ovhSubsidiary, zoneName) {
    let cartId;
    return this.WucOrderCartService.createNewCart(ovhSubsidiary)
      .then((cart) => {
        cartId = cart.cartId;
        return this.WucOrderCartService.assignCart(cartId);
      })
      .then(() =>
        this.WucOrderCartService.addProductToCart(cartId, DNS_PRODUCT_ID, {
          planCode: ZONE_PLAN_CODE,
          duration: DEFAULT_DURATION,
          pricingMode: DEFAULT_PRICING_MODE,
          quantity: 1,
        }),
      )
      .then(({ itemId }) =>
        this.$q.all([
          this.WucOrderCartService.addConfigurationItem(
            cartId,
            itemId,
            CONFIGURATION_LABELS.ZONE,
            zoneName,
          ),
          this.WucOrderCartService.addConfigurationItem(
            cartId,
            itemId,
            CONFIGURATION_LABELS.TEMPLATE,
            DEFAULT_TEMPLATE,
          ),
        ]),
      )
      .then(() => this.WucOrderCartService.getCheckoutInformations(cartId))
      .then(() =>
        // Checkout accepted → the zone can be created. Read DNSSEC support;
        // an options failure is non-fatal (the tile just stays hidden).
        this.WucOrderCartService.getProductOptions(cartId, 'domain', {
          domain: zoneName,
        })
          .then((options) => ({
            available: true,
            dnssecSupported: (options || []).some(
              ({ planCode }) => planCode === DNSSEC_PLAN_CODE,
            ),
          }))
          .catch(() => ({ available: true, dnssecSupported: false })),
      )
      .catch((error) => {
        const message =
          get(error, 'data.message') || get(error, 'message') || '';
        if (ZONE_EXISTS_ERROR_REGEX.test(message)) {
          return {
            available: false,
            reason: 'zone_exists',
            dnssecSupported: false,
          };
        }
        if (INVALID_ZONE_ERROR_REGEX.test(message)) {
          return {
            available: false,
            reason: 'invalid_zone',
            dnssecSupported: false,
          };
        }
        // Hard failure (auth/network/5xx) — soft-pass, let express catch it.
        return { available: true, dnssecSupported: false };
      })
      .finally(() => {
        if (cartId) {
          this.WucOrderCartService.deleteCart(cartId);
        }
      });
  }
}
