import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';

angular
  .module('managerApp')
  .controller(
    'CloudProjectBillingConsumptionEstimateCtrl',
    function CloudProjectBillingConsumptionEstimateCtrl(
      $q,
      $uibModal,
      $stateParams,
      $translate,
      OvhApiCloudProjectAlerting,
      CucCloudMessage,
      OvhApiCloudProjectUsageForecast,
      OvhApiCloudProjectUsageCurrent,
      CloudProjectBillingService,
    ) {
      const self = this;
      self.loading = false;
      self.data = {
        currencySymbol: null,
        alert: null,
        estimateTotals: null,
        currentTotals: null,
      };

      self.loaders = {
        alert: false,
        forecast: false,
        current: false,
        deleteAlert: false,
      };

      self.getCurrentMonth = function getCurrentMonth() {
        return moment();
      };

      self.getNextMonth = function getNextMonth() {
        return moment().add(1, 'month');
      };

      function initForecast() {
        self.loaders.forecast = true;
        return OvhApiCloudProjectUsageForecast.v6()
          .get({
            serviceName: $stateParams.projectId,
          })
          .$promise.then((billingInfo) =>
            CloudProjectBillingService.getConsumptionDetails(
              billingInfo,
              billingInfo,
            )
              .then((data) => {
                self.data.estimateTotals = data.totals;
                self.data.currencySymbol =
                  self.data.estimateTotals.currencySymbol;
              })
              .finally(() => {
                self.loaders.forecast = false;
              }),
          );
      }

      function initCurrent() {
        self.loaders.current = true;
        return OvhApiCloudProjectUsageCurrent.v6()
          .get({
            serviceName: $stateParams.projectId,
          })
          .$promise.then((billingInfo) =>
            CloudProjectBillingService.getConsumptionDetails(
              billingInfo,
              billingInfo,
            ),
          )
          .then((data) => {
            self.data.currentTotals = data.totals;
          })
          .finally(() => {
            self.loaders.current = false;
          });
      }

      function getAlertIds() {
        OvhApiCloudProjectAlerting.v6().resetCache();
        return OvhApiCloudProjectAlerting.v6().getIds({
          serviceName: $stateParams.projectId,
        }).$promise;
      }

      function getAlert(id) {
        return OvhApiCloudProjectAlerting.v6()
          .get({
            serviceName: $stateParams.projectId,
            alertId: id,
          })
          .$promise.catch(() => {
            // We dont rethrow or show a message to hide an API glitch.
            self.data.alert = null;
            return null;
          });
      }

      function initConsumptionChart() {
        const labelNow = $translate.instant(
          'cpbe_estimate_alert_chart_label_now',
        );
        const labelFuture = $translate.instant(
          'cpbe_estimate_alert_chart_label_future',
        );
        const labelLimit = $translate.instant(
          'cpbe_estimate_alert_chart_label_limit',
        );

        self.consumptionChartData = {
          estimate: {
            now: {
              value: self.data.currentTotals.hourly.total,
              currencyCode: self.data.estimateTotals.currencySymbol,
              label: labelNow,
            },
            endOfMonth: {
              value: self.data.estimateTotals.hourly.total,
              currencyCode: self.data.estimateTotals.currencySymbol,
              label: labelFuture,
            },
          },
          threshold: {
            now: {
              value: self.data.alert.monthlyThreshold,
              currencyCode: self.data.estimateTotals.currencySymbol,
              label: labelLimit,
            },
            endOfMonth: {
              value: self.data.alert.monthlyThreshold,
              currencyCode: self.data.estimateTotals.currencySymbol,
              label: labelLimit,
            },
          },
        };
      }

      function initAlert() {
        self.loaders.alert = true;
        // list alerts ids
        return getAlertIds()
          .then((alertIds) => {
            if (isEmpty(alertIds)) {
              return null;
            }
            return getAlert(head(alertIds));
          })
          .then((alertObject) => {
            self.data.alert = alertObject;
            if (!isNull(alertObject)) {
              initConsumptionChart();
            }
          })
          .finally(() => {
            self.loaders.alert = false;
          });
      }

      function init() {
        initForecast()
          .then(() => initCurrent())
          .then(() => initAlert())
          .catch((err) => {
            CucCloudMessage.error(
              [
                $translate.instant('cpbe_estimate_price_error_message'),
                (err.data && err.data.message) || '',
              ].join(' '),
            );
          });
      }

      self.openAlertAddModal = function openAlertAddModal() {
        const modal = $uibModal.open({
          windowTopClass: 'cui-modal',
          templateUrl:
            'app/cloud/project/billing/consumption/estimate/alert/add/cloud-project-billing-consumption-estimate-alert-add.html',
          controller: 'CloudProjectBillingConsumptionEstimateAlertAddCtrl',
          controllerAs: 'CloudProjectBillingConsumptionEstimateAlertAddCtrl',
          resolve: {
            dataContext() {
              return self.data;
            },
          },
        });

        modal.result.then(() => {
          initAlert();
        });
      };

      self.deleteAlert = function deleteAlert() {
        self.loaders.deleteAlert = true;
        // we query alerts to check if an alert already exists, in this case we delete it
        OvhApiCloudProjectAlerting.v6()
          .getIds({
            serviceName: $stateParams.projectId,
          })
          .$promise.then((alertIds) => {
            if (!isEmpty(alertIds)) {
              return OvhApiCloudProjectAlerting.v6()
                .delete({
                  serviceName: $stateParams.projectId,
                  alertId: head(alertIds),
                })
                .$promise.then(() => {
                  CucCloudMessage.success(
                    $translate.instant('cpbe_estimate_alert_delete_success'),
                  );
                });
            }
            return $q.reject({ data: { message: 'Alert not found' } });
          })
          .catch((err) => {
            CucCloudMessage.error(
              [
                $translate.instant('cpbe_estimate_alert_delete_error'),
                (err.data && err.data.message) || '',
              ].join(' '),
            );
            return $q.reject(err);
          })
          .finally(() => {
            self.loaders.deleteAlert = false;
          });

        initAlert();
      };

      init();
    },
  );
