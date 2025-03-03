import {
  PCC_SURVEY_KEY_URL,
  PCC_SURVEY_BASE_URL,
} from './customer-survey-banner.constants';

export default class DedicatedCloudCustomerSurveyBAnner {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.surveyLink = `${PCC_SURVEY_BASE_URL}/${PCC_SURVEY_KEY_URL[
      this.coreConfig.getUserLanguage()
    ] || PCC_SURVEY_KEY_URL.default}`;
  }
}
