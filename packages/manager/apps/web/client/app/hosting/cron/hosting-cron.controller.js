import get from 'lodash/get';
import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import {
  TASK_MAPPING,
  POLLING_EVENTS_MESSAGE_DISPLAY,
  POLLING_EVENTS_ERROR,
  POLLING_EVENTS_DONE,
  STATUS_CREATED,
} from './hosting-cron.constants';

export default class HostingCronsCtrl {
  /* @ngInject */
  constructor(
    $rootScope,
    $scope,
    $q,
    $stateParams,
    $timeout,
    $translate,
    atInternet,
    Alerter,
    Hosting,
    HostingCron,
    WucUser,
  ) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.Alerter = Alerter;
    this.Hosting = Hosting;
    this.HostingCron = HostingCron;
    this.WucUser = WucUser;
  }

  $onInit() {
    this.atInternet.trackPage({ name: 'web::hosting::cron' });

    this.crons = [];
    this.guide = null;

    // POLLING
    Object.values(POLLING_EVENTS_DONE).forEach((e) => {
      this.$scope.$on(e, () => {
        this.onPollingSuccess();
      });
    });

    Object.values(POLLING_EVENTS_ERROR).forEach((e) => {
      this.$scope.$on(e, (event, err) => {
        this.onPollingError(POLLING_EVENTS_MESSAGE_DISPLAY[e], err);
      });
    });

    // refresh cron table display after cron create/update/delete
    this.$scope.$on('hosting.tabs.crons.refresh', () => {
      this.updateCronsList();
    });

    // kill polling when leaving page
    this.$scope.$on('$destroy', () => {
      this.HostingCron.killAllPolling();
    });

    this.$scope.isCronStatusCreated = (state) => {
      return state === STATUS_CREATED;
    };

    // INIT PAGE
    this.startPolling();
    this.updateCronsList();
    return this.getGuides();
  }

  getGuides() {
    return this.WucUser.getUrlOf('guides').then((guides) => {
      if (guides && guides.hostingCron) {
        this.guide = guides.hostingCron;
      }
    });
  }

  updateCronsList() {
    const newCrons = [];
    this.HostingCron.getCrons(this.$stateParams.productId).then((crons) => {
      crons.map((e) => newCrons.push({ id: e }));
    });

    this.crons = newCrons;
  }

  getCrons({ criteria }) {
    let filters = null;
    if (!isEmpty(criteria)) {
      const { value } = head(criteria);
      filters = [{ command: value }, { description: value }, { email: value }];
    }
    return this.HostingCron.getCrons(this.$stateParams.productId, filters)
      .then((crons) => ({
        data: map(crons, (id) => ({ id })),
        meta: {
          totalCount: crons.length,
        },
      }))
      .catch((err) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('this.hosting_tab_CRON_configuration_error'),
          get(err, 'data', err),
          this.$scope.alerts.main,
        );
      });
  }

  getCron({ id }) {
    return this.HostingCron.getCron(this.$stateParams.productId, id).then(
      (cron) => ({
        ...cron,
        displayedLanguage: this.HostingCron.formatLanguage(cron.language),
      }),
    );
  }

  modifyCron(cron) {
    return this.$scope.setAction('cron/add-or-edit/hosting-cron-add-or-edit', {
      cron,
    });
  }

  deleteCron(cron) {
    return this.$scope.setAction('cron/delete/hosting-cron-delete', cron);
  }

  startPolling() {
    const taskTypes = Object.keys(TASK_MAPPING);
    const tasksPendingAll = [];

    taskTypes.forEach((e) => {
      const tasksPending = this.Hosting.getTaskIds(
        this.$stateParams.productId,
        e,
      );
      tasksPendingAll.push(tasksPending);
    });

    this.$q.all(tasksPendingAll).then((tasks) => {
      taskTypes.forEach((name, key) => {
        if (tasks[key].length > 0) {
          const tasksFiltered = tasks[key];
          this.HostingCron.pollRequest({
            taskIds: tasksFiltered,
            namespace: TASK_MAPPING[name],
            serviceName: this.$stateParams.productId,
          });
        }
      });
    });
  }

  onPollingSuccess() {
    this.$rootScope.$broadcast('hosting.tabs.crons.refresh');
    this.Alerter.resetMessage(this.$scope.alerts.main);
  }

  onPollingError(message, err) {
    this.$rootScope.$broadcast('hosting.tabs.crons.refresh');
    this.Alerter.alertFromSWS(
      this.$translate.instant(message),
      get(err, 'data', err),
      this.$scope.alerts.main,
    );
  }
}

angular.module('App').controller('HostingCronsCtrl', HostingCronsCtrl);
