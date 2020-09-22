import { GUIDE_URL } from '../../training.constants';

export default class PciTrainingInstallController {
  $onInit() {
    this.guideUrl = GUIDE_URL;
    [this.currentRegion] = this.regions;
    this.osInstall = {
      'Linux / Mac OS': `curl ${this.currentRegion.cliInstallUrl} | sh`,
    };
    this.documentationLink = this.currentRegion.documentationUrl;
  }
}
