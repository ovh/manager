import { NEW_RANGE, DC_2_ISO } from '../server/server.constants';

export default class DedicatedServerDashboard {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $rootScope,
    $state,
    $stateParams,
    $translate,
    atInternet,
    Alerter,
    constants,
    DedicatedServerFeatureAvailability,
    Server,
    coreConfig,
    IMPRESSION_TRACKING_DATA,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.Alerter = Alerter;
    this.constants = constants;
    this.DedicatedServerFeatureAvailability = DedicatedServerFeatureAvailability;
    this.Server = Server;
    this.coreConfig = coreConfig;
    ({
      COMMIT_IMPRESSION_TRACKING_DATA: this.COMMIT_IMPRESSION_TRACKING_DATA,
      RECOMMIT_IMPRESSION_TRACKING_DATA: this.RECOMMIT_IMPRESSION_TRACKING_DATA,
    } = IMPRESSION_TRACKING_DATA);
  }

  $onInit() {
    this.statePrefix = this.statePrefix || 'app.dedicated-server.server';
    this.$rootScope.serverCtrl = this.dedicatedServer;

    this.server.iso =
      DC_2_ISO[this.server.datacenter.toUpperCase().split('_')[0]];

    this.infoServer = {
      rack: this.server.rack,
      serverId: this.server.serverId,
    };

    this.traffic = {};
    this.trafficOrderables = [];

    this.bandwidthInformationsLoad = {
      loading: true,
    };

    this.pattern = NEW_RANGE.PATTERN;
  }

  onBillingInformationError(error) {
    return this.Alerter.error(error, 'server_dashboard_alert');
  }

  trackPage(name) {
    this.atInternet.trackPage({
      name,
      type: 'navigation',
    });
  }

  showSuccessMessage(message) {
    this.Alerter.success(
      this.$translate.instant(message, {
        serverName: this.server.displayName,
      }),
      'server_dashboard_alert',
    );
  }

  showErrorMessage(message, error) {
    this.Alerter.error(
      this.$translate.instant(message, {
        serverName: this.server.displayName,
      }),
      error,
      'server_dashboard_alert',
    );
  }

  onChangeIntervention(noIntervention) {
    const { monitored } = this.server;
    this.updatingNoIntervention = true;
    return this.Server.updateMonitoring(
      this.serverName,
      monitored,
      noIntervention,
    )
      .then(() =>
        noIntervention
          ? this.showSuccessMessage(
              'server_configuration_intervention_deactivate_success',
            )
          : this.showSuccessMessage(
              'server_configuration_intervention_activate_success',
            ),
      )
      .catch((err) => {
        this.server.noIntervention = !noIntervention;
        return noIntervention
          ? this.showErrorMessage(
              'server_configuration_intervention_deactivate_failed',
              err,
            )
          : this.showErrorMessage(
              'server_configuration_intervention_activate_failed',
              err,
            );
      })
      .finally(() => {
        this.updatingNoIntervention = false;
      });
  }

  goToTags() {
    this.$state.go('app.dedicated-server.server.tags');
  }
}
