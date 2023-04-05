const ENDPOINT = {
  policy: 'policy',
};

export default class PolicyService {
  /* @ngInject */
  constructor(Apiv2Service) {
    this.Apiv2Service = Apiv2Service;
  }

  /**
   * Get the list of policies
   * @param {string} cursor The base64 encoded cursor to pass
   * @see Apiv2Service#getList
   * @returns {Promise}
   */
  getPolicies({ cursor }) {
    return this.Apiv2Service.getList(ENDPOINT.policy, { cursor });
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
