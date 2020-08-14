import has from 'lodash/has';
import isString from 'lodash/isString';

export default class OfficeAttach {
  /* @ngInject */
  constructor(wucExchange, OvhHttp, ovhUserPref, $q, constants) {
    this.wucExchange = wucExchange;
    this.OvhHttp = OvhHttp;
    this.ovhUserPref = ovhUserPref;
    this.$q = $q;
    this.constants = constants;
  }

  retrievingServiceName(serviceName) {
    if (this.constants.target !== 'EU') {
      return this.$q.when(null);
    }

    return this.OvhHttp.get(`/msServices/${serviceName}`, {
      rootPath: 'apiv6',
    }).then((service) => service.officeTenantServiceName);
  }

  retrievingIfPreferencesAllowBannerDisplaying() {
    return this.ovhUserPref
      .getValue('OFFICE_ATTACH')
      .then((officeAttachPreference) => {
        const preferenceExists = has(officeAttachPreference, 'canDisplay');

        return (
          !preferenceExists ||
          (preferenceExists && officeAttachPreference.canDisplay)
        );
      })
      .catch((error) => {
        if (error.status === 404) {
          return true;
        }

        return this.$q.reject(error);
      });
  }

  retrievingIfUserAlreadyHasSubscribed(serviceName) {
    return this.retrievingServiceName(
      serviceName,
    ).then((officeAttachServiceName) => isString(officeAttachServiceName));
  }

  savingHidingPreferences() {
    return this.ovhUserPref.create('OFFICE_ATTACH', { canDisplay: false });
  }
}
