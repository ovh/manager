import {
  DEPLOYMENT_MODE_CHIP_CLASS,
  DEPLOYMENT_MODE_CHIP_LABEL,
} from './deployment-mode.constant';
import { DEPLOYMENT_MODES_URL } from '../../../projects/project/project.constants';

export default class DeploymentModeController {
  /* @ngInject */
  constructor(PciProjectDeploymentMode, coreConfig) {
    this.PciProjectDeploymentMode = PciProjectDeploymentMode;
    const { ovhSubsidiary } = coreConfig.getUser();
    this.deploymentModeUrl =
      DEPLOYMENT_MODES_URL[ovhSubsidiary] || DEPLOYMENT_MODES_URL.DEFAULT;
  }

  $onInit() {
    this.deploymentMode = null;
    this.isLoading = true;
    this.deploymentModes = null;

    this.load();
  }

  load() {
    this.isLoading = true;
    this.PciProjectDeploymentMode.getFeaturedDeploymentModes().then(
      (deploymentModes) => {
        this.deploymentModes = deploymentModes.map((d) => ({
          ...d,
          className: DEPLOYMENT_MODE_CHIP_CLASS[d.name],
          chipLabel: DEPLOYMENT_MODE_CHIP_LABEL[d.name],
        }));
        this.isLoading = false;
      },
    );
  }
}
