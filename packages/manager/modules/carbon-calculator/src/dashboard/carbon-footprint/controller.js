import {
  API_FETCH_INTERVAL,
  TASK_STATUS_ENUM,
  TRACKING_NAME,
  SERVICES_AVAILABLE,
} from './constants';

export default class CarbonFootprintCtrl {
  /* @ngInject */
  constructor(
    $interval,
    $state,
    $translate,
    atInternet,
    carbonFootprintService,
  ) {
    this.$interval = $interval;
    this.$state = $state;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.carbonFootprintService = carbonFootprintService;
  }

  computeBilling() {
    this.atInternet.trackClick({
      name: `${TRACKING_NAME}::download-carbon-consumption`,
      type: 'action',
    });
    this.carbonFootprintService.computeBilling().then((task) => {
      if (this.$asyncFetching === null) {
        this.fetchStatusBilling(task);
      }
    });
  }

  fetchStatusBilling(task) {
    this.$asyncFetching = this.$interval(() => {
      this.fetchCurrentTask(task);
    }, API_FETCH_INTERVAL);
  }

  fetchCurrentTask(task) {
    this.carbonFootprintService
      .getTask(task.taskID)
      .then(({ status, link }) => {
        if (status === TASK_STATUS_ENUM.SUCCESS) {
          this.carbonFootprintService.downloadBilling(link);
          this.stopAsyncFetching();
        } else if (status === TASK_STATUS_ENUM.ERROR) {
          this.$state.go('error');
        }
      })
      .catch(this.stopAsyncFetching);
  }

  stopAsyncFetching() {
    if (this.$asyncFetching !== null) {
      this.$interval.cancel(this.$asyncFetching);
      this.$asyncFetching = null;
    }
  }

  $onInit() {
    this.$asyncFetching = null;
    this.previousMonth = this.carbonFootprintService.computePreviousMonth();
    this.availableServices = SERVICES_AVAILABLE.map((service) =>
      this.$translate.instant(
        `carbon_calculator_dashboard_billing_explanation_${service}`,
      ),
    );
  }

  $onDestroy() {
    this.stopAsyncFetching();
  }
}
