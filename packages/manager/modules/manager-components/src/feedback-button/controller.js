const SURVEY_BASE_URL = 'https://s.elq.fr/ovhsat';

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
      const queryParams = new URLSearchParams(this.surveyParams).toString();
      return `${baseUrl}?${queryParams}`;
    }

    return baseUrl;
  }

  initTrackingContext() {
    const chapterKeys = ['chapter1', 'chapter2', 'chapter3'];
    this.computedTrackingContext =
      this.chapters?.reduce((acc, value, index) => {
        acc[chapterKeys[index]] = value;
        return acc;
      }, {}) || {};

    this.formatedTrackingContext = [
      ...(this.chapters?.filter((chapter) => chapter !== '') || []),
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
