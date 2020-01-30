import includes from 'lodash/includes';
import omit from 'lodash/omit';
import set from 'lodash/set';

angular
  .module('App')
  .controller('MonitoringCtrl', function MonitoringCtrl(
    $rootScope,
    $scope,
    $translate,
    Server,
    IpRange,
    Alerter,
    $q,
    $stateParams,
  ) {
    const self = this;
    self.currentMonitoring = { value: null };
    self.ips = [];
    self.sms = null;
    self.addMode = false;
    self.editMode = false;

    self.editModeView = {
      email: false,
      sms: false,
    };

    self.loaders = {
      monitorings: false,
      emailNotifications: false,
      smsNotifications: false,
    };

    self.compare = function compare(x, y) {
      return parseInt(x, 10) - parseInt(y, 10);
    };

    self.isAllowedToMonitoringWithSms = function isAllowedToMonitoringWithSms() {
      const excludedFromMonitoring = new RegExp('BHS|SGP|SYD', 'g');
      return self.sms && !excludedFromMonitoring.test($scope.server.datacenter);
    };

    const init = function init() {
      Server.getModels()
        .then(
          (models) => {
            self.monitoringProtocolEnum =
              models.data.models[
                'dedicated.server.MonitoringProtocolEnum'
              ].enum;
            self.monitoringIntervalEnum = models.data.models[
              'dedicated.server.MonitoringIntervalEnum'
            ].enum.sort(self.compare);
            self.languageEnum =
              models.data.models['dedicated.server.AlertLanguageEnum'].enum;
          },
          (err) => {
            Alerter.alertFromSWS(
              $translate.instant('server_tab_MONITORING_error'),
              err.data,
              'monitoringAlert',
            );
          },
        )
        .finally(() => {
          self.loaders.init = false;
        });
      $q.allSettled([
        self.refreshTableMonitoring(),
        self.getSms(),
        self.getIps(),
      ]);
    };

    self.getSms = function getSms() {
      return Server.getSms($stateParams.productId).then(
        (sms) => {
          self.sms = sms.filter(
            (data) => data.status === 'enable' && data.creditsLeft > 0,
          );
        },
        (err) => {
          if (err.status !== 404) {
            Alerter.alertFromSWS(
              $translate.instant('server_tab_MONITORING_error'),
              err.data,
              'monitoringAlert',
            );
          }
        },
      );
    };

    self.getIps = function getIps() {
      return Server.listIps($stateParams.productId).then(
        (ips) => {
          ips.forEach((ip) => {
            if (!includes(ip, ':')) {
              self.ips = self.ips.concat(IpRange.getRangeForIpv4Block(ip));
            }
          });
        },
        (err) => {
          Alerter.alertFromSWS(
            $translate.instant('server_tab_MONITORING_error'),
            err.data,
            'monitoringAlert',
          );
        },
      );
    };

    self.toggleStatus = function toggleStatus(monitoring) {
      self.loaders.monitorings = true;
      set(monitoring, 'enabled', !monitoring.enabled);
      Server.updateServiceMonitoring(
        $stateParams.productId,
        monitoring.monitoringId,
        omit(monitoring, ['emailNotifications', 'smsNotifications']),
      )
        .catch((err) => {
          set(monitoring, 'enabled', !monitoring.enabled);
          Alerter.alertFromSWS(
            $translate.instant('server_tab_MONITORING_error'),
            err.data,
            'monitoringAlert',
          );
        })
        .finally(() => {
          self.loaders.monitorings = false;
          $rootScope.$broadcast('server.monitoring.reload');
        });
    };

    /* -- Table monitoring --*/
    self.refreshTableMonitoring = function refreshTableMonitoring() {
      self.loaders.monitorings = true;
      self.monitoringServicesIds = [];
      Server.getServiceMonitoringIds($stateParams.productId)
        .then(
          (monitoringIds) => {
            self.monitoringServicesIds = monitoringIds;
          },
          (err) => {
            Alerter.alertFromSWS(
              $translate.instant('server_tab_MONITORING_error'),
              err.data,
              'monitoringAlert',
            );
          },
        )
        .finally(() => {
          self.loaders.monitorings = false;
        });
    };

    self.getMonitoringDetail = function getMonitoringDetail(item) {
      return Server.getServiceMonitoring($stateParams.productId, item);
    };

    self.onTransformItemNotify = function onTransformItemNotify(item) {
      $q.allSettled([
        Server.getServiceMonitoringNotificationsIds($stateParams.productId, {
          monitoringId: item.monitoringId,
          type: 'email',
        }),
        Server.getServiceMonitoringNotificationsIds($stateParams.productId, {
          monitoringId: item.monitoringId,
          type: 'sms',
        }),
      ]).then((data) => {
        const emailIds = data[0];
        const smsIds = data[1];

        $q.allSettled(
          emailIds.map((id) =>
            self.getNotificationEmailDetail({
              monitoringId: item.monitoringId,
              alertId: id,
            }),
          ),
        ).then((emailsDatails) => {
          set(item, 'emailNotifications', emailsDatails);
        });

        $q.allSettled(
          smsIds.map((id) =>
            self.getNotificationSMSDetail({
              monitoringId: item.monitoringId,
              alertId: id,
            }),
          ),
        ).then((smsDatails) => {
          set(item, 'smsNotifications', smsDatails);
        });
      });
    };

    self.tableMonitoringPageLoaded = function tableMonitoringPageLoaded() {
      self.loaders.monitorings = false;
    };

    $scope.$on('server.monitoring.reload', self.refreshTableMonitoring);

    /* --  email notifications --*/
    self.getNotificationEmailDetail = function getNotificationEmailDetail(
      opts,
    ) {
      return Server.getServiceMonitoringNotifications($stateParams.productId, {
        alertId: opts.alertId,
        monitoringId: opts.monitoringId,
        type: 'email',
      });
    };

    /* -- SMS notifications --*/
    self.getNotificationSMSDetail = function getNotificationSMSDetail(opts) {
      return Server.getServiceMonitoringNotifications($stateParams.productId, {
        alertId: opts.alertId,
        monitoringId: opts.monitoringId,
        type: 'sms',
      });
    };

    self.resetEditMode = function resetEditMode() {
      angular.forEach(self.editModeView, (value, key) => {
        self.editModeView[key] = false;
      });
    };

    self.toggleEditModePart = function toggleEditModePart(feat, reset) {
      if (reset) {
        self.resetEditMode();
      } else {
        angular.forEach(self.editModeView, (value, key) => {
          if (key !== feat) {
            self.editModeView[key] = false;
          }
        });
      }

      self.editModeView[feat] = !self.editModeView[feat];
    };

    init();
  });
