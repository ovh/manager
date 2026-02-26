const SURVEY_BASE_URL = 'https://s.elq.fr/ovhsat';
const ALLOWED_SURVEY_PARAMS = ['email', 'nichandle', 'productId'];
const MAX_CHAPTERS = 3;

export default class FeedbackButtonCtrl {
  /* @ngInject */
  constructor(atInternet, coreConfig) {
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.surveyUrl = this.computeSurveyUrl();
    this.initTrackingContext();
  }

  computeSurveyUrl() {
    const locale = this.coreConfig.getUserLocale() || 'fr_FR';
    const languageCode = locale.split(/[-_]/)[0]?.toLowerCase() || 'fr';
    const languageSuffix =
      languageCode !== 'fr' ? `_${languageCode.toUpperCase()}` : '';

    const baseUrl = `${SURVEY_BASE_URL}/${this.applicationKey}_evaluation_survey${languageSuffix}`;

    if (this.surveyParams && Object.keys(this.surveyParams).length > 0) {
      const sanitizedParams = Object.fromEntries(
        Object.entries(this.surveyParams)
          .filter(([key]) => ALLOWED_SURVEY_PARAMS.includes(key))
          .map(([key, value]) => [key, String(value)]),
      );
      const queryParams = new URLSearchParams(sanitizedParams).toString();
      return queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
    }

    return baseUrl;
  }

  initTrackingContext() {
    const chapterKeys = ['chapter1', 'chapter2', 'chapter3'];
    const chapters =
      this.chapters
        ?.filter((chapter) => chapter !== '')
        ?.slice(0, MAX_CHAPTERS) || [];

    this.computedTrackingContext = chapters.reduce((acc, value, index) => {
      acc[chapterKeys[index]] = value;
      return acc;
    }, {});

    this.formatedTrackingContext = [
      ...chapters,
      'tile-feedback',
      'external-link',
      'go-to-survey',
    ].join('::');
  }

  trackClick() {
    this.atInternet.trackClick({
      name: this.formatedTrackingContext,
      type: 'action',
      ...this.computedTrackingContext,
    });
  }
}
