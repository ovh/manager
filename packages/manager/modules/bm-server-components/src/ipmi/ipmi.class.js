export default class BmServerComponentsIpmi {
  constructor(server, features, urlkvm) {
    this.server = server;
    this.model = features;
    this.features = features;
    this.urlkvm = urlkvm;
    this.server.urlkvm = urlkvm;
  }

  isActivated() {
    return this.features.activated;
  }

  isSerialOverLanSshKeySupported() {
    return this.features.supportedFeatures?.serialOverLanSshKey;
  }

  isSerialOverLanUrlSupported() {
    return this.features.supportedFeatures?.serialOverLanURL;
  }

  isKvmIpJnlpSupported() {
    return this.features.supportedFeatures?.kvmipJnlp;
  }

  isKvmIpHtml5UrlSupported() {
    return this.features.supportedFeatures?.kvmipHtml5URL;
  }
}
