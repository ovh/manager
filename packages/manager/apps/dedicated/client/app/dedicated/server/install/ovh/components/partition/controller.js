export default class DedicatedServerInstallOvhPartitionCtrl {
  get partition() {
    return this.model.partition;
  }

  getTotalSize() {
    if (this.model.template.raidController !== null) {
    }
  }

  $onInit() {
    console.log(this.model);
    console.log(this.server);
  }
}
