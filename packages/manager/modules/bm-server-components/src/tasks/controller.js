import isFunction from 'lodash/isFunction';
import snakeCase from 'lodash/snakeCase';
import toUpper from 'lodash/toUpper';
import map from 'lodash/map';

import Task from './tasks.class';

export default class BmServerComponentsTasksController {
  /* @ngInject */
  constructor($http, ouiDatagridService, $translate, Server, iceberg) {
    this.$http = $http;
    this.ouiDatagridService = ouiDatagridService;
    this.Server = Server;
    this.$translate = $translate;
    this.taskStatusFilter = null;
    this.iceberg = iceberg;
  }

  $onInit() {
    this.loading = true;
    return this.Server.getModels()
      .then((data) => {
        this.stateEnum =
          data.data.models['dedicated.server.task.StatusEnum'].enum;
        this.taskStatusFilterList = map(this.stateEnum, (state) => ({
          value: state,
          label: this.$translate.instant(
            `server_configuration_task_status_${snakeCase(
              state,
            ).toUpperCase()}`,
          ),
        }));
      })
      .catch((err) => {
        this.handleError(err);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  getTasks(config) {
    return this.loadTasks(config)
      .then((res) => {
        return {
          ...res,
          data: (res.data ?? []).map(
            (task) =>
              new Task(
                task.lastUpdate,
                task.comment,
                toUpper(snakeCase(task.function)),
                toUpper(snakeCase(task.status)),
              ),
          ),
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

  loadTasks(config) {
    const paginationParams = {
      ...config,
      sortOrder: config.sort.dir === 1 ? 'ASC' : 'DESC',
      defaultFilterColumn: 'executionDate',
      isCacheDisabled:
        !!this.taskStatusFilter &&
        !['done', 'canceled'].includes(this.taskStatusFilter),
    };
    const {
      offset,
      pageSize,
      sort,
      sortOrder,
      defaultFilterColumn,
      isCacheDisabled,
    } = paginationParams;

    const urlParams = {
      status: this.taskStatusFilter, // || ['doing','init','todo'] , 'doing,init,todo' Both are not working for initial call!! ,
    };

    const request = this.iceberg(
      `/dedicated/server/${this.serviceName}/task`,
      urlParams,
    )
      .query()
      .expand('CachedObjectList-Pages')
      .limit(pageSize)
      .offset(Math.ceil(offset / (pageSize || 1)))
      .sort(sort || defaultFilterColumn, sortOrder);

    return request
      .execute(urlParams, isCacheDisabled)
      .$promise.then(({ data, headers }) => ({
        data,
        meta: {
          totalCount: headers['x-pagination-elements'],
        },
      }));
  }

  refresh() {
    this.ouiDatagridService.refresh('tasksDatagrid', true);
  }

  handleError(error) {
    if (isFunction(this.onError)) {
      this.onError({ error });
    }
  }
}
