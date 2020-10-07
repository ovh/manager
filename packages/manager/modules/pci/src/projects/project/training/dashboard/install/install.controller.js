import { GUIDE_URL } from '../../training.constants';

export default class PciTrainingInstallController {
  $onInit() {
    this.guideUrl = GUIDE_URL;
    [this.currentRegion] = this.regions;
    this.osInstall = {
      Linux: `${this.currentRegion.cliInstallUrl}/ovhai-linux.zip`,
      'Mac OS': `${this.currentRegion.cliInstallUrl}/ovhai-darwin.zip`,
      Windows: `${this.currentRegion.cliInstallUrl}/ovhai-windows.zip`,
    };
    this.documentationLink = this.currentRegion.documentationUrl;
  }
}
