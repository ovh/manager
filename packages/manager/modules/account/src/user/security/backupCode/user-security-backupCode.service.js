export default /* @ngInject */ function UserAccountDoubleAuthBackupCodeService(
  OvhHttp,
) {
  /**
   * Get backupCode detail.
   * @return {Promise}
   */
  this.get = () =>
    OvhHttp.get('/me/accessRestriction/backupCode', {
      rootPath: 'apiv6',
      returnErrorKey: '',
    });

  /**
   * Delete backupCode.
   * @return {Promise}
   */
  this.delete = () =>
    OvhHttp.delete('/me/accessRestriction/backupCode', {
      rootPath: 'apiv6',
    });

  /**
   * Generate new backupCode.
   * @return {Promise}
   */
  this.post = () =>
    OvhHttp.post('/me/accessRestriction/backupCode', {
      rootPath: 'apiv6',
    });

  /**
   * Enable a new backupCode list.
   * @param  {String} code
   * @return {Promise}
   */
  this.enable = (code) =>
    OvhHttp.post('/me/accessRestriction/backupCode/enable', {
      rootPath: 'apiv6',
      data: {
        code,
      },
    });

  /**
   * Validate a new backupCode list.
   * @param  {String} code
   * @return {Promise}
   */
  this.validate = (code) =>
    OvhHttp.post('/me/accessRestriction/backupCode/validate', {
      rootPath: 'apiv6',
      data: {
        code,
      },
    });

  /**
   * Disable a given backupCode list.
   * @param  {String} code
   * @return {Promise}
   */
  this.disable = (code) =>
    OvhHttp.post('/me/accessRestriction/backupCode/disable', {
      rootPath: 'apiv6',
      data: {
        code,
      },
    });
}
