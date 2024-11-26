import { NODE_STATUS } from './constants';

export default class Node {
  constructor({ ahvIp, cvmIp, server, status }) {
    Object.assign(this, {
      ahvIp,
      cvmIp,
      server,
    });

    this.status = NODE_STATUS[status] ?? NODE_STATUS.UNKNOWN;
  }

  get isDeployed() {
    return this.status === NODE_STATUS.DEPLOYED;
  }

  get isWaitForConfigure() {
    return [NODE_STATUS.UNKNOWN, NODE_STATUS.UNDEPLOYED].includes(this.status);
  }
}
