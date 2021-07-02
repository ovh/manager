export default class BmServerComponentsOsInstallImageOptionsCtrl {
  $onInit() {
    [this.model.diskGroup] = this.server.hardware.specifications.diskGroups;
  }
}
