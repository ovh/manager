import every from 'lodash/every';
import get from 'lodash/get';
import isString from 'lodash/isString';

angular.module('services').service(
  'hostingSSLCertificate',
  class HostingSSLCertificate {
    /* @ngInject */
    constructor(
      $rootScope,
      $http,
      hostingSSLCertificateType,
      OvhApiHostingWebSsl,
    ) {
      this.$rootScope = $rootScope;
      this.$http = $http;

      this.hostingSSLCertificateType = hostingSSLCertificateType;
      this.OvhApiHostingWebSsl = OvhApiHostingWebSsl;
    }

    creatingCertificate(serviceName, certificate, key, chain) {
      return this.OvhApiHostingWebSsl.v6().post(
        { serviceName },
        { certificate, key, chain },
      ).$promise;
    }

    retrievingLinkedDomains(serviceName) {
      return this.OvhApiHostingWebSsl.v6().queryDomains({ serviceName })
        .$promise;
    }

    retrievingCertificate(serviceName) {
      this.OvhApiHostingWebSsl.v6().resetAllCache();
      return this.OvhApiHostingWebSsl.v6().get({ serviceName }).$promise;
    }

    retrievingCertificateValidationReport(serviceName) {
      return this.OvhApiHostingWebSsl.v6().getReport({ serviceName }).$promise;
    }

    regeneratingCertificate(serviceName) {
      return this.$http.post(`/hosting/web/${serviceName}/ssl/regenerate`);
    }

    deletingCertificate(serviceName) {
      return this.OvhApiHostingWebSsl.v6().delete({ serviceName }).$promise;
    }

    /**
     * Tests if a variable is a valid certificate
     *
     * @static
     * @param {Certificate} certificate
     * @throws  {TypeError} If the parameter is not a valid certificate
     */
    static testIsCertificate(certificate) {
      const tests = [isString(get(certificate, 'status'))];

      if (!every(tests, (test) => test)) {
        throw new TypeError(
          'certificate parameter is not a valid certificate object',
        );
      }
    }

    /**
     * @static
     * @returns {object}    All the status a certificate can be in
     */
    static getStatuses() {
      return {
        CREATED: {
          canBeHandled: true,
        },
        CREATING: {
          canBeHandled: false,
        },
        DELETING: {
          canBeHandled: false,
        },
        IMPORTING: {
          canBeHandled: false,
        },
        REGENERATING: {
          canBeHandled: false,
        },
      };
    }

    /**
     * Tests if a certificate can be handled/manipulated
     *
     * @static
     * @param   {Certificate}       certificate
     * @returns {boolean}   True if the certificate can be handled/manipulated
     */
    static testCanBeHandled(certificate) {
      HostingSSLCertificate.testIsCertificate(certificate);

      return HostingSSLCertificate.getStatuses()[
        certificate.status.toUpperCase()
      ].canBeHandled;
    }

    /**
     * Asks the controller to reload the status of the certificate to display
     */
    reload() {
      this.$rootScope.$broadcast('hosting.ssl.reload');
    }
  },
);
