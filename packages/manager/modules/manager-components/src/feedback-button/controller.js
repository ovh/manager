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
    return `${SURVEY_BASE_URL}/${this.applicationKey}_evaluation_survey${languageSuffix}`;
  }

  initTrackingContext() {
    const chapterKeys = ['chapter1', 'chapter2', 'chapter3'];
    this.computedTrackingContext =
      this.chapters?.reduce((acc, value, index) => {
        acc[chapterKeys[index]] = value;
        return acc;
      }, {}) || {};

    const chaptersPath =
      this.chapters
        ?.filter((chapter) => chapter !== '')
        ?.join('::') || '';

    this.formatedTrackingContext = chaptersPath
      ? `${chaptersPath}::tile-feedback::external-link::go-to-survey`
      : 'tile-feedback::external-link::go-to-survey';
  }

  trackClick() {
    this.atInternet.trackClick({
      name: this.formatedTrackingContext,
      type: 'action',
      ...this.computedTrackingContext,
    });
  }
}
