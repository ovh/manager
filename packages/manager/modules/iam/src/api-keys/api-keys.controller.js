import { getAuthUrl } from '@ovh-ux/manager-core-sso';
import { AUTH_CREATE_TOKEN_API } from '../iam.constants';
import { API_KEYS_TRACKING_HITS } from './api-keys.constants';

export default class ApplicationsController {
  /* @ngInject */
  constructor(IAMService) {
    this.IAMService = IAMService;
    this.API_KEY_URL = `${getAuthUrl()}${AUTH_CREATE_TOKEN_API}`;
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
