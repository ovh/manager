import { AI_ROLES_NAMES } from './ai-dashboard.constants';

export default class AiDashboardService {
  /* @ngInject */
  constructor($http, $q, $translate, iceberg, CucPriceHelper, Poller) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.iceberg = iceberg;
    this.CucPriceHelper = CucPriceHelper;
    this.Poller = Poller;
  }

  static getIcebergHeaders() {
    return {
      headers: {
        Pragma: 'no-cache',
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': 50000,
      },
    };
  }

  getAIAuthorization(serviceName) {
    return this.$http
      .get(`/cloud/project/${serviceName}/ai/authorization`)
      .then(({ data }) => data.authorized);
  }

  // AI items
  getAINotebooks(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/notebook`,
        AiDashboardService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getAITrainings(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/job`,
        AiDashboardService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getAIApps(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/app`,
        AiDashboardService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getAIItems(projectId) {
    return this.$q.all({
      notebooks: this.getAINotebooks(projectId),
      trainings: this.getAITrainings(projectId),
      apps: this.getAIApps(projectId),
    });
  }

  // Roles
  getAIRoles(projectId) {
    return this.$http
      .get(`/cloud/project/${projectId}/role`)
      .then(({ data }) =>
        data.roles.filter((role) => AI_ROLES_NAMES.includes(role.name)),
      );
  }

  // Users
  getAIUsers(projectId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/user`,
        AiDashboardService.getIcebergHeaders(),
      )
      .then(({ data }) =>
        data.filter(
          (user) =>
            user.roles.filter((role) => AI_ROLES_NAMES.includes(role.name))
              .length > 0,
        ),
      );
  }

  addUser(projectId, user) {
    return this.$http
      .post(`/cloud/project/${projectId}/user`, user)
      .then(({ data }) => data);
  }

  // Tokens
  getAITokens(projectId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/ai/token`,
        AiDashboardService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  addToken(projectId, token) {
    return this.$http
      .post(`/cloud/project/${projectId}/ai/token`, token)
      .then(({ data }) => data);
  }

  deleteToken(projectId, tokenId) {
    return this.$http
      .delete(`/cloud/project/${projectId}/ai/token/${tokenId}`)
      .then(({ data }) => data);
  }

  renewToken(projectId, tokenId) {
    return this.$http
      .post(`/cloud/project/${projectId}/ai/token/${tokenId}/renew`)
      .then(({ data }) => data);
  }

  // Billing
  getBilling(projectId) {
    return this.$http
      .get(`/cloud/project/${projectId}/usage/current`)
      .then(({ data }) => data);
  }

  // Regions
  getRegions(projectId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/ai/capabilities/region`,
        AiDashboardService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  // Guides
  getGuides(projectId, lang, section) {
    const queryParams = [];
    if (lang) queryParams.push(`lang=${lang}`);
    if (section) queryParams.push(`section=${section}`);
    const queryString =
      queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    return this.$http
      .get(
        `/cloud/project/${projectId}/ai/guides${queryString}`,
        AiDashboardService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getRegistry(projectId, registryId) {
    return this.$http
      .get(`/cloud/project/${projectId}/ai/registry/${registryId}`)
      .then(({ data }) => data);
  }

  getAllRegistry(projectId) {
    return this.$http
      .get(`/cloud/project/${projectId}/ai/registry`)
      .then(({ data }) => data);
  }

  deleteRegistry(projectId, registryId) {
    return this.$http
      .delete(`/cloud/project/${projectId}/ai/registry/${registryId}`)
      .then(({ data }) => data);
  }

  addRegistry(projectId, registry) {
    return this.$http
      .post(`/cloud/project/${projectId}/ai/registry`, registry)
      .then(({ data }) => data);
  }
}
