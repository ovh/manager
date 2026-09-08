export const TRACKING_HITS = {
  ENABLE_IAM: 'legacy-access-notice::switch-to-ovhcloud-iam',
  GUIDE: 'legacy-access-notice::go-to-logs-data-platform-guide',
};

// The canonical Logs Data Platform guide hub. Deliberately *not* the module's
// own LOG_DATA_PLATFORM_GUIDES map (detail/detail.constants.js), which the
// sidebar uses: that one is keyed by subsidiary and points at help.ovhcloud.com
// knowledge-base categories, whereas this notice must send customers to the
// docs.ovhcloud.com landing page.
// Sliced by language, not by country: `en` serves en_GB, `fr` serves fr_FR and
// fr_CA. These seven cover every locale the manager offers.
export const GUIDE_URL_TEMPLATE =
  'https://docs.ovhcloud.com/{{lang}}/guides/manage-and-operate/observability/logs-data-platform/landing-page-logs-data-platform';

export const GUIDE_LANGUAGES = ['de', 'en', 'es', 'fr', 'it', 'pl', 'pt'];

export const DEFAULT_GUIDE_LANGUAGE = 'en';

export default {
  TRACKING_HITS,
  GUIDE_URL_TEMPLATE,
  GUIDE_LANGUAGES,
  DEFAULT_GUIDE_LANGUAGE,
};
