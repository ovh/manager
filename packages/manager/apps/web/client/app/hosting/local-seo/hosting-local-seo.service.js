angular.module('services').service(
  'HostingLocalSeo',
  class HostingLocalSeo {
    /* @ngInject */
    constructor($window, OvhHttp, WucUser) {
      this.$window = $window;
      this.OvhHttp = OvhHttp;
      this.WucUser = WucUser;
    }

    getAccounts(serviceName) {
      return this.OvhHttp.get(`/hosting/web/${serviceName}/localSeo/account`, {
        rootPath: 'apiv6',
      });
    }

    getAccount(serviceName, accountId) {
      return this.OvhHttp.get(
        `/hosting/web/${serviceName}/localSeo/account/${accountId}`,
        {
          rootPath: 'apiv6',
        },
      );
    }

    login(serviceName, accountId) {
      return this.OvhHttp.post(
        `/hosting/web/${serviceName}/localSeo/account/${accountId}/login`,
        {
          rootPath: 'apiv6',
        },
      );
    }

    getLocations(serviceName) {
      return this.OvhHttp.get(`/hosting/web/${serviceName}/localSeo/location`, {
        rootPath: 'apiv6',
      });
    }

    getLocation(serviceName, locationId) {
      return this.OvhHttp.get(
        `/hosting/web/${serviceName}/localSeo/location/${locationId}`,
        {
          rootPath: 'apiv6',
        },
      );
    }

    deleteLocation(serviceName, locationId) {
      return this.OvhHttp.post(
        `/hosting/web/${serviceName}/localSeo/location/${locationId}/terminate`,
        { rootPath: 'apiv6' },
      );
    }

    goToLocalSeoOrder(serviceName) {
      const win = this.$window.open('', '_blank');
      win.opener = null;
      return this.WucUser.getUrlOfEndsWithSubsidiary(
        'localseo_order_options_service',
      ).then((url) => {
        win.location = url.replace('{serviceName}', serviceName);
      });
    }

    goToVisibilityChecker() {
      const win = this.$window.open('', '_blank');
      win.opener = null;
      return this.getVisibilityCheckerURL().then((url) => {
        win.location = url;
      });
    }

    getVisibilityCheckerURL() {
      return this.WucUser.getUrlOfEndsWithSubsidiary(
        'localseo_visibility_checker',
      );
    }
  },
);
