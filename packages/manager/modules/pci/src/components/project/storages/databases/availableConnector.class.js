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

  setConfiguration(configuration, transformConfiguration) {
    this.configuration = new ConnectorConfiguration(
      configuration,
      transformConfiguration,
    );
  }
}
