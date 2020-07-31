import { GUIDE_URL } from '../training.constants';

export default class PciTrainingInstallController {
  $onInit() {
    this.guideUrl = GUIDE_URL;
    this.osInstall = {
      Linux:
        'curl https://console.gra.training.ai.cloud.ovh.net/cli/install | sh',
      'Mac OS':
        'curl https://console.gra.training.ai.cloud.ovh.net/cli/install | sh',
      Windows:
        'curl https://console.gra.training.ai.cloud.ovh.net/cli/install | sh',
    };
  }
}
