export default class {
  /* @ngInject */
  /**
   * Constructor
   * @param $http
   */
  constructor($http) {
    this.$http = $http;
  }

  /**
   * Get DNS operations (new)
   * @param {object} params
   */
  getDnsOperations(params) {
    return this.$http.get('/me/task/dns', { params }).then(({ data }) => data);
  }

  /**
   * Get operations
   * @param {object} params
   */
  getDomainOperations(params) {
    return this.$http
      .get('/me/task/domain', {
        params,
      })
      .then(({ data }) => data);
  }

  /**
   * Get DNS operation by id
   * @param {string} id
   */
  getDnsOperation(id) {
    return this.$http.get(`/me/task/dns/${id}`).then(({ data }) => data);
  }

  /**
   * Get operation by id
   * @param {string} id
   */
  getDomainOperation(id) {
    return this.$http.get(`/me/task/domain/${id}`).then(({ data }) => data);
  }

  /**
   * Get operation arguments
   * @param {string} id
   */
  getDomainOperationArguments(id) {
    return this.$http
      .get(`/me/task/domain/${id}/argument`)
      .then(({ data }) => data);
  }

  /**
   * Get operation argument by operation id and argument key
   * @param {string} id
   * @param {string} key
   */
  getDomainOperationArgument(id, key) {
    return this.$http
      .get(`/me/task/domain/${id}/argument/${key}`)
      .then(({ data }) => data);
  }

  /**
   * Update operation with options
   * @param {object} opts
   */
  updateOperation(opts) {
    return this.$http
      .put(`/me/task/domain/${opts.id}/argument/${opts.key}`, opts.data)
      .then(({ data }) => data);
  }

  /**
   * Relaunch a domain operation
   * @param {string} id
   */
  relaunchDomainOperation(id) {
    return this.$http
      .post(`/me/task/domain/${id}/relaunch`)
      .then(({ data }) => data);
  }

  /**
   * Relaunch a dns operation
   * @param {string} id
   */
  relaunchDnsOperation(id) {
    return this.$http
      .post(`/me/task/dns/${id}/relaunch`)
      .then(({ data }) => data);
  }

  /**
   * Cancel DNS an operation (new)
   * @param {string} id
   */
  cancelDnsOperation(id) {
    return this.$http
      .post(`/me/task/dns/${id}/cancel`)
      .then(({ data }) => data);
  }

  /**
   * Cancel an operation
   * @param {string} id
   */
  cancelDomainOperation(id) {
    return this.$http
      .post(`/me/task/domain/${id}/cancel`)
      .then(({ data }) => data);
  }

  /**
   * Accelerate a DNS operation (new)
   * @param {string} id
   */
  accelerateDnsOperation(id) {
    return this.$http
      .post(`/me/task/dns/${id}/accelerate`)
      .then(({ data }) => data);
  }

  /**
   * Accelerate an operation
   * @param {string} id
   */
  accelerateDomainOperation(id) {
    return this.$http
      .post(`/me/task/domain/${id}/accelerate`)
      .then(({ data }) => data);
  }

  /**
   * Get operation models
   */
  getDomainOperationModels() {
    return this.$http.get('/me.json').then(({ data }) => data);
  }

  /**
   * Get domain transfer steps
   * @param {string} id
   */
  getProgressBar(id) {
    return this.$http
      .get(`/me/task/domain/${id}/progressbar`)
      .then(({ data }) => data);
  }
}
