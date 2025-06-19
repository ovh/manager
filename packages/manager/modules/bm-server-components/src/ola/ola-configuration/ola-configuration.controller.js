import get from 'lodash/get';

import { OLA_MODES, OLA_PREVIEW_ID } from '../ola.constants';

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

    this.configurationName = undefined;
    this.targetInterfaceType = OLA_MODES.VRACK_AGGREGATION;

    this.notAllowedInterfaces = this.interfaces.filter(
      (item) => item.hasFailoverIps() || item.hasVrack(),
    );

    this.displayedInterfaces = this.interfaces.map((nic) => ({
      id: nic.id,
      name: nic.name,
      type: nic.type,
      mac: nic.mac,
      displayedMacAdresses: nic.displayedMacAdresses,
      uploadBandwidth: nic.isPublic()
        ? this.specifications.bandwidth.OvhToInternet
        : this.specifications.vrack.bandwidth,
      downloadBandwidth: nic.isPublic()
        ? this.specifications.connection
        : this.specifications.vrack.bandwidth,
    }));

    const hasExistingVrackAggregation = this.interfaces.some(
      (nic) => nic.type === OLA_MODES.VRACK_AGGREGATION,
    );
    const previewBandwidth = hasExistingVrackAggregation
      ? {
          ...this.specifications.vrack.bandwidth,
          value: this.specifications.vrack.bandwidth.value * 2,
        }
      : this.specifications.vrack.bandwidth;

    this.previewAggregatedInterfaces = [
      {
        id: OLA_PREVIEW_ID,
        name: OLA_PREVIEW_ID,
        type: OLA_MODES.VRACK_AGGREGATION,
        displayedMacAdresses: this.interfaces.reduce(
          (adresses, nic) => adresses.concat(nic.displayedMacAdresses),
          [],
        ),
        uploadBandwidth: previewBandwidth,
        downloadBandwidth: previewBandwidth,
      },
    ];

    this.hasObsoleteBandwithOption =
      this.specifications.bandwidth.type !== 'included';
  }

  isAggregationValid() {
    return this.notAllowedInterfaces.length === 0;
  }

  configureInterface() {
    if (this.ola.getCurrentMode() !== OLA_MODES.VRACK_AGGREGATION) {
      return this.olaService.setPrivateAggregation(
        this.serverName,
        this.configurationName,
        this.interfaces,
      );
    }
    return this.olaService.setDefaultInterfaces(
      this.serverName,
      this.interfaces[0],
    );
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
