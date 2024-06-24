export const INTERNAL_DNS_PATTERN = {
  EU: /d?ns(?:\d{2,3})?\.ovh\.net/i,
  CA: /d?ns\d{2}\.ovh\.ca/gi,
  TN: /d?ns\d{1}\.tn\.ovh\.net/gi,
  REGISTRAR: /ns\d{1}-registrar\.ovh\.net/gi,
  ANYCAST: /d?ns\d{3}\.anycast\.me/gi,
  PARKING: /parking\d{1}\.ovh\.net/gi,
};

export function isInternalDns(value) {
  return Object.values(INTERNAL_DNS_PATTERN).some((pattern) =>
    pattern.test(value),
  );
}
