export default class IntegrationCapability {
  constructor({ destinationEngine, sourceEngine, type, parameters }) {
    this.updateData({
      destinationEngine,
      sourceEngine,
      type,
      parameters,
    });
  }

  updateData({ destinationEngine, sourceEngine, type, parameters }) {
    Object.assign(this, {
      destinationEngine,
      sourceEngine,
      type,
      parameters: parameters || [],
    });
  }
}
