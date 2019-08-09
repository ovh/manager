import { PREFERENCE_NAME } from './preference.constants';

export const name = 'ovhManagerPccDashboardOptionsPreference';

export const OvhManagerPccDashboardOptionsPreference = class {
  /* @ngInject */
  constructor(
    $q,
    ovhUserPref,
  ) {
    this.$q = $q;
    this.ovhUserPref = ovhUserPref;
  }

  doesPreferenceExists(serviceName) {
    return this.ovhUserPref
      .getKeys()
      .then(keys => (keys.includes(PREFERENCE_NAME)
        ? this.fetchPreference(serviceName)
        : this.$q.reject({ status: 404 })))
      .then(preference => _.isObject(preference))
      .catch(error => (error.status === 404
        ? false
        : error));
  }

  fetchPreference(serviceName) {
    return this.ovhUserPref
      .getValue(PREFERENCE_NAME)
      .then(preference => (_.isObject(preference[serviceName])
        ? preference[serviceName]
        : this.$q.reject({ status: 404 })));
  }

  removePreference(serviceName) {
    return this.fetchPreference(serviceName)
      .then(preference => this.updatePreference(_.omit(preference, serviceName)));
  }

  updatePreference(preference) {
    return this.ovhUserPref
      .remove(PREFERENCE_NAME)
      .then(() => this.ovhUserPref.assign(preference));
  }
};

export default {
  name,
  OvhManagerPccDashboardOptionsPreference,
};
