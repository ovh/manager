import omit from 'lodash/omit';
import set from 'lodash/set';

export default class Monitoring {
  /* @ngInject */
  constructor($q, $scope, $state, $stateParams, $translate, Alerter, Server) {
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.Server = Server;
  }

  $onInit() {
    this.currentMonitoring = { value: null };
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

    this.$scope.$on('server.monitoring.reload', () =>
      this.refreshTableMonitoring(),
    );

    return this.refreshTableMonitoring();
  }

  isAllowedToMonitoringWithSms() {
    const excludedFromMonitoring = new RegExp('BHS|SGP|SYD', 'g');

    return this.sms && !excludedFromMonitoring.test(this.server.datacenter);
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

        return this.$state.reload();
      });
  }

  refreshTableMonitoring() {
    this.loaders.monitorings = true;
    this.monitoringServicesIds = [];
    this.editMode = null;
    this.addMode = null;

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
