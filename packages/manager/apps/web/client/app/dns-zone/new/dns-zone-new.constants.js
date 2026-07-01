export const TEMPLATES = {
  BASIC: 'basic',
  MINIMIZED: 'minimized',
};

/**
 * Default template sent to the express order. Aligned with the react-order
 * `zone` configo, which hardcodes `'basic'` (full DNS zone with NS / SOA /
 * parking-A / MX records) and no longer exposes the choice to the user.
 */
export const DEFAULT_TEMPLATE = TEMPLATES.BASIC;

export const ZONE_PLAN_CODE = 'zone';
export const ANYCAST_PLAN_CODE = 'anycast';
export const DNSSEC_PLAN_CODE = 'dnssec';
export const DNS_PRODUCT_ID = 'dns';

/** Max length of a domain name (per RFC 1035), enforced on the input. */
export const ZONE_NAME_MAX_LENGTH = 253;

/**
 * Local shape validation for the zone FQDN — same rule as the react-order
 * `zone` configo: 1–253 chars, no leading hyphen, each dot-label 1–63
 * alnum/hyphen, at least one dot.
 */
export const ZONE_NAME_REGEX = /^(?=.{1,253}$)(?!-)[A-Za-z0-9-]{1,63}(\.[A-Za-z0-9-]{1,63})+$/;

/** IAM resource type used to probe whether the account already owns the zone. */
export const IAM_DNS_ZONE_RESOURCE_TYPE = 'dnsZone';

/**
 * Order-API `/checkout` rejection messages the zone probe branches on:
 * `"This zone (toto.fr) already exists"` and `"Invalid zone provided"`.
 */
export const ZONE_EXISTS_ERROR_REGEX = /already exists/i;
export const INVALID_ZONE_ERROR_REGEX = /invalid zone/i;

/** Yearly commitment shared by the zone plan and the Anycast addon. */
export const DEFAULT_DURATION = 'P1Y';
export const DEFAULT_PRICING_MODE = 'default';

/** Pricing tier used to display the Anycast addon price (12 months). */
export const ANYCAST_PRICING_INTERVAL = 12;
export const ANYCAST_PRICING_INTERVAL_UNIT = 'month';

/** Configuration labels expected by the express order. */
export const CONFIGURATION_LABELS = {
  ZONE: 'zone',
  TEMPLATE: 'template',
  DNSSEC: 'dnssec',
};

export const TRACKING = {
  ORDER: {
    name: 'web::dns-zone-new::activate',
    type: 'action',
  },
};

export default {
  TEMPLATES,
  DEFAULT_TEMPLATE,
  ZONE_PLAN_CODE,
  ANYCAST_PLAN_CODE,
  DNSSEC_PLAN_CODE,
  DNS_PRODUCT_ID,
  ZONE_NAME_MAX_LENGTH,
  ZONE_NAME_REGEX,
  IAM_DNS_ZONE_RESOURCE_TYPE,
  ZONE_EXISTS_ERROR_REGEX,
  INVALID_ZONE_ERROR_REGEX,
  DEFAULT_DURATION,
  DEFAULT_PRICING_MODE,
  ANYCAST_PRICING_INTERVAL,
  ANYCAST_PRICING_INTERVAL_UNIT,
  CONFIGURATION_LABELS,
  TRACKING,
};
