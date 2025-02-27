import { API_KEY_URL, GUIDE } from '../../iam.constants';

export default class IAMApiKeysOnboardingController {
  /* @ngInject */
  constructor(coreConfig) {
    this.API_KEY_URL = API_KEY_URL[coreConfig.getRegion()];
    this.API_KEY_GUIDE =
      GUIDE.APIKEY[coreConfig.getUser().ovhSubsidiary] ?? GUIDE.APIKEY.GB;
  }
}
