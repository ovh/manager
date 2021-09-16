import Notebook from './quantum-computing.routing';

export default class QuantumService {
  static buildGetNotebookUrl(serviceName, notebookId) {
    return `/cloud/project/${serviceName}/ai/notebook/${notebookId}`;
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

  pollNotebookStatus(serviceName, notebookId) {
    return this.Poller.poll(
      QuantumService.buildGetNotebookUrl(serviceName, notebookId),
      {},
      {
        namespace: `notebooks_${serviceName}_${notebookId}`,
        method: 'get',
        successRule: (notebook) => !new Notebook(notebook).isPending(),
      },
    );
  }

  stopPollingNotebookStatus(serviceName, notebookId) {
    this.Poller.kill({ namespace: `notebooks_${serviceName}_${notebookId}` });
  }

  getNotebookConfigurationCommand(serviceName, notebookSpecs) {
    return this.$http
      .post(`/cloud/project/${serviceName}/ai/notebook/command`, notebookSpecs)
      .then(({ data }) => data.command);
  }

  getQuantumComputing(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/notebook`,
        QuantumService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getNotebook(serviceName, notebookId) {
    return this.$http
      .get(QuantumService.buildGetNotebookUrl(serviceName, notebookId))
      .then(({ data }) => data);
  }

  addNotebook(serviceName, notebook) {
    return this.$http
      .post(`/cloud/project/${serviceName}/ai/notebook`, notebook)
      .then(({ data }) => data);
  }

  updateNotebook(serviceName, notebookId, notebook) {
    return this.$http
      .put(`/cloud/project/${serviceName}/ai/notebook/${notebookId}`, notebook)
      .then(({ data }) => data);
  }

  removeNotebook(serviceName, notebookId) {
    return this.$http
      .delete(`/cloud/project/${serviceName}/ai/notebook/${notebookId}`)
      .then(({ data }) => data);
  }

  startNotebook(serviceName, notebookId) {
    return this.$http
      .put(`/cloud/project/${serviceName}/ai/notebook/${notebookId}/start`)
      .then(({ data }) => data);
  }

  stopNotebook(serviceName, notebookId) {
    return this.$http
      .put(`/cloud/project/${serviceName}/ai/notebook/${notebookId}/stop`)
      .then(({ data }) => data);
  }

  getNotebookLogs(serviceName, notebookId) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/notebook/${notebookId}/log`,
        QuantumService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getEditors(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/notebook/capabilities/editor`,
        QuantumService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getFrameworks(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/notebook/capabilities/framework`,
        QuantumService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getRegions(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/capabilities/serving/region`,
        QuantumService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getFlavors(serviceName, region) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/capabilities/region/${region}/flavor`,
        QuantumService.getIcebergHeaders(),
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
