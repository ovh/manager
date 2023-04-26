const ENDPOINT = {
  policy: 'policy',
};

export default class PolicyService {
  /* @ngInject */
  constructor($q, Apiv2Service, ReferenceService) {
    this.$q = $q;
    this.Apiv2Service = Apiv2Service;
    this.ReferenceService = ReferenceService;
  }

  /**
   * Get the list of policies
   * @param {string} cursor The base64 encoded cursor to pass
   * @param {boolean} readOnly
   * @see Apiv2Service#getList
   * @returns {Promise}
   */
  getPolicies({ cursor, readOnly }) {
    return this.Apiv2Service.getList(ENDPOINT.policy, {
      ...(typeof readOnly !== 'undefined' && {
        options: { params: { readOnly } },
      }),
      cursor,
    });
  }

  /**
   * Get the policy given the id
   * @param {string} id The policy's id
   * @returns {Promise}
   */
  getPolicy(id) {
    return this.Apiv2Service.get(`${ENDPOINT.policy}/${id}`).then(
      ({ data: policy }) => policy,
    );
  }

  /**
   * Get the policy given the id populated with more data
   * @param {string} id The policy's id
   * @returns {Promise}
   */
  getDetailedPolicy(id) {
    return this.$q
      .all({
        actions: this.ReferenceService.getActions(),
        policy: this.Apiv2Service.get(`${ENDPOINT.policy}/${id}`, {
          params: { details: true },
        }).then(({ data: policy }) => policy),
      })
      .then(({ actions, policy }) => {
        Object.assign(policy.permissions, {
          allow: policy.permissions.allow.map(
            (allow) =>
              actions.find((action) => action.action === allow.action) ?? allow,
          ),
        });
        return policy;
      });
  }

  /**
   * Create a new policy
   * @param {{
   *   identities: string[]
   *   name: string
   *   permissions: {
   *     allow: { action: string }[]
   *     except: { action: string }[]
   *   }
   *   resources: { urn: string }[]
   * }} data The policy's data
   * @returns {Promise}
   */
  createPolicy(data) {
    return this.Apiv2Service.post(ENDPOINT.policy, { data }).then(
      ({ data: policy }) => policy,
    );
  }

  /**
   * Delete the policy given the id
   * @param {string} id The policy's id
   * @returns {Promise}
   */
  deletePolicy(id) {
    return this.Apiv2Service.delete(`${ENDPOINT.policy}/${id}`).then(
      ({ data }) => data,
    );
  }

  /**
   * Edit a policy
   * @param {string} id The policy's id
   * @param {{
   *   identities: string[]
   *   name: string
   *   permissions: {
   *     allow: { action: string }[]
   *     except: { action: string }[]
   *   }
   *   resources: { urn: string }[]
   * }} data The policy's data
   * @see Apiv2Service#put
   * @returns {Promise}
   */
  editPolicy(id, data) {
    return this.Apiv2Service.put(`${ENDPOINT.policy}/${id}`, { data }).then(
      ({ data: policy }) => policy,
    );
  }

  /**
   * Put the policy given the id
   * @param {string} id The policy's id
   * @see Apiv2Service#put
   * @returns {Promise}
   */
  editIdentities(id, identities) {
    return this.getPolicy(id)
      .then((policy) => {
        const { name, resources, permissions } = policy;
        return this.Apiv2Service.put(`${ENDPOINT.policy}/${id}`, {
          data: { name, resources, permissions, identities },
        });
      })
      .then(({ data }) => data);
  }
}
