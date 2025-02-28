import {
  NODE_STATUS,
  SERVICE_STATES,
  DEFAULT_OS_NODE_NUTANIX,
} from './constants';

export default class Node {
  constructor({ ahvIp, cvmIp, server, status, os, ...extraInformation }) {
    Object.assign(this, {
      ahvIp,
      cvmIp,
      server,
      os,
      ...extraInformation,
    });

    this.status = NODE_STATUS[status] ?? NODE_STATUS.UNKNOWN;
  }

  get isTerminated() {
    return this.serviceStatus === SERVICE_STATES.SUSPENDED;
  }

  get isError() {
    return [
      NODE_STATUS.DEPLOY_FAILURE,
      NODE_STATUS.UNDEPLOY_FAILURE,
      NODE_STATUS.UNDEPLOY_CANCELLED,
      NODE_STATUS.DEPLOY_CANCELLED,
    ].includes(this.status);
  }

  get isDeployed() {
    return (
      this.status === NODE_STATUS.DEPLOYED &&
      !this.os.startsWith(DEFAULT_OS_NODE_NUTANIX.split('_')[0])
    );
  }

  get isWaitForConfigure() {
    return !this.isTerminated && !this.isDeployed;
  }
}
