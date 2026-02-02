export const name = 'logsIAMPoliciesService';

const URL = '/engine/api/v2/iam/policy';

export default class LogsIAMPoliciesService {
  /* @ngInject */
  constructor(Apiv2Service, iceberg, $q, LogsHelperService) {
    this.Apiv2Service = Apiv2Service;
    this.iceberg = iceberg;
    this.$q = $q;
    this.LogsHelperService = LogsHelperService;
  }

  async fetch({ cursor, serviceName, urn }) {
    const subResourcesURN = await this.fetchIamURNs(serviceName);
    const params = { resourceURN: [...subResourcesURN, urn], readOnly: false };
    return this.Apiv2Service.httpApiv2List({ url: URL, params }, { cursor });
  }

  icebergQueryIamURNs(url) {
    return this.iceberg(url)
      .query()
      .expand('CachedObjectList-Pages')
      .limit(10000)
      .execute()
      .$promise.then(({ data }) => data.map(({ iam }) => iam.urn))
      .catch((err) => {
        this.LogsHelperService.handleError(
          'logs_iam_policies_get_error',
          err.data,
        );
        return [];
      });
  }

  fetchIamURNs(serviceName) {
    const promises = LogsIAMPoliciesService.getSubResourcesURI(
      serviceName,
    ).map((uri) => this.icebergQueryIamURNs(uri));
    return this.$q.all(promises).then((results) => results.flat());
  }

  static getSubResourcesURI(serviceName) {
    return [
      `/dbaas/logs/${serviceName}/output/opensearch/index`,
      `/dbaas/logs/${serviceName}/output/opensearch/alias`,
      `/dbaas/logs/${serviceName}/output/opensearch/osd`,
      `/dbaas/logs/${serviceName}/output/graylog/stream`,
      `/dbaas/logs/${serviceName}/output/graylog/dashboard`,
    ];
  }
}
