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

  getApplicationId(): string | undefined {
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

  updateRouting({
    applicationId,
    applicationHash,
  }: {
    applicationId: string;
    applicationHash: string;
  }) {
    let url = this.getURL();
    if (url.pathname === 'blank') {
      url = new URL(window.location.href);
    }
    const config = this.config.findById(applicationId);
    if (!config) {
      throw new Error(
        `Cannot find configuration for application with id '${applicationId}'`,
      );
    }
    const currentAppPath = this.getApplicationPath();
    // check for path equality before updating otherwise '/foo' would be updated
    // by '/foo/' and would trigger full page reload in the application
    url.pathname = this.config.pathEquals(currentAppPath, config.path)
      ? currentAppPath
      : config.path;
    url.hash = `/${applicationHash}`;
    this.setURL(url.href);
  }
}

export default Application;
