import omit from 'lodash/omit';
import uniq from 'lodash/uniq';
import without from 'lodash/without';
import validator from 'validator';

angular
  .module('App')
  .controller('MonitoringUpdateCtrl', function MonitoringUpdateCtrl(
    $rootScope,
    $scope,
    $stateParams,
    $translate,
    Server,
    Alerter,
    $q,
  ) {
    const self = this;
    self.validator = validator;
    self.loaders = {
      init: false,
      update: false,
    };

    self.emailNotificationsToDelete = [];
    self.smsNotificationsToDelete = [];

    self.init = function init(monitoring) {
      self.loaders.init = true;
      self.monitoring = angular.copy(monitoring);
      self.baseMonitoring = angular.copy(monitoring);
    };

    self.compare = function compare(x, y) {
      return parseInt(x, 10) - parseInt(y, 10);
    };

    self.addEMailNotification = function addEMailNotification() {
      if (!self.monitoring.emailNotifications) {
        self.monitoring.emailNotifications = [];
      }
      self.monitoring.emailNotifications.push({
        email: null,
        language: null,
      });
    };

    self.removeEMailNotification = function removeEMailNotification(
      notification,
    ) {
      if (!notification.alertId) {
        self.monitoring.emailNotifications = without(
          self.monitoring.emailNotifications,
          notification,
        );
      } else {
        self.emailNotificationsToDelete.push(notification);
      }
    };

    self.cancelDeleteEMailNotification = function cancelDeleteEMailNotification(
      notification,
    ) {
      self.emailNotificationsToDelete = without(
        self.emailNotificationsToDelete,
        notification,
      );
    };

    self.addSmsNotification = function addSmsNotification() {
      if (!self.monitoring.smsNotifications) {
        self.monitoring.smsNotifications = [];
      }
      self.monitoring.smsNotifications.push({
        smsAccount: null,
        phoneNumberTo: null,
        fromHour: null,
        toHour: null,
        language: null,
      });
    };

    self.removeSmsNotification = function removeSmsNotification(notification) {
      if (!notification.alertId) {
        self.monitoring.smsNotifications = without(
          self.monitoring.smsNotifications,
          notification,
        );
      } else {
        self.smsNotificationsToDelete.push(notification);
      }
    };

    self.cancelDeleteSmslNotification = function cancelDeleteSmslNotification(
      notification,
    ) {
      self.smsNotificationsToDelete = without(
        self.smsNotificationsToDelete,
        notification,
      );
    };

    function diff(x, y) {
      if (!x && Array.isArray(y)) {
        return y;
      }

      if (!y && Array.isArray(x)) {
        return x;
      }

      if (!y && !x) {
        return [];
      }

      const d = [];
      for (let i = 0; i < x.length; i += 1) {
        let found = false;
        let j = 0;

        while (!found && j < y.length) {
          found = angular.equals(x[i], y[j]);
          j += 1;
        }

        if (!found) {
          d.push(x[i]);
        }
      }
      return d;
    }

    self.updateEmailNotifications = function updateEmailNotifications() {
      let promises = [];

      // Remove email notification mark as deleted
      promises = self.emailNotificationsToDelete.map((notification) =>
        Server.deleteServiceMonitoringNotifications($stateParams.productId, {
          type: 'email',
          monitoringId: self.monitoring.monitoringId,
          alertId: notification.alertId,
        }),
      );

      if (self.monitoring.emailNotifications) {
        const emailNotifications = self.monitoring.emailNotifications.map(
          (notification) => omit(notification, '$$hashKey'),
        );

        diff(
          emailNotifications,
          self.baseMonitoring.emailNotifications,
        ).forEach((notification) => {
          if (
            !notification.email ||
            !validator.isEmail(notification.email) ||
            !notification.language
          ) {
            return;
          }

          if (notification.alertId) {
            promises.push(
              Server.updateServiceMonitoringNotificationEmail(
                $stateParams.productId,
                {
                  monitoringId: self.monitoring.monitoringId,
                  alertId: notification.alertId,
                  data: omit(notification, 'alertId'),
                },
              ),
            );
          } else {
            promises.push(
              Server.addServiceMonitoringNotificationEmail(
                $stateParams.productId,
                {
                  monitoringId: self.monitoring.monitoringId,
                  data: notification,
                },
              ),
            );
          }
        });
      }

      if (promises.length <= 0) {
        return null;
      }

      return $q.allSettled(promises);
    };

    self.updateSmsNotifications = function updateSmsNotifications() {
      let promises = [];

      // Remove sms notification mark as deleted
      promises = self.smsNotificationsToDelete.map((notification) =>
        Server.deleteServiceMonitoringNotifications($stateParams.productId, {
          type: 'sms',
          monitoringId: self.monitoring.monitoringId,
          alertId: notification.alertId,
        }),
      );

      if (self.monitoring.smsNotifications) {
        const smsNotifications = self.monitoring.smsNotifications.map(
          (notification) => omit(notification, '$$hashKey'),
        );

        diff(smsNotifications, self.baseMonitoring.smsNotifications).forEach(
          (notification) => {
            if (
              !notification.smsAccount ||
              !notification.phoneNumberTo ||
              !(notification.fromHour >= 0 && notification.fromHour <= 24) ||
              !(notification.toHour >= 0 && notification.toHour <= 24) ||
              !notification.language
            ) {
              return;
            }

            if (notification.alertId) {
              promises.push(
                Server.updateServiceMonitoringNotificationSMS(
                  $stateParams.productId,
                  {
                    monitoringId: self.monitoring.monitoringId,
                    alertId: notification.alertId,
                    data: omit(notification, 'alertId'),
                  },
                ),
              );
            } else {
              promises.push(
                Server.addServiceMonitoringNotificationSMS(
                  $stateParams.productId,
                  {
                    monitoringId: self.monitoring.monitoringId,
                    data: notification,
                  },
                ),
              );
            }
          },
        );
      }

      if (promises.length <= 0) {
        return null;
      }

      return $q.allSettled(promises);
    };

    self.updateMonitoring = function updateMonitoring() {
      self.loaders.update = true;
      const promises = [];

      if (
        !angular.equals(
          omit(self.monitoring, ['emailNotifications', 'smsNotifications']),
          omit(self.baseMonitoring, ['emailNotifications', 'smsNotifications']),
        )
      ) {
        promises.push(
          Server.updateServiceMonitoring(
            $stateParams.productId,
            self.monitoring.monitoringId,
            omit(self.monitoring, [
              'monitoringId',
              'emailNotifications',
              'smsNotifications',
            ]),
          ),
        );
      }

      const promisesEmailNotifications = self.updateEmailNotifications();
      const promisesSmsNotifications = self.updateSmsNotifications();

      if (promisesEmailNotifications) {
        promises.push(promisesEmailNotifications);
      }

      if (promisesSmsNotifications) {
        promises.push(promisesSmsNotifications);
      }

      $q.allSettled(promises)
        .then(
          () => {
            self.baseMonitoring = self.monitoring;
            Alerter.success(
              $translate.instant('server_tab_MONITORING_update_success'),
              'monitoringAlert',
            );
            $rootScope.$broadcast('server.monitoring.reload');
            $scope.$parent.ctrlMonitoring.editMode = null;
          },
          (errors) => {
            const displayErrors = {
              message: uniq(errors.map((err) => err.data.message)).join(', '),
            };

            Alerter.alertFromSWS(
              $translate.instant('server_tab_MONITORING_update_error'),
              displayErrors,
              'monitoringAlert',
            );
          },
        )
        .finally(() => {
          self.loaders.update = false;
        });
    };
  });
