angular.module('App').service(
  'HostingAutomatedEmails',
  class HostingAutomatedEmails {
    /* @ngInject */
    constructor(constants, $q, OvhHttp, $http) {
      this.constants = constants;
      this.$q = $q;
      this.OvhHttp = OvhHttp;
      this.$http = $http;

      this.cache = {
        email: 'UNIVERS_WEB_AUTOMATED_EMAILS',
      };
    }

    getAutomatedEmails(serviceName) {
      return this.OvhHttp.get('/hosting/web/{serviceName}/email', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
      });
    }

    putEmail(serviceName, email) {
      return this.OvhHttp.put('/hosting/web/{serviceName}/email', {
        rootPath: 'apiv6',
        clearAllCache: this.cache.email,
        urlParams: {
          serviceName,
        },
        data: {
          email,
        },
        broadcast: 'hosting.automatedEmails.request.changed',
      });
    }

    postRequest(serviceName, action) {
      return this.OvhHttp.post('/hosting/web/{serviceName}/email/request', {
        rootPath: 'apiv6',
        clearAllCache: this.cache.email,
        urlParams: {
          serviceName,
        },
        data: {
          action,
        },
        broadcast: 'hosting.automatedEmails.request.changed',
      });
    }

    retrievingBounces(serviceName, limit) {
      return this.$http.get(`/hosting/web/${serviceName}/email/bounces`, {
        params: {
          limit,
        },
      });
    }
  },
);
