// import ConnectorConfiguration from './connectorConfiguration.class';

export default class Connector {
  constructor({ id, connectorId, name, configuration }) {
    this.updateData({ id, connectorId, name, configuration });
  }

  updateData({ id, connectorId, name, configuration }) {
    Object.assign(this, { id, connectorId, name, configuration });
  }

  setConnectorInfofmation(connectorInformation) {
    this.connectorInformation = connectorInformation;
  }
}
