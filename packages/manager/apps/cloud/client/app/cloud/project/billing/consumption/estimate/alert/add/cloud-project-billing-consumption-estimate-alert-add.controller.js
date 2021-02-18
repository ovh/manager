angular
  .module('managerApp')
  .controller(
    'CloudProjectBillingConsumptionEstimateAlertAddCtrl',
    function CloudProjectBillingConsumptionEstimateAlertAddCtrl(
      $uibModalInstance,
      $stateParams,
      $scope,
      $translate,
      $q,
      OvhApiMe,
      OvhApiCloudProjectAlerting,
      CucCloudMessage,
      dataContext,
    ) {
      const self = this;

      self.model = {
        email: '',
        threshold: null,
      };

      self.alerting = {
        email: '',
        threshold: 0,
        currency: '',
        defaultDelay: 3600, // user cannot choose one so we use a default value
      };

      self.loaders = {
        saveAlert: false,
      };

      function initCurrency() {
        self.alerting.currency = dataContext.currencySymbol;
      }

      function initAlert() {
        if (dataContext.alert) {
          self.model.email = dataContext.alert.email;
          self.model.threshold = dataContext.alert.monthlyThreshold;
          self.alerting.id = dataContext.alert.id;
          self.alerting.email = self.model.email;
          self.alerting.threshold = self.model.threshold;
        } else {
          self.alerting.id = null;
          self.model.email = '';
          self.alerting.email = '';
          self.model.threshold = null;
          self.alerting.threshold = null;
        }
      }

      function init() {
        initAlert();
        initCurrency();
      }

      function createAlert() {
        return OvhApiCloudProjectAlerting.v6()
          .save(
            {
              serviceName: $stateParams.projectId,
            },
            {
              delay: self.alerting.defaultDelay,
              email: self.model.email,
              monthlyThreshold: self.model.threshold,
            },
          )
          .$promise.then(() => {
            CucCloudMessage.success(
              $translate.instant('cpbea_estimate_alert_success'),
            );
          });
      }

      function editAlert(alertId) {
        return OvhApiCloudProjectAlerting.v6()
          .put(
            {
              serviceName: $stateParams.projectId,
              alertId,
            },
            {
              delay: self.alerting.defaultDelay,
              email: self.model.email,
              monthlyThreshold: self.model.threshold,
            },
          )
          .$promise.then(() => {
            $uibModalInstance.close();
            CucCloudMessage.success(
              $translate.instant('cpbea_estimate_alert_success'),
            );
          });
      }

      self.saveAlert = function saveAlert() {
        this.loaders.saveAlert = true;
        (!self.alerting.id ? createAlert() : editAlert(self.alerting.id))
          .catch((err) => {
            CucCloudMessage.error(
              [
                $translate.instant('cpbea_estimate_alert_error'),
                (err.data && err.data.message) || '',
              ].join(' '),
            );
          })
          .finally(() => {
            $uibModalInstance.close();
            self.loaders.saveAlert = false;
          });
      };

      self.closeModal = function closeModal() {
        $uibModalInstance.dismiss();
      };

      init();
    },
  );
