angular.module('Module.exchange.services').service(
  'officeAttach',
  class OfficeAttach {
    constructor(Exchange, OvhHttp, ovhUserPref, $q, constants) {
      this.Exchange = Exchange;
      this.OvhHttp = OvhHttp;
      this.ovhUserPref = ovhUserPref;
      this.$q = $q;
      this.constants = constants;
    }

    retrievingServiceName(serviceName) {
      if (this.constants.target !== 'EU') {
        return this.$q.when(null);
      }

      return this.OvhHttp.get(`/msServices/${serviceName}`, { rootPath: 'apiv6' }).then(
        service => service.officeTenantServiceName,
      );
    }

    retrievingIfPreferencesAllowBannerDisplaying() {
      return this.ovhUserPref
        .getValue('OFFICE_ATTACH')
        .then((officeAttachPreference) => {
          const preferenceExists = _.has(officeAttachPreference, 'canDisplay');

          return !preferenceExists || (preferenceExists && officeAttachPreference.canDisplay);
        })
        .catch((error) => {
          if (error.status === 404) {
            return true;
          }

          return this.$q.reject(error);
        });
    }

    retrievingIfUserAlreadyHasSubscribed(serviceName) {
      return this.retrievingServiceName(serviceName)
        .then(officeAttachServiceName => _(officeAttachServiceName).isString());
    }

    savingHidingPreferences() {
      return this.ovhUserPref.create('OFFICE_ATTACH', { canDisplay: false });
    }
  },
);
