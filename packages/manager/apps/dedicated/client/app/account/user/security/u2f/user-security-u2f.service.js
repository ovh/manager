import get from 'lodash/get';

export default /* @ngInject */ function UserAccountDoubleAuthU2fService(
  $q,
  $window,
  OvhHttp,
) {
  const TIMEOUT_SECONDS = 15;

  /**
   * Register helper.
   * @param  {Object} data
   * @return {Promise}
   */
  const register = (data) => {
    const registerDefer = $q.defer();
    $window.u2f.register(
      data.applicationId,
      [
        {
          challenge: data.request.challenge,
          version: data.request.version,
        },
      ],
      [],
      (response) => {
        if (response.errorCode) {
          registerDefer.reject({ response });
        } else {
          registerDefer.resolve(response);
        }
      },
      TIMEOUT_SECONDS,
    );
    return registerDefer.promise;
  };

  /**
   * Sign helper.
   * @param  {Object} data
   * @return {Promise}
   */
  const sign = (data) => {
    const signDefer = $q.defer();
    $window.u2f.sign(
      data.applicationId,
      data.request.challenge,
      [
        {
          version: data.request.version,
          keyHandle: data.request.keyHandle,
        },
      ],
      (request) => {
        if (request.errorCode) {
          signDefer.reject({ request });
        } else {
          signDefer.resolve(request);
        }
      },
      TIMEOUT_SECONDS,
    );
    return signDefer.promise;
  };

  /**
   *  Get U2F accounts ids.
   * @return {Promise}
   */
  this.query = () =>
    OvhHttp.get('/me/accessRestriction/u2f', {
      rootPath: 'apiv6',
    });

  /**
   *  Get U2F account.
   * @param  {Integer} id
   * @return {Promise}
   */
  this.get = (id) =>
    OvhHttp.get('/me/accessRestriction/u2f/{id}', {
      rootPath: 'apiv6',
      urlParams: {
        id,
      },
    });

  /**
   * Add new U2F account.
   * - We use the `register` helper and then we validate the U2F account.
   * @return {Promise}
   */
  this.post = () =>
    OvhHttp.post('/me/accessRestriction/u2f', {
      rootPath: 'apiv6',
    }).then((registerChallenge) =>
      register(registerChallenge).then((response) => {
        const u2fId = get(registerChallenge, 'id');
        return this.validate(
          u2fId,
          response.clientData,
          response.registrationData,
        )
          .then(() => this.get(u2fId))
          .then((key) => ({
            u2fId,
            response,
            key,
          }));
      }),
    );

  /**
   * Edit description from a given U2F account.
   * @param  {Integer} id
   * @param  {String} description
   * @return {Promise}
   */
  this.edit = (id, description) =>
    OvhHttp.put('/me/accessRestriction/u2f/{id}', {
      rootPath: 'apiv6',
      urlParams: {
        id,
      },
      data: {
        description,
      },
    });

  /**
   * Delete a given U2F account.
   * @param  {Integer} id
   * @return {Promise}
   */
  this.delete = (id) =>
    OvhHttp.delete('/me/accessRestriction/u2f/{id}', {
      rootPath: 'apiv6',
      urlParams: {
        id,
      },
    });

  /**
   * Challenge.
   * - We use the `sign` helper and then we disable/enable the U2F account.
   * @param  {Integer} id
   * @param  {String} action
   * @return {Promise}
   */
  this.challenge = (id, action) =>
    OvhHttp.post('/me/accessRestriction/u2f/{id}/challenge', {
      rootPath: 'apiv6',
      urlParams: {
        id,
      },
    }).then((signChallenge) =>
      sign(signChallenge).then((request) => {
        if (action === 'enabled') {
          return this.disable(id, request.clientData, request.signatureData);
        }
        return this.enable(id, request.clientData, request.signatureData);
      }),
    );

  /**
   * Disable a given U2F account.
   * @param  {Integer} id
   * @param  {String} clientData
   * @param  {String} signatureData
   * @return {Promise}
   */
  this.disable = (id, clientData, signatureData) =>
    OvhHttp.post('/me/accessRestriction/u2f/{id}/disable', {
      rootPath: 'apiv6',
      urlParams: {
        id,
      },
      data: {
        clientData,
        signatureData,
      },
    });

  /**
   * Enable a given U2F account.
   * @param  {Integer} id
   * @param  {String} clientData
   * @param  {String} signatureData
   * @return {Promise}
   */
  this.enable = (id, clientData, signatureData) =>
    OvhHttp.post('/me/accessRestriction/u2f/{id}/enable', {
      rootPath: 'apiv6',
      urlParams: {
        id,
      },
      data: {
        clientData,
        signatureData,
      },
    });

  /**
   * Validate a given U2F account.
   * @param  {Integer} id
   * @param  {String} clientData
   * @param  {String} registrationData
   * @return {Promise}
   */
  this.validate = (id, clientData, registrationData) =>
    OvhHttp.post('/me/accessRestriction/u2f/{id}/validate', {
      rootPath: 'apiv6',
      urlParams: {
        id,
      },
      data: {
        clientData,
        registrationData,
      },
    });
}
