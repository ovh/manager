import { KEY_PREFERENCES } from '../iam.constants';

const ENDPOINT = '/me/preferences/manager';

export default class PreferencesService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  /**
   * Get manager preference
   * @param {string} key the preference key
   * @returns {Promise}
   */
  getPreference(key) {
    return this.$http.get(`${ENDPOINT}/${key}`).then(({ data }) => data);
  }

  /**
   * Post manager preference
   * @param {string} key the preference key
   * @returns {Promise}
   */
  createPreference(key, value) {
    return this.$http.post(ENDPOINT, { key, value }).then(({ data }) => data);
  }

  /**
   * Put manager preference
   * @param {string} key the preference key
   * @returns {Promise}
   */
  editPreference(key, value) {
    return this.$http
      .put(`${ENDPOINT}/${key}`, { value })
      .then(({ data }) => data);
  }

  /**
   * Get status of AdvancedMode
   * @returns {Promise}
   */
  isAdvancedModeEnabled() {
    return this.getPreference(KEY_PREFERENCES.ADVANCED_MODE)
      .then(({ value }) => value === 'true')
      .catch((err) => {
        if (err.status === 404) {
          this.createPreference(KEY_PREFERENCES.ADVANCED_MODE, 'false');
        }
        return false;
      });
  }

  /**
   * Enable the AdvancedMode
   * @returns {Promise}
   */
  enableAdvancedMode() {
    return this.editPreference(KEY_PREFERENCES.ADVANCED_MODE, 'true');
  }

  /**
   * Disable the AdvancedMode
   * @returns {Promise}
   */
  disableAdvancedMode() {
    return this.editPreference(KEY_PREFERENCES.ADVANCED_MODE, 'false');
  }
}
