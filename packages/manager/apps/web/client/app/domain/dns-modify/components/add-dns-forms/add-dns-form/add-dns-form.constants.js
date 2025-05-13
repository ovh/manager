export const INTERNAL_DNS_PATTERN = {
  EU: /^d?ns(?:\d{1,3})?\.ovh\.net/i,
  CA: /d?ns\d{2}\.ovh\.ca/i,
  TN: /d?ns\d\.tn\.ovh\.net/i,
  REGISTRAR: /ns\d-registrar\.ovh\.net/i,
  ANYCAST: /d?ns\d{3}\.anycast\.me/i,
  PARKING: /parking\d\.ovh\.net/i,
  WORLD: /d?ns\d?(?:\.(?:\w{3}|\w{3}-\d))?\.(?:cdn|interne)\.ovh\.net/i,
  NG_GD: /d?ns\.ns-gd\.eu/i,
};

export function isInternalDns(value) {
  return Object.values(INTERNAL_DNS_PATTERN).some((pattern) =>
    pattern.test(value),
  );
}

export function isAnycastDns(value) {
  return INTERNAL_DNS_PATTERN.ANYCAST.test(value);
}

export const DEDICATED_DNS_PATTERN = {
  KIMSUFI: /ns\.kimsufi\.com/i,
  CA: /sdns\d\.ovh\.ca/i,
  EU: /sdns\d\.ovh\.net/i,
  US: /sdns\d\.ovh\.us/i,
};

export function isDedicatedDns(value) {
  return Object.values(DEDICATED_DNS_PATTERN).some((pattern) =>
    pattern.test(value),
  );
}
