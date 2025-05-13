import ConnectorConfiguration from './connectorConfiguration.class';

export default class AvailableConnector {
  constructor({
    author,
    documentationUrl,
    id,
    name,
    preview,
    type,
    version,
    latest,
  }) {
    this.updateData({
      author,
      documentationUrl,
      id,
      name,
      preview,
      type,
      version,
      latest,
    });
  }

  updateData({
    author,
    documentationUrl,
    id,
    name,
    preview,
    type,
    version,
    latest,
  }) {
    Object.assign(this, {
      author,
      documentationUrl,
      id,
      name,
      preview,
      type,
      version,
      latest,
    });
  }

  setConfiguration(configuration, transformConfiguration) {
    this.configuration = new ConnectorConfiguration(
      configuration,
      transformConfiguration,
    );
  }
}
