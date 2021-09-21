class Application {
  constructor(iframeElement) {
    this.iframe = iframeElement;
    this.hashChangeListeners = [];
  }

  listenForChanges() {
    window.addEventListener(
      'message',
      ({ data }) => {
        switch (data.id) {
          case 'ovh-iframe-hashchange':
            this.onHashChange();
            break;
          default:
            break;
        }
      },
      true,
    );
  }

  getURL() {
    return new URL(this.iframe.contentWindow.location);
  }

  setURL(url) {
    this.iframe.contentWindow.location.replace(url);
  }

  getApplicationId() {
    return this.iframe.contentWindow.location.pathname.replace(/\//g, '');
  }

  getApplicationHash() {
    return this.iframe.contentWindow.location.hash.replace(/^[^/]+/, '');
  }

  getApplicationRouting() {
    return {
      applicationId: this.getApplicationId(),
      applicationHash: this.getApplicationHash(),
    };
  }

  addHashChangeListener(listener) {
    this.hashChangeListeners.push(listener);
  }

  onHashChange() {
    this.hashChangeListeners.forEach((listener) =>
      listener.call(undefined, { iframe: this }),
    );
  }

  updateRouting({ applicationId, applicationHash }) {
    const url = this.getURL();
    if (url.pathname !== `/${applicationId}/`) {
      url.pathname = `/${applicationId}/`;
    }
    if (url.hash !== `/${applicationHash}`) {
      url.hash = `/${applicationHash}`;
    }
    this.setURL(url);
  }
}

export default Application;
