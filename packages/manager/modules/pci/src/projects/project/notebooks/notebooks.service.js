export default class NotebookService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  static getIcebergHeaders() {
    return {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': 50000,
      },
    };
  }

  getNotebooks(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/training/notebook`,
        NotebookService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getNotebook(serviceName, notebookId) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/training/notebook/${notebookId}`,
        NotebookService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  addNotebook(serviceName, notebook) {
    return this.$http
      .post(`/cloud/project/${serviceName}/ai/training/notebook`, notebook)
      .then(({ data }) => data);
  }

  removeNotebook(serviceName, notebookId) {
    return this.$http
      .delete(
        `/cloud/project/${serviceName}/ai/training/notebook/${notebookId}/`,
        NotebookService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  startNotebook(serviceName, notebookId, description) {
    return this.$http
      .put(
        `/cloud/project/${serviceName}/ai/training/notebook/${notebookId}/start`,
        { description },
      )
      .then(({ data }) => data);
  }

  stopNotebook(serviceName, notebookId, description) {
    return this.$http
      .put(
        `/cloud/project/${serviceName}/ai/training/notebook/${notebookId}/stop`,
        { description },
      )
      .then(({ data }) => data);
  }

  getNotebookLogs(serviceName, notebookId) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/training/notebook/${notebookId}/log`,
        NotebookService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getEditors(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/capabilities/training/editor`,
        NotebookService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getFrameworks(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/capabilities/training/framework`,
        NotebookService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getRegions(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/capabilities/training/region`,
        NotebookService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getResources(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/ai/capabilities/training/region/resource`,
        NotebookService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }
}
