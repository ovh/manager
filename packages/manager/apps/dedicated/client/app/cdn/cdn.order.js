export const CDN_ORDER_URLS = {
  DEFAULT: 'https://www.ovh.com/fr/cdn/infrastructure/',
  FR: 'https://www.ovh.com/fr/cdn/infrastructure/',
};

export function getCdnOrderUrl(subsidiary) {
  return CDN_ORDER_URLS[subsidiary] || CDN_ORDER_URLS.DEFAULT;
}

export default CDN_ORDER_URLS;
