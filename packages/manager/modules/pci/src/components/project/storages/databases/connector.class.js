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

  getFailedTasks() {
    return this.tasks.filter((task) => task.status === 'FAILED');
  }

  isPaused() {
    return this.status === 'PAUSED';
  }
}
