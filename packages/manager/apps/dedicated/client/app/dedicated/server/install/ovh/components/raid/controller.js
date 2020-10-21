export default class DedicatedServerInstallOvhRaidCtrl {
  constructor() {
    this.lists = {
      modes: null,
      diskNumbers: null,
      clusters: null,
    };
  }

  get raid() {
    return this.model.raid;
  }

  getModeList() {
    this.lists.modes = this.raid.controller.getAvailableRaids();

    return this.lists.modes;
  }

  getDiskNumberList() {
    this.lists.diskNumbers = [];
    console.log(this.raid);

    for (
      let i = this.raid.getMinDisk();
      i < this.raid.controller.numberOfDisk + 1;
      i += this.raid.getMinDiskPerCluster()
    ) {
      this.lists.diskNumbers.push(i);
    }

    return this.lists.diskNumbers;
  }

  getClusterList() {
    if (this.raid.isMutipleCluster()) {
      this.lists.clusters = [];

      for (
        let i = this.raid.getMinCluster();
        i < this.raid.getMaxCluster();
        i += 1
      ) {
        if (this.raid.diskNumber % i === 0) {
          this.lists.clusters.push(i);
        }
      }
    } else {
      this.lists.clusters = [1];
    }

    return this.lists.clusters;
  }

  /*= =============================
  =            Events            =
  ============================== */

  onControllerChange() {
    this.initMode();
  }

  onModeChange() {
    this.initDiskNumber();
    this.initCluster();
  }

  /*= ====  End of Events  ====== */

  /*= =====================================
  =            Initialization            =
  ====================================== */

  initMode() {
    this.getModeList();
    this.raid.mode = this.model.template.diskGroup.defaultHardwareRaidType;
  }

  initDiskNumber() {
    this.getDiskNumberList();
    [this.raid.diskNumber] = this.lists.diskNumbers;
  }

  initCluster() {
    this.getClusterList();
    [this.raid.cluster] = this.lists.clusters;
  }

  $onInit() {
    [this.raid.controller] = this.server.hardware.raidProfile.controllers;
    this.initMode();
    this.initDiskNumber();
    this.initCluster();
  }

  /*= ====  End of Initialization  ====== */
}
