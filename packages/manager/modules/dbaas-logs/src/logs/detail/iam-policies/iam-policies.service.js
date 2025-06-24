export const name = 'logsIAMPoliciesService';

const URL = '/engine/api/v2/iam/policy';

export default class LogsIAMPoliciesService {
  /* @ngInject */
  constructor(Apiv2Service) {
    this.Apiv2Service = Apiv2Service;
  }

  fetch({ cursor, resourceURN }) {
    const params = { resourceURN, readOnly: false };
    return this.Apiv2Service.httpApiv2List({ url: URL, params }, { cursor });
  }
}
