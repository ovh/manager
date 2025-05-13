import find from 'lodash/find';
import { STATUS } from './cloud-connect.constants';

export default class CloudConnectInterface {
  constructor({
    id,
    incomingLightStatus,
    lightLastUpdate,
    outgoingLightStatus,
    status,
    enabling,
  }) {
    Object.assign(this, {
      id,
      incomingLightStatus,
      lightLastUpdate,
      outgoingLightStatus,
      status,
      enabling,
    });
    this.localeLightLastUpdate = moment(
      this.lightLastUpdate,
      'YYYY/MM/DD',
    ).format('LL');
  }

  setEnabling(enabling) {
    this.enabling = enabling;
  }

  setDisabling(disabling) {
    this.disabling = disabling;
  }

  isInProcess() {
    return this.enabling || this.disabling;
  }

  isEnabled() {
    return this.status === STATUS.ENABLED;
  }

  disable() {
    this.status = STATUS.DISABLED;
    this.disabling = false;
  }

  enable() {
    this.status = STATUS.ENABLED;
    this.enabling = false;
  }

  isOutgoingLightStatusUp() {
    return this.outgoingLightStatus === STATUS.UP;
  }

  isOutgoingLightStatusDown() {
    return this.outgoingLightStatus === STATUS.DOWN;
  }

  isOutgoingLightStatusUnknown() {
    return !this.isOutgoingLightStatusUp() && !this.isOutgoingLightStatusDown();
  }

  isIncomingLightStatusUp() {
    return this.incomingLightStatus === STATUS.UP;
  }

  isIncomingLightStatusDown() {
    return this.incomingLightStatus === STATUS.DOWN;
  }

  isIncomingLightStatusUnknown() {
    return !this.isIncomingLightStatusUp() && !this.isIncomingLightStatusDown();
  }

  isTaskPending(tasks) {
    return find(
      tasks,
      (task) =>
        task.resourceId === this.id &&
        (task.status === STATUS.TODO || task.status === STATUS.DOING),
    );
  }
}
