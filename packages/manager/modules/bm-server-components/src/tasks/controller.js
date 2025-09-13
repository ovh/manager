import isFunction from 'lodash/isFunction';
import snakeCase from 'lodash/snakeCase';
import toUpper from 'lodash/toUpper';
import map from 'lodash/map';

import Task from './tasks.class';

export default class BmServerComponentsTasksController {
  /* @ngInject */
  constructor(
    $http,
    ouiDatagridService,
    $translate,
    Server,
    iceberg,
    icebergUtils,
  ) {
    this.$http = $http;
    this.ouiDatagridService = ouiDatagridService;
    this.Server = Server;
    this.$translate = $translate;
    this.taskStatusFilter = null;
    this.iceberg = iceberg;
    this.icebergUtils = icebergUtils;
  }

  $onInit() {
    this.loading = true;
    return this.getTaskStatus()
      .catch((err) => {
        this.handleError(err);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  getTaskStatus() {
    return this.Server.getModel('dedicated.server.task.StatusEnum').then(
      (model) => {
        this.stateEnum = model.enum;
        this.taskStatusFilterList = this.buildTaskStatusFilterList(
          this.stateEnum,
        );
        return model;
      },
    );
  }

  buildTaskStatusFilterList(stateEnum) {
    return map(stateEnum, (state) => ({
      value: state,
      label: this.$translate.instant(
        `server_configuration_task_status_${snakeCase(state).toUpperCase()}`,
      ),
    }));
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
      isCacheDisabled: true,
    };

    const urlParams = {
      status: this.taskStatusFilter,
    };

    return this.Server.getTasks(this.serviceName, paginationParams, urlParams);
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
