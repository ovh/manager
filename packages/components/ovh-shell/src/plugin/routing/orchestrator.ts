import RoutingConfiguration from './configuration';

interface ILocation {
  setURL(href: string): void;
  getURL(): URL;
}

class Orchestrator {
  iframe: ILocation;

  container: ILocation;

  config: RoutingConfiguration;

  onCrossOriginError: CallableFunction;

  constructor(
    config: RoutingConfiguration,
    iframe: ILocation,
    container: ILocation,
  ) {
    this.iframe = iframe;
    this.container = container;
    this.config = config;
    this.onCrossOriginError = (error: Error) => {
      throw error;
    };
  }

  static create(
    config: RoutingConfiguration,
    iframeWindow: Window,
    containerWindow: Window,
  ): Orchestrator {
    return new Orchestrator(
      config,
      {
        setURL: (href) => iframeWindow.location.replace(href),
        getURL: () => new URL(iframeWindow.location.href),
      },
      {
        setURL: (href) => containerWindow.location.replace(href),
        getURL: () => new URL(containerWindow.location.href),
      },
    );
  }

  setCrossOriginErrorHandler(handler: CallableFunction) {
    this.onCrossOriginError = handler;
  }

  /**
   * @returns {URL} The iframe current URL
   */
  getIFrameURL() {
    try {
      return this.iframe.getURL();
    } catch (error) {
      this.onCrossOriginError(error);
      return null;
    }
  }

  setIFrameURL(href: string) {
    try {
      this.iframe.setURL(href);
    } catch (error) {
      this.onCrossOriginError(error);
    }
  }

  /**
   * Update the iframe URL to match the container URL.
   * If the application is standalone, instead redirect to the application.
   * If the application is unknown, instead redirect to the default application.
   */
  updateIframeURL() {
    const { appId, appHash, appURL } = this.parseContainerURL();
    if (appURL) {
      if (appURL.href !== this.getIFrameURL().href) {
        this.setIFrameURL(appURL.href);
      }
    } else {
      const redirection = this.config.findRedirection(appId);
      if (redirection) {
        const target = new URL(redirection.href);
        target.hash = appHash;
        this.container.setURL(target.href);
      } else {
        this.redirectToContainerHome();
      }
    }
  }

  /**
   * Update the container URL to match the iframe URL.
   * If the parsing of iframe URL fails (either invalid URL or the application
   * is not registered) set the container URL to the default application.
   */
  updateContainerURL() {
    const containerURL = this.container.getURL();
    const { containerURL: updatedContainerURL } = this.parseIframeURL();

    if (updatedContainerURL) {
      if (containerURL.href !== updatedContainerURL.href) {
        this.container.setURL(updatedContainerURL.href);
      }
    } else {
      this.redirectToContainerHome();
    }
  }

  /**
   * Change the container URL to the home page (default application)
   */
  redirectToContainerHome() {
    const defaultAppId = this.config.getDefault()?.id;
    if (defaultAppId) {
      const defaultContainerURL = this.container.getURL();
      defaultContainerURL.hash = `#/${defaultAppId}/`;
      this.container.setURL(defaultContainerURL.href);
    }
  }

  /**
   * Parse the iframe's URL :
   * @returns {Object} routing The parsed routing configuration.
   * @returns {string} routing.id The application's id.
   * @returns {string} routing.path The application's path.
   * @returns {string} routing.hash The application's internal routing hash.
   * @returns {string} routing.appURL The iframe current absolute URL.
   * @returns {string} routing.containerURL The container URL corresponding to the iframe URL.
   */
  parseIframeURL() {
    const appURL = this.getIFrameURL();
    const appConfig = this.config.findByPath(appURL.pathname);
    const appId = appConfig?.id;
    const appPath = appConfig?.path;
    const appHash = appURL.hash || '#/';
    const containerURL = this.container.getURL();
    if (appConfig) {
      // prepend the application id to the container hash
      const updatedContainerHash = appHash.replace(/^#\/?/, `#/${appId}/`);
      containerURL.hash = updatedContainerHash;
    }
    return {
      appId,
      appPath,
      appHash,
      appURL,
      containerURL: appConfig ? containerURL : null,
    };
  }

  /**
   * Parse the container's URL :
   * @returns {Object} routing The parsed routing configuration.
   * @returns {string} routing.id The application's id.
   * @returns {string} routing.path The application's path.
   * @returns {string} routing.hash The application's internal routing hash.
   * @returns {string} routing.appURL The iframe URL corresponding to the container URL.
   * @returns {string} routing.containerURL The container current absolute URL.
   */
  parseContainerURL() {
    const containerURL = this.container.getURL();
    const hash = containerURL.hash || '';
    // first hash part is the application's id
    const appId = (hash.match(/#\/?([^/]+)/) || [])[1];
    const appPath = this.config.findById(appId)?.path;
    // rest of the hash is the iframe's hash
    const appHash = (hash.match(/#\/?[^/]+(\/.+)/) || [])[1] || '#/';
    const appURL = new URL(this.container.getURL().origin);
    appURL.pathname = appPath;
    appURL.hash = appHash;
    return {
      appId,
      appPath,
      appHash,
      appURL: appPath ? appURL : null,
      containerURL,
    };
  }
}

export default Orchestrator;
export { ILocation, Orchestrator };
