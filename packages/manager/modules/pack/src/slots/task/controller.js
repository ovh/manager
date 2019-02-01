import filter from 'lodash/filter';
import map from 'lodash/map';

import { PAGINATION_PER_PAGE, TASK_STATUS } from './constants';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    OvhApiPackXdslTask,
    TucToastError,
  ) {
    this.$translate = $translate;
    this.OvhApiPackXdslTask = OvhApiPackXdslTask;
    this.TucToastError = TucToastError;

    this.filter = {
      perPage: PAGINATION_PER_PAGE,
      page: 1,
    };
    this.allTasks = [];
    this.statusFilteredTasks = [];
    this.paginatedTasks = [];
  }

  $onInit() {
    this.status = TASK_STATUS;
    this.filterChoices = this.getStatusFilter();
    this.filterSelect = {
      status: this.filterChoices[0],
    };

    this.getData()
      .then((data) => {
        this.allTasks = this.assignStatusToTasks(data);
        this.updateFilteredTasks();
      });
  }

  getData() {
    return this.OvhApiPackXdslTask
      .Aapi()
      .details({
        packName: this.pack.packName,
      })
      .$promise
      .catch(this.TucToastError);
  }

  assignStatusToTasks(tasks) {
    return map(tasks, (task) => {
      const apiStatus = task.status;
      const status = this.status[apiStatus];

      if (task.status && apiStatus) {
        status.tip = this.$translate.instant(`telecom_task_${apiStatus}`);
        status.name = apiStatus;
      }

      return {
        ...task,
        status,
      };
    });
  }

  updateFilteredTasks() {
    let result = this.allTasks;

    if (this.filter.status) {
      result = filter(this.allTasks, elem => elem.status.name === this.filter.status);
    }
    this.statusFilteredTasks = result;
  }

  getStatusFilter() {
    const allResult = {
      icon: '',
      title: this.$translate.instant('telecom_task_status'),
      tip: this.$translate.instant('telecom_task_filter_none'),
      default: true,
    };

    return [
      allResult,
      ...map(this.status, (status, a) => ({
        status: a,
        title: this.$translate.instant(`telecom_task_${a}`),
        tip: this.$translate.instant(`telecom_task_${a}`),
      })),
    ];
  }

  filterTasksByStatus(item) {
    this.filter.status = item.status;
    this.updateFilteredTasks();
  }
}
