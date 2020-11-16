import isObject from 'lodash/isObject';
import omit from 'lodash/omit';

import { PREFERENCE_NAME } from '../../../dashboard/tiles/options/models/order/order.constants';

const moduleName = 'ovhManagerServicePackUpgradePreferenceService';
const name = 'servicePackUpgradePreferenceService';

class PreferenceService {
  /* @ngInject */
  constructor(ovhUserPref) {
    this.ovhUserPref = ovhUserPref;
  }

  savePreference(serviceName, values) {
    return this.ovhUserPref.assign(PREFERENCE_NAME, {
      [serviceName]: values,
    });
  }

  async doesPreferenceExists(serviceName) {
    const preferenceKeys = await this.ovhUserPref.getKeys();

    try {
      const preferenceKeyExists = preferenceKeys.includes(PREFERENCE_NAME);

      if (!preferenceKeyExists) {
        return false;
      }

      return await this.getPreferenceForService(serviceName);
    } catch (error) {
      return error.status === 404;
    }
  }

  getPreferenceForService(serviceName) {
    return this.ovhUserPref
      .getValue(PREFERENCE_NAME)
      .then((preference) =>
        isObject(preference[serviceName])
          ? preference[serviceName]
          : this.$q.reject({ status: 404 }),
      );
  }

  removePreference(serviceName) {
    return this.getPreferenceForService(serviceName).then((preference) =>
      this.updatePreference(omit(preference, serviceName)),
    );
  }

  updatePreference(preference) {
    return this.ovhUserPref
      .remove(PREFERENCE_NAME)
      .then(() => this.ovhUserPref.assign(preference));
  }
}

angular.module(moduleName, []).service(name, PreferenceService);
export default moduleName;
