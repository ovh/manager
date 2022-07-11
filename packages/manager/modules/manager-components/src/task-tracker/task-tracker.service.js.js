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
      : this.$http
          .get(endpoint, {
            headers: {
              Pragma: 'no-cache',
              'X-Pagination-Mode': 'CachedObjectList-Pages',
              'X-Pagination-Filter': `taskId:in=${taskIds.join(',')}`,
            },
          })
          .then(({ data: tasks }) => tasks);
  }
}
