import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

export default class ExchangeExportAsPstCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $timeout,
    wucExchange,
    APIExchange,
    navigation,
    messaging,
    $translate,
    exchangeAccount,
  ) {
    this.services = {
      $scope,
      $timeout,
      wucExchange,
      APIExchange,
      navigation,
      messaging,
      $translate,
      exchangeAccount,
    };

    this.selectedAccount = navigation.currentActionData;
    this.exchange = wucExchange.value;
    this.$routerParams = wucExchange.getParams();

    this.initialize();

    $scope.confirmBtnTitle = () => this.confirmBtnTitle();
    $scope.confirmBtnAction = () => this.confirmBtnAction();
    $scope.closeExportWindow = () => this.closeExportWindow();
  }

  initialize() {
    this.exportURL = null;
    this.exportStep = 1;
    this.timer = null;
    this.getExportDetails(true);
  }

  getSelected() {
    return this.services.exchangeAccount
      .getTasks(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.selectedAccount.primaryEmailAddress,
      )
      .then((tasksId) => {
        if (!isEmpty(tasksId)) {
          const firstTaskId = tasksId[0];
          const firstTask = this.getTask(firstTaskId);

          if (
            firstTask != null &&
            isString(firstTask.status) &&
            firstTask.status.toUpperCase() !== 'DONE' &&
            isString(firstTask.function) &&
            firstTask.function.toUpperCase() !== 'DELETEEXPORTPSTREQUEST'
          ) {
            this.exportStep = 7;
            this.checkExportDetailTask(firstTask);
          } else {
            this.getExportDetails(true);
          }
        } else {
          this.getExportDetails(true);
        }
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant('exchange_ACTION_display_pst_error'),
          failure,
        );
        this.services.navigation.resetAction();
      });
  }

  getExportDetails(firstCall) {
    this.services.APIExchange.get(
      '/{organizationName}/service/{exchangeService}/account/{account}/export',
      {
        urlParams: {
          organizationName: this.exchange.organization,
          exchangeService: this.exchange.domain,
          account: this.selectedAccount.primaryEmailAddress,
        },
      },
    )
      .then((result) => {
        if (result.percentComplete !== 100) {
          this.exportStep = 3;
          this.progress = this.services.$translate.instant(
            'exchange_ACTION_display_pst_progress',
            { t0: result.percentComplete },
          );

          this.timer = this.services.$timeout(() => {
            this.getExportDetails();
          }, 10000);
        } else if (firstCall) {
          this.exportStep = 5;
          this.postExportUrl(this.exchange);
        } else {
          this.exportStep = 4;
        }
      })
      .catch(() => {
        this.exportStep = 2;
      });
  }

  closeExportWindow() {
    this.services.navigation.resetAction();
    this.services.$timeout.cancel(this.timer);
  }

  postExportDetails() {
    this.services.APIExchange.post(
      '/{organizationName}/service/{exchangeService}/account/{account}/export',
      {
        urlParams: {
          organizationName: this.exchange.organization,
          exchangeService: this.exchange.domain,
          account: this.selectedAccount.primaryEmailAddress,
        },
      },
    )
      .then(() => {
        this.progress = this.services.$translate.instant(
          'exchange_ACTION_display_pst_progress',
          {
            t0: 0,
          },
        );
        this.exportStep = 3;
        this.getExportDetails();
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant('exchange_ACTION_display_pst_error'),
          failure,
        );
        this.services.navigation.resetAction();
      });
  }

  getExportUrl(exchange) {
    this.services.APIExchange.get(
      '/{organizationName}/service/{exchangeService}/account/{account}/exportURL',
      {
        urlParams: {
          organizationName: exchange.organization,
          exchangeService: exchange.domain,
          account: this.selectedAccount.primaryEmailAddress,
        },
      },
    )
      .then((result) => {
        this.exportURL = result;
        this.exportStep = 6;
      })
      .catch(() => {
        this.postExportUrl(exchange);
      });
  }

  postExportUrl(exchange) {
    this.services.APIExchange.post(
      '/{organizationName}/service/{exchangeService}/account/{account}/exportURL',
      {
        urlParams: {
          organizationName: exchange.organization,
          exchangeService: exchange.domain,
          account: this.selectedAccount.primaryEmailAddress,
        },
      },
    )
      .then((data) => this.checkExportUrlTask(exchange, data.id))
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant('exchange_ACTION_display_pst_error'),
          failure,
        );
        this.services.navigation.resetAction();
      });
  }

  deleteExportDetails(exchange) {
    this.services.APIExchange.delete(
      '/{organizationName}/service/{exchangeService}/account/{account}/export',
      {
        urlParams: {
          organizationName: exchange.organization,
          exchangeService: exchange.domain,
          account: this.selectedAccount.primaryEmailAddress,
        },
      },
    )
      .then((task) => {
        this.exportStep = 7;
        this.checkExportDetailTask(task);
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant('exchange_ACTION_display_pst_error'),
          failure,
        );
        this.services.navigation.resetAction();
      });
  }

  checkExportDetailTask(task) {
    return this.getTask(task.id)
      .then((newTask) => {
        if (get(newTask, 'status') === 'done') {
          this.exportStep = 1;
          this.getSelected();
        } else {
          this.timer = this.services.$timeout(() => {
            this.checkExportDetailTask(newTask);
          }, 10000);
        }
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant('exchange_ACTION_display_pst_error'),
          failure,
        );
        this.services.navigation.resetAction();
      });
  }

  checkExportUrlTask(exchange, taskId) {
    return this.services.APIExchange.get(
      '/{organizationName}/service/{exchangeService}/account/{account}/tasks/{taskId}',
      {
        urlParams: {
          organizationName: exchange.organization,
          exchangeService: exchange.domain,
          account: this.selectedAccount.primaryEmailAddress,
          taskId,
        },
      },
    )
      .then((result) => {
        if (result.status.toLowerCase() === 'done') {
          this.getExportUrl(exchange, null);
        } else {
          this.timer = this.services.$timeout(
            () => this.checkExportUrlTask(exchange, taskId),
            10000,
          );
        }
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant('exchange_ACTION_display_pst_error'),
          failure,
        );
        this.services.navigation.resetAction();
      });
  }

  displayError() {
    this.exportStep = -1;
  }

  confirmBtnAction() {
    switch (this.exportStep) {
      case 2:
        this.postExportDetails();
        break;

      case 4:
        this.exportStep = 5;
        this.postExportUrl(this.exchange);
        break;

      case 6:
        this.deleteExportDetails(this.exchange);
        break;

      case -1:
        this.initialize();
        break;

      default:
        this.closeExportWindow();
    }
  }

  confirmBtnTitle() {
    switch (this.exportStep) {
      case 2:
        return this.services.$translate.instant(
          'exchange_ACTION_display_pst_start',
        );
      case 4:
        return this.services.$translate.instant(
          'exchange_ACTION_display_pst_genlink',
        );
      case 6:
        return this.services.$translate.instant(
          'exchange_ACTION_display_pst_start',
        );
      case -1:
        return this.services.$translate.instant(
          'exchange_ACTION_display_pst_retry',
        );
      default:
        return this.services.$translate.instant(
          'exchange_ACTION_display_pst_close',
        );
    }
  }

  getTasks() {
    return this.services.APIExchange.get(
      '/{organizationName}/service/{exchangeService}/account/{account}/tasks',
      {
        urlParams: {
          organizationName: this.exchange.organization,
          exchangeService: this.exchange.domain,
          account: this.selectedAccount.primaryEmailAddress,
        },
      },
    );
  }

  getTask(taskId) {
    return this.services.APIExchange.get(
      '/{organizationName}/service/{exchangeService}/account/{account}/tasks/{taskId}',
      {
        urlParams: {
          organizationName: this.exchange.organization,
          exchangeService: this.exchange.domain,
          account: this.selectedAccount.primaryEmailAddress,
          taskId,
        },
      },
    );
  }
}
