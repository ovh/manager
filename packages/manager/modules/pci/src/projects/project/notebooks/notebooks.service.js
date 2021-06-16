export default class NotebookService {
  static buildGetNotebookUrl(serviceName, notebookId) {
    return `/cloud/project/${serviceName}/ai/notebook/${notebookId}`;
  }

  static getIcebergHeaders() {
    return {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': 50000,
      },
    };
  }

  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getNotebookConfigurationCommand(serviceName, notebookSpecs) {
    return this.$http
      .post(`/cloud/project/${serviceName}/ai/notebook/command`, notebookSpecs)
      .then(({ data }) => data.command);
  }

  getNotebooks(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/notebook`,
        NotebookService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getNotebook(serviceName, notebookId) {
    return this.$http
      .get(
        NotebookService.buildGetNotebookUrl(serviceName, notebookId),
        NotebookService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  addNotebook(serviceName, notebook) {
    return this.$http
      .post(`/cloud/project/${serviceName}/ai/notebook`, notebook)
      .then(({ data }) => data);
  }

  updateNotebook(serviceName, notebook) {
    return this.$http
      .put(`/cloud/project/${serviceName}/ai/notebook`, notebook)
      .then(({ data }) => data);
  }

  removeNotebook(serviceName, notebookId) {
    return this.$http
      .delete(
        `/cloud/project/${serviceName}/ai/notebook/${notebookId}/`,
        NotebookService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  startNotebook(serviceName, notebookId, description) {
    return this.$http
      .put(`/cloud/project/${serviceName}/ai/notebook/${notebookId}/start`, {
        description,
      })
      .then(({ data }) => data);
  }

  stopNotebook(serviceName, notebookId, description) {
    return this.$http
      .put(`/cloud/project/${serviceName}/ai/notebook/${notebookId}/stop`, {
        description,
      })
      .then(({ data }) => data);
  }

  getNotebookLogs(serviceName, notebookId) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/notebook/${notebookId}/log`,
        NotebookService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getEditors(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/notebook/capabilities/editor `,
        NotebookService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getFrameworks(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/notebook/capabilities/framework`,
        NotebookService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getRegions(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/capabilities/serving/region`,
        NotebookService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getFlavors(serviceName, region) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/capabilities/region/${region}/flavor`,
        NotebookService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getVolumes(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/storage?archive=false&withObjects=false`,
        NotebookService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }
}
