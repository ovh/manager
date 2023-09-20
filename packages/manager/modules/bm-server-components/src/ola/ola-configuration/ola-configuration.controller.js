import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import map from 'lodash/map';

import { OLA_MODES } from '../ola.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $timeout,
    $translate,
    Alerter,
    ouiDatagridService,
    olaService,
    OvhApiDedicatedServerPhysicalInterface,
    OvhApiDedicatedServerVirtualInterface,
  ) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.olaService = olaService;
    this.PhysicalInterface = OvhApiDedicatedServerPhysicalInterface;
    this.VirtualInterface = OvhApiDedicatedServerVirtualInterface;
    this.ouiDatagridService = ouiDatagridService;
  }

  $onInit() {
    this.olaModes = Object.values(OLA_MODES);
    this.isLoading = false;

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

  selectAllRows() {
    const datagrid = get(
      this.ouiDatagridService,
      'datagrids.olaConfigDatagrid',
    );
    if (datagrid) {
      this.$timeout(() => {
        datagrid.toggleAllRowsSelection(true);
        datagrid.selectAllRows = true;
      });
    }
  }

  hasObsoleteBandwithOption() {
    return this.specifications.bandwidth.type !== 'included';
  }

  isInterfaceSelectionValid() {
    return [2, 4].includes(this.selectedInterfaces.length);
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
        return this.olaService.setPrivateAggregation(
          this.serverName,
          this.configuration.name,
          this.selectedInterfaces,
        );
      case OLA_MODES.DEFAULT:
        return this.olaService.setDefaultInterfaces(
          this.serverName,
          this.selectedInterfaces[0],
        );
      default:
        return this.$q.when();
    }
  }

  onFinish() {
    this.isLoading = true;
    this.atTrack(`${this.trackingPrefix}confirm`);
    return this.configureInterface()
      .then(() => {
        this.PhysicalInterface.v6().resetCache();
        this.VirtualInterface.v6().resetCache();
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

  cancel() {
    this.atTrack(`${this.trackingPrefix}cancel`);
    this.goBack();
  }
}
