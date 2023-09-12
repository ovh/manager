export const ITEMS_POLL_INTERVAL = 10000;
export const GUIDES = [
  {
    id: 'documentation',
    link: {
      DEFAULT: 'https://docs.ovh.com/gb/en/publiccloud/ai/',
      ASIA: 'https://docs.ovh.com/asia/en/publiccloud/ai/',
      GB: 'https://docs.ovh.com/gb/en/publiccloud/ai/',
      DE: 'https://docs.ovh.com/de/publiccloud/ai/',
      AU: 'https://docs.ovh.com/au/en/publiccloud/ai/',
      CA: 'https://docs.ovh.com/ca/en/publiccloud/ai/',
      IE: 'https://docs.ovh.com/ie/en/publiccloud/ai/',
      SG: 'https://docs.ovh.com/sg/en/publiccloud/ai/',
      US: 'https://docs.ovh.com/us/en/publiccloud/ai/',
      ES: 'https://docs.ovh.com/es/publiccloud/ai/',
      QC: 'https://docs.ovh.com/ca/fr/publiccloud/ai/',
      FR: 'https://docs.ovh.com/fr/publiccloud/ai/',
      IT: 'https://docs.ovh.com/it/publiccloud/ai/',
      PL: 'https://docs.ovh.com/pl/publiccloud/ai/',
      PT: 'https://docs.ovh.com/pt/publiccloud/ai/',
    },
  },
];

export const AI_PRICES_URL = {
  DEFAULT:
    'https://www.ovhcloud.com/en/public-cloud/prices/#ai-&-machine-learning',
  DE: 'https://www.ovhcloud.com/de/public-cloud/prices/#ai-&-machine-learning',
  ES:
    'https://www.ovhcloud.com/es-es/public-cloud/prices/#ai-&-machine-learning',
  FR: 'https://www.ovhcloud.com/fr/public-cloud/prices/#ai-&-machine-learning',
  IE:
    'https://www.ovhcloud.com/en-ie/public-cloud/prices/#ai-&-machine-learning',
  IT: 'https://www.ovhcloud.com/it/public-cloud/prices/#ai-&-machine-learning',
  NL: 'https://www.ovhcloud.com/nl/public-cloud/prices/#ai-&-machine-learning',
  PL: 'https://www.ovhcloud.com/pl/public-cloud/prices/#ai-&-machine-learning',
  PT: 'https://www.ovhcloud.com/pt/public-cloud/prices/#ai-&-machine-learning',
  GB:
    'https://www.ovhcloud.com/en-gb/public-cloud/prices/#ai-&-machine-learning',
  CA:
    'https://www.ovhcloud.com/en-ca/public-cloud/prices/#ai-&-machine-learning',
  QC:
    'https://www.ovhcloud.com/fr-ca/public-cloud/prices/#ai-&-machine-learning',
  US: 'https://us.ovhcloud.com/public-cloud/prices/#ai-&-machine-learning',
  MA:
    'https://www.ovhcloud.com/fr-ma/public-cloud/prices/#ai-&-machine-learning',
  SN:
    'https://www.ovhcloud.com/fr-sn/public-cloud/prices/#ai-&-machine-learning',
  TN:
    'https://www.ovhcloud.com/fr-tn/public-cloud/prices/#ai-&-machine-learning',
  AU:
    'https://www.ovhcloud.com/en-au/public-cloud/prices/#ai-&-machine-learning',
  SG:
    'https://www.ovhcloud.com/en-sg/public-cloud/prices/#ai-&-machine-learning',
  ASIA:
    'https://www.ovhcloud.com/asia/public-cloud/prices/#ai-&-machine-learning',
  IN:
    'https://www.ovhcloud.com/en-in/public-cloud/prices/#ai-&-machine-learning',
};

export const AI_ROLES_NAMES = ['ai_training_operator', 'ai_training_read'];

export function countAiItems(itemsList) {
  return Object.values(itemsList).reduce(
    (acc, itemArray) => acc + itemArray.length,
    0,
  );
}

export default {
  AI_PRICES_URL,
  ITEMS_POLL_INTERVAL,
  GUIDES,
  AI_ROLES_NAMES,
  countAiItems,
};
