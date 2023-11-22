angular.module('services').service(
  'domainOperationService',
  class domainOperationService {
    /**
     * Constructor
     * @param OvhHttp
     */
    constructor(OvhHttp) {
      this.OvhHttp = OvhHttp;
    }

    /**
     * Get DNS operations (new)
     * @param {object} params
     */
    getDnsOperations(params) {
      return this.OvhHttp.get('/me/task/dns', {
        rootPath: 'apiv6',
        params,
      });
    }

    /**
     * Get operations
     * @param {object} params
     */
    getDomainOperations(params) {
      return this.OvhHttp.get('/me/task/domain', {
        rootPath: 'apiv6',
        params,
      });
    }

    /**
     * Get DNS operation by id
     * @param {string} id
     */
    getDnsOperation(id) {
      return this.OvhHttp.get(`/me/task/dns/${id}`, {
        rootPath: 'apiv6',
      });
    }

    /**
     * Get operation by id
     * @param {string} id
     */
    getDomainOperation(id) {
      return this.OvhHttp.get(`/me/task/domain/${id}`, {
        rootPath: 'apiv6',
      });
    }

    /**
     * Get operation arguments
     * @param {string} id
     */
    getDomainOperationArguments(id) {
      return this.OvhHttp.get(`/me/task/domain/${id}/argument`, {
        rootPath: 'apiv6',
      });
    }

    /**
     * Get operation argument by operation id and argument key
     * @param {string} id
     * @param {string} key
     */
    getDomainOperationArgument(id, key) {
      return this.OvhHttp.get(`/me/task/domain/${id}/argument/${key}`, {
        rootPath: 'apiv6',
      });
    }

    /**
     * Update operation with options
     * @param {object} opts
     */
    updateOperation(opts) {
      return this.OvhHttp.put(
        `/me/task/domain/${opts.id}/argument/${opts.key}`,
        {
          rootPath: 'apiv6',
          data: opts.data,
        },
      );
    }

    /**
     * Relaunch a domain operation
     * @param {string} id
     */
    relaunchDomainOperation(id) {
      return this.OvhHttp.post(`/me/task/domain/${id}/relaunch`, {
        rootPath: 'apiv6',
        broadcast: 'domains.operations.relaunched',
      });
    }

    /**
     * Relaunch a dns operation
     * @param {string} id
     */
    relaunchDnsOperation(id) {
      return this.OvhHttp.post(`/me/task/dns/${id}/relaunch`, {
        rootPath: 'apiv6',
        broadcast: 'domains.operations.relaunched',
      });
    }

    /**
     * Cancel DNS an operation (new)
     * @param {string} id
     */
    cancelDnsOperation(id) {
      return this.OvhHttp.post(`/me/task/dns/${id}/cancel`, {
        rootPath: 'apiv6',
        broadcast: 'domains.operations.cancelled',
      });
    }

    /**
     * Cancel an operation
     * @param {string} id
     */
    cancelDomainOperation(id) {
      return this.OvhHttp.post(`/me/task/domain/${id}/cancel`, {
        rootPath: 'apiv6',
        broadcast: 'domains.operations.cancelled',
      });
    }

    /**
     * Accelerate a DNS operation (new)
     * @param {string} id
     */
    accelerateDnsOperation(id) {
      return this.OvhHttp.post(`/me/task/dns/${id}/accelerate`, {
        rootPath: 'apiv6',
        broadcast: 'domains.operations.accelerated',
      });
    }

    /**
     * Accelerate an operation
     * @param {string} id
     */
    accelerateDomainOperation(id) {
      return this.OvhHttp.post(`/me/task/domain/${id}/accelerate`, {
        rootPath: 'apiv6',
        broadcast: 'domains.operations.accelerated',
      });
    }

    /**
     * Get operation models
     */
    getDomainOperationModels() {
      return this.OvhHttp.get('/me.json', {
        rootPath: 'apiv6',
      });
    }

    /**
     * Get domain transfer steps
     * @param {string} id
     */
    getProgressBar(id) {
      return this.OvhHttp.get(`/me/task/domain/${id}/progressbar`, {
        rootPath: 'apiv6',
      });
    }
  },
);
