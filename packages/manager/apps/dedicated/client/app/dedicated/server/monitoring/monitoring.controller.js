import includes from 'lodash/includes';
import omit from 'lodash/omit';
import set from 'lodash/set';

export default class Monitoring {
  /* @ngInject */
  constructor(
    $controller,
    $q,
    $rootScope,
    $scope,
    $stateParams,
    $translate,
    Alerter,
    IpRange,
    Server,
  ) {
    this.$controller = $controller;
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.IpRange = IpRange;
    this.Server = Server;
  }

  $onInit() {
    this.currentMonitoring = { value: null };
    this.ips = [];
    this.sms = null;
    this.addMode = false;
    this.editMode = false;

    this.editModeView = {
      email: false,
      sms: false,
    };

    this.loaders = {
      monitorings: false,
      emailNotifications: false,
      smsNotifications: false,
    };

    this.$scope.$on('server.monitoring.reload', this.refreshTableMonitoring);

    return this.init();
  }

  static compare(x, y) {
    return parseInt(x, 10) - parseInt(y, 10);
  }

  isAllowedToMonitoringWithSms() {
    const excludedFromMonitoring = new RegExp('BHS|SGP|SYD', 'g');

    return this.sms && !excludedFromMonitoring.test(this.server.datacenter);
  }

  init() {
    this.Server.getModels()
      .then((models) => {
        this.monitoringProtocolEnum =
          models.data.models['dedicated.server.MonitoringProtocolEnum'].enum;
        this.monitoringIntervalEnum = models.data.models[
          'dedicated.server.MonitoringIntervalEnum'
        ].enum.sort(Monitoring.compare);
        this.languageEnum =
          models.data.models['dedicated.server.AlertLanguageEnum'].enum;
      })
      .catch((err) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('server_tab_MONITORING_error'),
          err.data,
          'monitoringAlert',
        );
      })
      .finally(() => {
        this.loaders.init = false;
      });

    this.$q.allSettled([
      this.refreshTableMonitoring(),
      this.getSms(),
      this.getIps(),
    ]);
  }

  getSms() {
    return this.Server.getSms(this.$stateParams.productId)
      .then((sms) => {
        this.sms = sms.filter(
          (data) => data.status === 'enable' && data.creditsLeft > 0,
        );
      })
      .catch((err) => {
        if (err.status !== 404) {
          this.Alerter.alertFromSWS(
            this.$translate.instant('server_tab_MONITORING_error'),
            err.data,
            'monitoringAlert',
          );
        }
      });
  }

  getIps() {
    return this.Server.listIps(this.$stateParams.productId)
      .then((ips) => {
        ips.forEach((ip) => {
          if (!includes(ip, ':')) {
            this.ips = this.ips.concat(this.IpRange.getRangeForIpv4Block(ip));
          }
        });
      })
      .catch((err) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('server_tab_MONITORING_error'),
          err.data,
          'monitoringAlert',
        );
      });
  }

  toggleStatus(monitoring) {
    this.loaders.monitorings = true;
    set(monitoring, 'enabled', !monitoring.enabled);

    this.Server.updateServiceMonitoring(
      this.$stateParams.productId,
      monitoring.monitoringId,
      omit(monitoring, ['emailNotifications', 'smsNotifications']),
    )
      .catch((err) => {
        set(monitoring, 'enabled', !monitoring.enabled);
        this.Alerter.alertFromSWS(
          this.$translate.instant('server_tab_MONITORING_error'),
          err.data,
          'monitoringAlert',
        );
      })
      .finally(() => {
        this.loaders.monitorings = false;
        this.$rootScope.$broadcast('server.monitoring.reload');
      });
  }

  refreshTableMonitoring() {
    this.loaders.monitorings = true;
    this.monitoringServicesIds = [];

    this.Server.getServiceMonitoringIds(this.$stateParams.productId)
      .then((monitoringIds) => {
        this.monitoringServicesIds = monitoringIds;
      })
      .catch((err) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('server_tab_MONITORING_error'),
          err.data,
          'monitoringAlert',
        );
      })
      .finally(() => {
        this.loaders.monitorings = false;
      });
  }

  getMonitoringDetail(item) {
    return this.Server.getServiceMonitoring(this.$stateParams.productId, item);
  }

  onTransformItemNotify(item) {
    this.$q
      .allSettled([
        this.Server.getServiceMonitoringNotificationsIds(
          this.$stateParams.productId,
          {
            monitoringId: item.monitoringId,
            type: 'email',
          },
        ),
        this.Server.getServiceMonitoringNotificationsIds(
          this.$stateParams.productId,
          {
            monitoringId: item.monitoringId,
            type: 'sms',
          },
        ),
      ])
      .then((data) => {
        const emailIds = data[0];
        const smsIds = data[1];

        this.$q
          .allSettled(
            emailIds.map((id) =>
              this.getNotificationEmailDetail({
                monitoringId: item.monitoringId,
                alertId: id,
              }),
            ),
          )
          .then((emailsDatails) => {
            set(item, 'emailNotifications', emailsDatails);
          });

        this.$q
          .allSettled(
            smsIds.map((id) =>
              this.getNotificationSMSDetail({
                monitoringId: item.monitoringId,
                alertId: id,
              }),
            ),
          )
          .then((smsDatails) => {
            set(item, 'smsNotifications', smsDatails);
          });
      });
  }

  tableMonitoringPageLoaded() {
    this.loaders.monitorings = false;
  }

  getNotificationEmailDetail(opts) {
    return this.Server.getServiceMonitoringNotifications(
      this.$stateParams.productId,
      {
        alertId: opts.alertId,
        monitoringId: opts.monitoringId,
        type: 'email',
      },
    );
  }

  getNotificationSMSDetail(opts) {
    return this.Server.getServiceMonitoringNotifications(
      this.$stateParams.productId,
      {
        alertId: opts.alertId,
        monitoringId: opts.monitoringId,
        type: 'sms',
      },
    );
  }

  resetEditMode() {
    angular.forEach(this.editModeView, (value, key) => {
      this.editModeView[key] = false;
    });
  }

  toggleEditModePart(feat, reset) {
    if (reset) {
      this.resetEditMode();
    } else {
      angular.forEach(this.editModeView, (value, key) => {
        if (key !== feat) {
          this.editModeView[key] = false;
        }
      });
    }

    this.editModeView[feat] = !this.editModeView[feat];
  }
}
