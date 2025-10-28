export const LINKS = {
  DB_ORDER_EQ_API: {
    fr_FR: 'https://docs.ovh.com/fr/api/api-premiers-pas/',
    fr_CA: 'https://docs.ovh.com/fr/api/api-premiers-pas/',
    default: 'https://docs.ovh.com/gb/en/customer/first-steps-with-ovh-api/',
  },
  DB_ORDER_EQ_TERRAFORM: {
    fr_FR: 'https://docs.ovh.com/fr/publiccloud/databases/order-terraform/',
    fr_CA: 'https://docs.ovh.com/fr/publiccloud/databases/order-terraform/',
    default:
      'https://docs.ovh.com/gb/en/publiccloud/databases/order-terraform/',
  },
};

export const DATABASE_CREATION_GUIDES =
  'https://github.com/ovh/public-cloud-databases-examples';

export function getDocumentationUrl(
  documentation: Record<string, string>,
  locale: string,
): string {
  return documentation[locale] ?? documentation.default;
}
