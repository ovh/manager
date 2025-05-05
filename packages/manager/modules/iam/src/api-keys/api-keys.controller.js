import { API_KEY_URL } from '../iam.constants';
import { API_KEYS_TRACKING_HITS } from './api-keys.constants';

export default class ApplicationsController {
  /* @ngInject */
  constructor(IAMService, coreConfig) {
    this.IAMService = IAMService;
    this.API_KEY_URL = API_KEY_URL[coreConfig.getRegion()];
  }

  /**
   * Go to API-keys deletion
   * @param {string} id The application id
   * @returns {Promise}
   */
  deleteApplication(id) {
    this.trackClick(API_KEYS_TRACKING_HITS.DELETE);
    this.goTo({
      name: 'iam.api-keys.delete',
      params: { apiKey: id },
    });
  }
}
