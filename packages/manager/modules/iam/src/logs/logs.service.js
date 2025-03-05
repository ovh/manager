export const URL = {
  LOG: '/engine/api/v2/iam/log/url',
  LOG_KIND: '/engine/api/v2/iam/log/kind',
  LOG_SUSBSCRIPTION: '/engine/api/v2/iam/log/subscription',
};

export default class IAMLogsService {
  /* @ngInject */
  constructor(Apiv2Service) {
    this.Apiv2Service = Apiv2Service;
  }

  getLogKinds() {
    return this.Apiv2Service.httpApiv2({
      url: URL.LOG_KIND,
      method: 'get',
    }).then(({ data }) => data);
  }
}
