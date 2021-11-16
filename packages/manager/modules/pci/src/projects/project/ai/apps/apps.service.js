import App from './App.class';

export default class AppService {
  static buildGetAppUrl(serviceName, appId) {
    return `/cloud/project/${serviceName}/ai/app/${appId}`;
  }

  static getIcebergHeaders() {
    return {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': 50000,
        Pragma: 'no-cache',
      },
    };
  }

  /* @ngInject */
  constructor($http, Poller, OvhApiCloudProjectAi, OvhApiCloudProjectStorage) {
    this.$http = $http;
    this.Poller = Poller;
    this.OvhApiCloudProjectAi = OvhApiCloudProjectAi;
    this.OvhApiCloudProjectStorage = OvhApiCloudProjectStorage;
  }

  pollAppStatus(serviceName, appId) {
    return this.Poller.poll(
      AppService.buildGetAppUrl(serviceName, appId),
      {},
      {
        namespace: `apps_${serviceName}_${appId}`,
        method: 'get',
        successRule: (app) => !new App(app).isPending(),
      },
    );
  }

  stopPollingAppStatus(serviceName, appId) {
    this.Poller.kill({ namespace: `apps_${serviceName}_${appId}` });
  }

  getAppConfigurationCommand(serviceName, appSpecs) {
    return this.$http
      .post(`/cloud/project/${serviceName}/ai/app/command`, appSpecs)
      .then(({ data }) => data.command);
  }

  getApps(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/notebook`,
        AppService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getApp(serviceName, appId) {
    return this.$http
      .get(AppService.buildGetAppUrl(serviceName, appId))
      .then(({ data }) => data);
  }

  addApp(serviceName, app) {
    return this.$http
      .post(`/cloud/project/${serviceName}/ai/app`, app)
      .then(({ data }) => data);
  }

  updateApp(serviceName, appId, app) {
    return this.$http
      .put(`/cloud/project/${serviceName}/ai/app/${appId}`, app)
      .then(({ data }) => data);
  }

  removeApp(serviceName, appId) {
    return this.$http
      .delete(`/cloud/project/${serviceName}/ai/app/${appId}`)
      .then(({ data }) => data);
  }

  startApp(serviceName, appId) {
    return this.$http
      .put(`/cloud/project/${serviceName}/ai/app/${appId}/start`)
      .then(({ data }) => data);
  }

  stopApp(serviceName, appId) {
    return this.$http
      .put(`/cloud/project/${serviceName}/ai/app/${appId}/stop`)
      .then(({ data }) => data);
  }

  getAppLogs(serviceName, appId) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/app/${appId}/log`,
        AppService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getEditors(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/app/capabilities/editor`,
        AppService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getFrameworks(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/app/capabilities/framework`,
        AppService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getRegions(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/capabilities/region`,
        AppService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getFlavors(serviceName, region) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/capabilities/region/${region}/flavor`,
        AppService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getStorages(serviceName, archive = false, withObjects = false) {
    return this.OvhApiCloudProjectStorage.Aapi().query({
      serviceName,
      archive,
      withObjects,
    }).$promise;
  }

  isAuthorized(serviceName) {
    return this.OvhApiCloudProjectAi.Training()
      .Authorization()
      .v6()
      .get({
        serviceName,
      })
      .$promise.then((authorization) => authorization.authorized);
  }

  authorized(serviceName) {
    return this.$http
      .post(`/cloud/project/${serviceName}/ai/authorization`)
      .then(({ data }) => data);
  }
}
