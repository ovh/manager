import { AI_ROLES_NAMES } from './ai-dashboard.constants';

export default class AIDashboardService {
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

  // AI items
  getAINotebooks(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/notebook`,
        AIDashboardService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getAITrainings(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/job`,
        AIDashboardService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getAIApps(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/app`,
        AIDashboardService.getIcebergHeaders(),
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
      .get(
        `/cloud/project/${projectId}/role`,
        AIDashboardService.getIcebergHeaders(),
      )
      .then(({ data }) =>
        data[0].filter((role) => AI_ROLES_NAMES.includes(role.name)),
      );
  }

  // Users
  getAIUsers(projectId) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/user`,
        AIDashboardService.getIcebergHeaders(),
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
        AIDashboardService.getIcebergHeaders(),
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
        AIDashboardService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  // Guides
  getGuides(projectId, lang, section) {
    let queryParams = [];
    queryParams.push(lang ? `lang=${lang}` : '');
    queryParams.push(section ? `section=${section}` : '');
    queryParams = queryParams.filter((queryParam) => queryParam.length > 0);
    const queryString =
      queryParams.length > 0
        ? `?${queryParams.filter((l) => l.length > 0).join('&')}`
        : '';
    return this.$http
      .get(
        `/cloud/project/${projectId}/ai/guides${queryString}`,
        AIDashboardService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }
}
