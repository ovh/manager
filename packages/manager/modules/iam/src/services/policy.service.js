const ENDPOINT = {
  policy: 'policy',
};

export default class PolicyService {
  /* @ngInject */
  constructor(APIV2Service) {
    this.APIV2Service = APIV2Service;
  }

  /**
   * Get the list of policies
   * @param {string} cursor The base64 encoded cursor to pass
   * @see APIV2Service#getList
   * @returns {Promise}
   */
  getPolicies({ cursor }) {
    return this.APIV2Service.getList(ENDPOINT.policy, { cursor });
  }
}
