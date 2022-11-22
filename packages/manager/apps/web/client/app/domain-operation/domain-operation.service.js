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
     * Get operations
     * @param {object} params
     */
    getOperations(params) {
      return this.OvhHttp.get('/me/task/domain', {
        rootPath: 'apiv6',
        params,
      });
    }

    /**
     * Get operation by id
     * @param {string} id
     */
    getOperation(id) {
      return this.OvhHttp.get(`/me/task/domain/${id}`, {
        rootPath: 'apiv6',
      });
    }

    /**
     * Get operation arguments
     * @param {string} id
     */
    getOperationArguments(id) {
      return this.OvhHttp.get(`/me/task/domain/${id}/argument`, {
        rootPath: 'apiv6',
      });
    }

    /**
     * Get operation argument by operation id and argument key
     * @param {string} id
     * @param {string} key
     */
    getOperationArgument(id, key) {
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
     * Relaunch an operation
     * @param {string} id
     */
    relaunchOperation(id) {
      return this.OvhHttp.post(`/me/task/domain/${id}/relaunch`, {
        rootPath: 'apiv6',
        broadcast: 'domains.operations.relaunched',
      });
    }

    /**
     * Cancel an operation
     * @param {string} id
     */
    cancelOperation(id) {
      return this.OvhHttp.post(`/me/task/domain/${id}/cancel`, {
        rootPath: 'apiv6',
        broadcast: 'domains.operations.cancelled',
      });
    }

    /**
     * Accelerate an operation
     * @param {string} id
     */
    accelerateOperation(id) {
      return this.OvhHttp.post(`/me/task/domain/${id}/accelerate`, {
        rootPath: 'apiv6',
        broadcast: 'domains.operations.accelerated',
      });
    }

    /**
     * Get operation models
     */
    getOperationModels() {
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
