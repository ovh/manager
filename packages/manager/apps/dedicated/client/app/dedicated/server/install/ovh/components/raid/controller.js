export default class DedicatedServerInstallOvhRaidCtrl {
  static createNumberList(length) {
    return Array(length)
      .fill(undefined)
      .map((value, index) => index + 1);
  }

  getDiskNumberList() {
    return DedicatedServerInstallOvhRaidCtrl.createNumberList(
      this.model.hardwareRaidController.disks.length,
    );
  }
}
