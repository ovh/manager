import RoutingConfiguration from './configuration';

class Application {
  iframe: HTMLIFrameElement;

  config: RoutingConfiguration;

  constructor(iframeElement: HTMLIFrameElement, config: RoutingConfiguration) {
    this.iframe = iframeElement;
    this.config = config;
  }

  getURL(): URL {
    return new URL(this.iframe.contentWindow.location.href);
  }

  setURL(url: string) {
    this.iframe.contentWindow.location.replace(url);
  }

  getApplicationId(): string {
    const path = this.getApplicationPath();
    const appConfig = this.config.findByPath(path);
    if (!appConfig) {
      throw new Error(
        `Cannot find configuration for application with path '${path}'`,
      );
    }
    return appConfig.id;
  }

  getApplicationHash(): string {
    return this.iframe.contentWindow.location.hash.replace(/^[^/]+/, '');
  }

  getApplicationPath(): string {
    return this.iframe.contentWindow.location.pathname || '/';
  }

  getApplicationRouting(): Record<string, string> {
    return {
      applicationId: this.getApplicationId(),
      applicationHash: this.getApplicationHash(),
      applicationPath: this.getApplicationPath(),
    };
  }

  updateURL(
    url: URL,
    applicationId: string,
    applicationHash: string,
    currentAppPath: string,
  ): URL {
    let newURL = url;
    if (newURL.pathname === 'blank') {
      newURL = new URL(window.location.href);
    }
    const config = this.config.findById(applicationId);
    if (!config) {
      throw new Error(
        `Cannot find configuration for application with id '${applicationId}'`,
      );
    }
    // check for path equality before updating otherwise '/foo' would be updated
    // by '/foo/' and would trigger full page reload in the application
    newURL.pathname = this.config.pathEquals(currentAppPath, config.path)
      ? currentAppPath
      : config.path;
    newURL.hash = `/${applicationHash}`;

    return newURL;
  }

  updateRouting({
    applicationId,
    applicationHash,
  }: {
    applicationId: string;
    applicationHash: string;
  }) {
    const currentAppPath = this.getApplicationPath();
    const url = this.updateURL(
      this.getURL(),
      applicationId,
      applicationHash,
      currentAppPath,
    );
    this.setURL(url.href);
  }
}

export default Application;
