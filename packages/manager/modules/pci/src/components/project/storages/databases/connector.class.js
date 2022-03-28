import { CONNECTOR_STATUS, TASK_STATUS } from './connectors.constants';

export default class Connector {
  constructor({ id, connectorId, name, status, configuration }) {
    this.updateData({ id, connectorId, name, status, configuration });
    this.tasks = [];
  }

  updateData({ id, connectorId, name, status, configuration }) {
    Object.assign(this, { id, connectorId, name, status, configuration });
  }

  setConnectorInfofmation(connectorInformation) {
    this.connectorInformation = connectorInformation;
  }

  setTasks(tasks) {
    this.tasks = tasks;
  }

  getSucceededTasks() {
    return this.tasks.filter((task) => task.status === TASK_STATUS.RUNNING);
  }

  getFailedTasks() {
    return this.tasks.filter((task) => task.status === TASK_STATUS.FAILED);
  }

  isPaused() {
    return this.status === CONNECTOR_STATUS.PAUSED;
  }

  isCreating() {
    return this.status === CONNECTOR_STATUS.CREATING;
  }

  isError() {
    return this.status === CONNECTOR_STATUS.FAILED;
  }
}
