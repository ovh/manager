export const SURVEY_LANGUAGES = {
  ALLOWED: ['fr'],
  DEFAULT: 'en',
};

export const VRACK_TRACKING_PREFIX =
  'Network::network::vrack-private-network::';

export const VRACK_TRACKING_CONTEXT = {
  page: {
    name: `${VRACK_TRACKING_PREFIX}vrack-private-network::listing::manage_vrack-private-network`,
  },
  page_theme: 'Network',
  page_category: 'listing',
  level2: 99,
};

export const VRACK_DELETE_FEATURE = 'vrack:delete';

export const BASE_URL_SURVEY = 'https://survey.ovh.com/index.php/863655?lang=';
export const US_SURVEY_LINK =
  'https://ovhcloud-us.limesurvey.net/945112?lang=en';

export default {
  SURVEY_LANGUAGES,
  BASE_URL_SURVEY,
  US_SURVEY_LINK,
  VRACK_DELETE_FEATURE,
};
