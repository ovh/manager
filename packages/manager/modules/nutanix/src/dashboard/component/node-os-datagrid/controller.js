import {
  NODE_STATUS,
  SERVICE_STATES,
  NODE_POWER_STATES,
} from '../../../constants';

export default class {
  /* @ngInject */
  constructor() {
    this.NODE_STATUS = NODE_STATUS;
  }

  isPowerOff() {
    return this.powerState === NODE_POWER_STATES.POWEROFF;
  }

  isSuspended() {
    return this.serviceStatus === SERVICE_STATES.SUSPENDED;
  }

  isInstallationError() {
    return [
      this.NODE_STATUS.DEPLOY_FAILURE,
      this.NODE_STATUS.UNDEPLOY_FAILURE,
    ].includes(this.status);
  }

  isNotInstalled() {
    return (
      [
        this.NODE_STATUS.UNDEPLOYED,
        this.NODE_STATUS.DEPLOYING,
        this.NODE_STATUS.DEPLOY_CANCELLED,
      ].includes(this.status) ||
      this.isPowerOff() ||
      this.isSuspended()
    );
  }
}
