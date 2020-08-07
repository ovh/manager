import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import map from 'lodash/map';

import { OLA_MODES } from './ola-configuration.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    Alerter,
    DedicatedServerInterfacesService,
    OvhApiDedicatedServerPhysicalInterface,
    OvhApiDedicatedServerVirtualInterface,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.InterfaceService = DedicatedServerInterfacesService;
    this.PhysicalInterface = OvhApiDedicatedServerPhysicalInterface;
    this.VirtualInterface = OvhApiDedicatedServerVirtualInterface;
  }

  $onInit() {
    this.olaModes = Object.values(OLA_MODES);

    this.isPolling = true;
    this.taskPolling.promise.then(() => {
      this.isPolling = false;
    });

    this.configuration = {
      mode:
        this.ola.getCurrentMode() === OLA_MODES.DEFAULT
          ? OLA_MODES.VRACK_AGGREGATION
          : OLA_MODES.DEFAULT,
    };

    this.selectedInterfaces = [];
    this.notAllowedInterfaces = filter(
      this.interfaces,
      (item) => item.hasFailoverIps() || item.hasVrack(),
    );
    this.allowedInterfaces = this.interfaces.filter(
      (i) => !this.notAllowedInterfaces.includes(i),
    );
  }

  isGrouping() {
    return this.configuration.mode === OLA_MODES.VRACK_AGGREGATION;
  }

  isSelectionValid() {
    const selectableAmount = this.isGrouping() ? 2 : 1;
    return (
      !!this.selectedInterfaces.length &&
      this.selectedInterfaces.length === selectableAmount
    );
  }

  isModeDisabled(mode) {
    return this.ola.getCurrentMode() === mode;
  }

  hasObsoleteBandwithOption() {
    return this.specifications.bandwidth.type !== 'included';
  }

  onRowSelect(selectedRows) {
    this.selectedInterfaces = selectedRows;

    if (this.configuration.mode === OLA_MODES.DEFAULT) {
      this.networkInterfaces = flatten(
        map(this.selectedInterfaces, ({ mac }) => mac.split(',')),
      );
    }
  }

  configureInterface() {
    switch (this.configuration.mode) {
      case OLA_MODES.VRACK_AGGREGATION:
        return this.InterfaceService.setPrivateAggregation(
          this.serverName,
          this.configuration.name,
          this.selectedInterfaces,
        );
      case OLA_MODES.DEFAULT:
        return this.InterfaceService.setDefaultInterfaces(
          this.serverName,
          this.selectedInterfaces[0],
        );
      default:
        return this.$q.when();
    }
  }

  onFinish() {
    this.loading = true;
    this.atTrack('configure_ola');
    this.configureInterface()
      .then(() => {
        this.PhysicalInterface.v6().resetCache();
        this.VirtualInterface.v6().resetCache();
        if (this.isGrouping()) {
          return this.goBack({ configStep: 2 });
        }

        return this.goBack();
      })
      .catch((error) =>
        this.Alerter.error(
          this.$translate.instant('dedicated_server_interfaces_ola_error', {
            errorMessage: get(error, 'data.message'),
          }),
        ),
      );
  }
}
