export default class TaskTrackerService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getTasks(endpoint, taskIds) {
    return taskIds.length === 1
      ? this.$http
          .get(`${endpoint}/${taskIds[0]}`)
          .then(({ data: task }) => [task])
      : this.getTasksBy(endpoint, { taskId: taskIds });
  }

  getTasksBy(endpoint, filters) {
    const xPaginationFilter = Object.entries(filters)
      .map(([property, value]) =>
        Array.isArray(value)
          ? `${property}:in=${value.join(',')}`
          : `${property}:eq=${value}`,
      )
      .join('&');
    return this.$http
      .get(endpoint, {
        headers: {
          Pragma: 'no-cache',
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Filter': xPaginationFilter,
        },
      })
      .then(({ data: tasks }) => tasks);
  }
}
