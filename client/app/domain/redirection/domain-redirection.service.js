angular.module('services').service(
  'DomainRedirection',
  class DomainRedirection {
    /**
     * @constructs DomainRedirection
     * @param {Object} $stateParams
     * @param {Object} Domain
     * @param {Object} OvhHttp
     */
    constructor($stateParams, Domain, OvhHttp) {
      this.productId = $stateParams.productId;
      this.OvhHttp = OvhHttp;
      this.Domain = Domain;
    }

    /**
     * Put verb only for ORT redirects (redirection from an OVH domain to another OVH domain)
     * @param {Number} redirectId
     * @param {Object} data
     * @param {Object} data.target - Target of the redirection
     * @param {Object} data.description
     * @param {Object} data.keywords
     * @param {Object} data.title
     */
    putOrt(redirectId, data) {
      return this.OvhHttp.put(
        `/domain/zone/${this.productId}/redirection/${redirectId}`,
        {
          rootPath: 'apiv6',
          data,
        },
      ).then(() => this.Domain.refreshZoneState);
    }

    /**
     * Put verb for non ORT redirects (redirection from an OVH domain to another OVH domain)
     * @param {Number} redirectId
     * @param {Object} data
     * @param {Object} data.target - Target of the redirection
     */
    put(redirectId, data) {
      return this.OvhHttp.put(
        `/domain/zone/${this.productId}/record/${redirectId}`,
        {
          rootPath: 'apiv6',
          data,
        },
      ).then(() => this.Domain.refreshZoneState);
    }
  },
);
