import ConnectorConfiguration from './connectorConfiguration.class';

export default class AvailableConnector {
  constructor({ author, documentationUrl, id, name, preview, type, version }) {
    this.updateData({
      author,
      documentationUrl,
      id,
      name,
      preview,
      type,
      version,
    });
  }

  updateData({ author, documentationUrl, id, name, preview, type, version }) {
    Object.assign(this, {
      author,
      documentationUrl,
      id,
      name,
      preview,
      type,
      version,
    });
  }

  setConfiguration(configuration) {
    // add static tab to confuguration
    configuration.push({
      defaultValue: '',
      description: 'Additional configuration',
      displayName: 'Additional configuration',
      group: 'Extra',
      importance: 'low',
      name: 'Additional configuration',
      required: false,
      type: 'map',
    });

    this.configuration = new ConnectorConfiguration(configuration);
  }
}
