import filter from 'lodash/filter';
import map from 'lodash/map';
export default class {
  /* @ngInject */
  constructor(
    $translate,
    PACK_SLOTS_TASK_PAGINATION_PER_PAGE,
    PACK_SLOTS_TASK_STATUS,
    OvhApiPackXdslTask,
    TucToastError,
  ) {
    this.$translate = $translate;
    this.PACK_SLOTS_TASK_STATUS = PACK_SLOTS_TASK_STATUS;
    this.OvhApiPackXdslTask = OvhApiPackXdslTask;
    this.TucToastError = TucToastError;

    this.filter = {
      perPage: PACK_SLOTS_TASK_PAGINATION_PER_PAGE,
      page: 1,
    };
    this.allTasks = [];
    this.statusFilteredTasks = [];
    this.paginatedTasks = [];
  }

  $onInit() {
    this.status = this.PACK_SLOTS_TASK_STATUS;
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
