export default class UserAccountServicesDoubleAuthSms {
  /* @ngInject */
  constructor($q, OvhHttp, coreConfig) {
    this.$q = $q;
    this.OvhHttp = OvhHttp;
    this.coreConfig = coreConfig;
  }

  /**
   *  Get SMS accounts ids.
   * @return {Promise}
   */
  query() {
    return this.OvhHttp.get('/me/accessRestriction/sms', {
      rootPath: 'apiv6',
    });
  }

  /**
   *  Get SMS account.
   * @param  {Integer} id
   * @return {Promise}
   */
  get(id) {
    return this.OvhHttp.get('/me/accessRestriction/sms/{id}', {
      rootPath: 'apiv6',
      urlParams: {
        id,
      },
    });
  }

  /**
   * Add new SMS account.
   * @param  {String} phone international phone number.
   * @return {Promise}
   */
  post(phone) {
    return this.OvhHttp.post('/me/accessRestriction/sms', {
      rootPath: 'apiv6',
      data: {
        phone,
      },
    });
  }

  /**
   * Edit description from a given SMS account.
   * @param  {Integer} id
   * @param  {String} description
   * @return {Promise}
   */
  edit(id, description) {
    return this.OvhHttp.put('/me/accessRestriction/sms/{id}', {
      rootPath: 'apiv6',
      urlParams: {
        id,
      },
      data: {
        description,
      },
    });
  }

  /**
   * Delete a given SMS account.
   * @param  {Integer} id
   * @return {Promise}
   */
  delete(id) {
    return this.OvhHttp.delete('/me/accessRestriction/sms/{id}', {
      rootPath: 'apiv6',
      urlParams: {
        id,
      },
    });
  }

  /**
   * Disable a given SMS account.
   * @param  {Integer} id
   * @param  {String} code
   * @return {Promise}
   */
  disable(id, code) {
    return this.OvhHttp.post('/me/accessRestriction/sms/{id}/disable', {
      rootPath: 'apiv6',
      urlParams: {
        id,
      },
      data: {
        code,
      },
    });
  }

  /**
   * Enable a given SMS account.
   * @param  {Integer} id
   * @param  {String} code
   * @return {Promise}
   */
  enable(id, code) {
    return this.OvhHttp.post('/me/accessRestriction/sms/{id}/enable', {
      rootPath: 'apiv6',
      urlParams: {
        id,
      },
      data: {
        code,
      },
    });
  }

  /**
   * Send code to a given SMS account.
   * @param  {Integer} id
   * @return {Promise}
   */
  sendCode(id) {
    return this.OvhHttp.post('/me/accessRestriction/sms/{id}/sendCode', {
      rootPath: 'apiv6',
      urlParams: {
        id,
      },
    });
  }

  /**
   * Validate a given SMS account.
   * @param  {Integer} id
   * @param  {String} code
   * @return {Promise}
   */
  validate(id, code) {
    return this.OvhHttp.post('/me/accessRestriction/sms/{id}/validate', {
      rootPath: 'apiv6',
      urlParams: {
        id,
      },
      data: {
        code,
      },
    });
  }

  /**
   * Does double auth SMS is supported.
   * @return {Boolean}
   */
  isSupported() {
    return this.coreConfig.isRegion('EU');
  }
}
