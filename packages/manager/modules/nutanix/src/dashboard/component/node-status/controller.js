import { NODE_STATUS } from '../../../constants';

export default class {
  /* @ngInject */
  constructor() {
    this.NODE_STATUS = NODE_STATUS;
  }

  get isInstallationError() {
    return [
      this.NODE_STATUS.DEPLOY_FAILURE,
      this.NODE_STATUS.UNDEPLOY_FAILURE,
    ].includes(this.status);
  }

  get isNotInstalled() {
    return [
      this.NODE_STATUS.UNDEPLOYED,
      this.NODE_STATUS.DEPLOYING,
      this.NODE_STATUS.DEPLOY_CANCELLED,
    ].includes(this.status);
  }
}
