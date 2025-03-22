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
    const user = this.coreConfig.getUser();
    this.surveyLink = `${PCC_SURVEY_BASE_URL}/${PCC_SURVEY_KEY_URL[
      user?.ovhSubsidiary
    ] || PCC_SURVEY_KEY_URL.DEFAULT}`;
  }
}
