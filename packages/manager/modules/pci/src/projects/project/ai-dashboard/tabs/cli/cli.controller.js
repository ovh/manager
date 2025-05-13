export default class AiDashboardCliCtrl {
  $onInit() {
    [this.currentRegion] = this.regions;
    this.cliBashCmd = `curl -s https://cli.${this.currentRegion.id}.training.ai.cloud.ovh.net/install.sh | bash`;
  }

  onRegionChange() {
    this.cliBashCmd = `curl -s https://cli.${this.currentRegion.id}.training.ai.cloud.ovh.net/install.sh | bash`;
  }
}
