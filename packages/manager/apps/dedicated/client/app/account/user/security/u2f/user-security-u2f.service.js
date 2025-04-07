import get from 'lodash/get';
import { map } from 'lodash';
import { WEBAUTHN_URL } from './user-security-u2f.constants';

export default /* @ngInject */ function UserAccountDoubleAuthU2fService(
  OvhHttp,
  $q,
  coreConfig,
) {
  /**
   * Register helper.
   * @param  {Object} data
   * @return {Promise}
   */
  const register = (data) => {
    const url = new URL(
      WEBAUTHN_URL[coreConfig.getRegion()] || WEBAUTHN_URL.EU,
    );
    map(data, (value, key) => {
      url.searchParams.set(key, value);
    });

    const registerDefer = $q.defer();
    const onMessage = (event) => {
      if (event.origin !== url.origin) return;

      if (event.data.error) {
        registerDefer.reject({ error: event.data.error });
      } else {
        registerDefer.resolve({
          rawId: Buffer.from(event.data.id).toString('base64'),
          clientDataJSON: Buffer.from(event.data.clientDataJSON).toString(
            'base64',
          ),
          attestationObject: Buffer.from(event.data.attestationObject).toString(
            'base64',
          ),
        });
      }
      window.removeEventListener('message', onMessage);
    };

    // Install listener
    window.addEventListener('message', onMessage);

    // Open popup
    window.open(
      url.toString(),
      'WebAuthn',
      `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=600,height=600`,
    );

    return registerDefer.promise;
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
          response.attestationObject,
          response.clientDataJSON,
          response.rawId,
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
   * Disable a given U2F account.
   * @param  {Integer} id
   * @return {Promise}
   */
  this.disable = (id) =>
    OvhHttp.post('/me/accessRestriction/u2f/{id}/disable', {
      rootPath: 'apiv6',
      urlParams: {
        id,
      },
    });

  /**
   * Enable a given U2F account.
   * @param  {Integer} id
   * @return {Promise}
   */
  this.enable = (id) =>
    OvhHttp.post('/me/accessRestriction/u2f/{id}/enable', {
      rootPath: 'apiv6',
      urlParams: {
        id,
      },
    });

  /**
   * Validate a given U2F account.
   * @param  {Integer} id
   * @param  {String} attestationObject
   * @param  {String} clientDataJSON
   * @param  {String} rawId
   * @return {Promise}
   */
  this.validate = (id, attestationObject, clientDataJSON, rawId) =>
    OvhHttp.post('/me/accessRestriction/u2f/{id}/validate', {
      rootPath: 'apiv6',
      urlParams: {
        id,
      },
      data: {
        attestationObject,
        clientDataJSON,
        rawId,
      },
    });
}
