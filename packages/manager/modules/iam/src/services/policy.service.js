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
}
