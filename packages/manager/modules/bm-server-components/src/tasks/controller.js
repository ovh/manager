import isFunction from 'lodash/isFunction';
import snakeCase from 'lodash/snakeCase';
import toUpper from 'lodash/toUpper';

import Task from './tasks.class';

export default class BmServerComponentsTasksController {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getTasks({ offset, pageSize }) {
    return this.loadTasks(
      this.serviceName,
      (offset - 1) / pageSize + 1,
      pageSize,
    )
      .then((res) => {
        const tasks = res.data;
        return {
          data: tasks.map(
            (task) =>
              new Task(
                task.lastUpdate,
                task.comment,
                toUpper(snakeCase(task.function)),
                toUpper(snakeCase(task.status)),
              ),
          ),
          meta: {
            totalCount: res.headers('x-pagination-elements'),
          },
        };
      })
      .catch((error) => {
        this.handleError(error);
        return {
          data: [],
          meta: {
            totalCount: 0,
          },
        };
      });
  }

  loadTasks(serviceName, pageNumber, pageSize) {
    return this.$http.get(`/dedicated/server/${serviceName}/task`, {
      headers: {
        Pragma: 'no-cache',
        'x-pagination-mode': 'CachedObjectList-Pages',
        'x-pagination-number': pageNumber,
        'x-pagination-size': pageSize,
        'x-pagination-sort': 'lastUpdate',
        'x-pagination-sort-order': 'DESC',
      },
    });
  }

  handleError(error) {
    if (isFunction(this.onError)) {
      this.onError({ error });
    }
  }
}
