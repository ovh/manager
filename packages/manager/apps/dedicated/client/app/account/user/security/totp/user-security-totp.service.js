export default /* @ngInject */ function UserAccountDoubleAuthTotpService(
  OvhHttp,
) {
  /**
   * Get TOTP accounts ids.
   * @return {Promise}
   */
  this.query = () =>
    OvhHttp.get('/me/accessRestriction/totp', {
      rootPath: 'apiv6',
    });

  /**
   * Get TOTP account.
   * @param  {String} id
   * @return {Promise}
   */
  this.get = (id) =>
    OvhHttp.get('/me/accessRestriction/totp/{id}', {
      rootPath: 'apiv6',
      urlParams: {
        id,
      },
    });

  /**
   * Add new TOTP account.
   * @return {Promise}
   */
  this.post = () =>
    OvhHttp.post('/me/accessRestriction/totp', {
      rootPath: 'apiv6',
    });

  /**
   * Edit description from a given TOTP account.
   * @param  {Integer} id
   * @param  {String} description
   * @return {Promise}
   */
  this.edit = (id, description) =>
    OvhHttp.put('/me/accessRestriction/totp/{id}', {
      rootPath: 'apiv6',
      urlParams: {
        id,
      },
      data: {
        description,
      },
    });

  /**
   * Delete a given TOTP account.
   * @param  {Integer} id
   * @return {Promise}
   */
  this.delete = (id) =>
    OvhHttp.delete('/me/accessRestriction/totp/{id}', {
      rootPath: 'apiv6',
      urlParams: {
        id,
      },
    });

  /**
   * Disable a given TOTP account.
   * @param  {Integer} id
   * @param  {String} code
   * @return {Promise}
   */
  this.disable = (id, code) =>
    OvhHttp.post('/me/accessRestriction/totp/{id}/disable', {
      rootPath: 'apiv6',
      urlParams: {
        id,
      },
      data: {
        code,
      },
    });

  /**
   * Enable a given TOTP account.
   * @param  {Integer} id
   * @param  {String} code
   * @return {Promise}
   */
  this.enable = (id, code) =>
    OvhHttp.post('/me/accessRestriction/totp/{id}/enable', {
      rootPath: 'apiv6',
      urlParams: {
        id,
      },
      data: {
        code,
      },
    });

  /**
   * Validate a given TOTP account.
   * @param  {Integer} id
   * @param  {String} code
   * @return {Promise}
   */
  this.validate = (id, code) =>
    OvhHttp.post('/me/accessRestriction/totp/{id}/validate', {
      rootPath: 'apiv6',
      urlParams: {
        id,
      },
      data: {
        code,
      },
    });
}
