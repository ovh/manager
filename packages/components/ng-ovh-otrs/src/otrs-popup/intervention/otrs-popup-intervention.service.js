import assign from 'lodash/assign';
import includes from 'lodash/includes';
import some from 'lodash/some';

export default class OtrsPopupInterventionService {
  constructor($q, OvhApiDedicatedServer) {
    'ngInject';

    this.$q = $q;
    this.OvhApiDedicatedServer = OvhApiDedicatedServer;
  }

  getServerInfo(serviceName) {
    return this.OvhApiDedicatedServer.v6().get({
      serverName: serviceName,
    }).$promise;
  }

  getHardwareInfo(serviceName) {
    return this.OvhApiDedicatedServer.v6().getHardware({
      serverName: serviceName,
    }).$promise;
  }

  static canHotSwap(serverInfo, hardwareInfo) {
    return serverInfo.commercialRange.toUpperCase() === 'HG' && includes(['2U', '4U'], hardwareInfo.formFactor.toUpperCase());
  }

  static hasMegaRaidCard(hardwareInfo) {
    return some(hardwareInfo.diskGroups, { raidController: 'MegaRaid' });
  }

  static slotInfo(serverInfo, hardwareInfo) {
    const canUseSlotId = serverInfo.commercialRange.toUpperCase() === 'HG';
    const slotsCount = hardwareInfo.formFactor && hardwareInfo.formFactor.toUpperCase() === '4U' ? 24 : 12;

    return {
      canUseSlotId,
      slotsCount,
    };
  }

  sendDiskReplacement(serviceName, disk) {
    const diskToSend = assign({}, disk);

    if (!diskToSend.comment) {
      diskToSend.comment = 'No message';
    }

    return this.OvhApiDedicatedServer.v6().askHardDiskDriveReplacement({
      serverName: serviceName,
    }, {
      comment: diskToSend.comment,
      disks: diskToSend.disks,
      inverse: diskToSend.inverse,
    }).$promise;
  }

  getServerInterventionInfo(serviceName) {
    return this.$q.all({
      serverInfo: this.getServerInfo(serviceName),
      hardwareInfo: this.getHardwareInfo(serviceName),
    })
      .then(results => ({
        canHotSwap: this.constructor.canHotSwap(results.serverInfo, results.hardwareInfo),
        hasMegaRaid: this.constructor.hasMegaRaidCard(results.hardwareInfo),
        slotInfo: this.constructor.slotInfo(results.serverInfo, results.hardwareInfo),
      }));
  }
}
