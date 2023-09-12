export default class DedicatedServerInstallImageOptionsCtrl {
  $onInit() {
    [this.model.diskGroup] =
      this.server.hardware.specifications.diskGroups?.sort((a, b) =>
        a.description.localeCompare(b.description),
      ) || [];
  }
}
