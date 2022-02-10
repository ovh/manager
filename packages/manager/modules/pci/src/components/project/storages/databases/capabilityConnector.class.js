export default class CapabilityConnector {
  constructor({ author, documentationURL, id, name, preview, type, version }) {
    this.updateData({
      author,
      documentationURL,
      id,
      name,
      preview,
      type,
      version,
    });
  }

  updateData({ author, documentationURL, id, name, preview, type, version }) {
    Object.assign(this, {
      author,
      documentationURL,
      id,
      name,
      preview,
      type,
      version,
    });
  }

  setConfiguration(configuration) {
    this.configuration = configuration;
  }
}
