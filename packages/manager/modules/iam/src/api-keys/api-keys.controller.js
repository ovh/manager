import { TAG, API_KEY_URL } from '../iam.constants';

export default class ApplicationsController {
  /* @ngInject */
  constructor(IAMService, coreConfig) {
    this.IAMService = IAMService;
    this.API_KEY_URL = API_KEY_URL[coreConfig.getRegion()];
  }

  /**
   * Go to resourceGroup deletion
   * @param {string} id The application id
   * @returns {Promise}
   */
  deleteApplication(id) {
    this.trackClick(TAG.API_KEYS__DELETE);
    this.goTo({
      name: 'iam.api-keys.delete',
      params: { apiKey: id },
    });
  }
}
