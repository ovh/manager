import { getAuthUrl } from '@ovh-ux/manager-core-sso';
import { AUTH_CREATE_TOKEN_API, GUIDE } from '../../iam.constants';

export default class IAMApiKeysOnboardingController {
  /* @ngInject */
  constructor(coreConfig) {
    this.API_KEY_URL = `${getAuthUrl()}${AUTH_CREATE_TOKEN_API}`;
    this.API_KEY_GUIDE =
      GUIDE.APIKEY[coreConfig.getUser().ovhSubsidiary] ?? GUIDE.APIKEY.GB;
  }
}
