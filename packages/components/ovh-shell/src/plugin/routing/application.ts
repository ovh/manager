class Application {
  iframe: HTMLIFrameElement;

  constructor(iframeElement: HTMLIFrameElement) {
    this.iframe = iframeElement;
  }

  getURL(): URL {
    return new URL(this.iframe.contentWindow.location.href);
  }

  setURL(url: string) {
    this.iframe.contentWindow.location.replace(url);
  }

  getApplicationId(): string {
    return this.iframe.contentWindow.location.pathname.replace(/\//g, '');
  }

  getApplicationHash(): string {
    return this.iframe.contentWindow.location.hash.replace(/^[^/]+/, '');
  }

  getApplicationRouting(): Record<string, string> {
    return {
      applicationId: this.getApplicationId(),
      applicationHash: this.getApplicationHash(),
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
    if (url.pathname !== `/${applicationId}/`) {
      url.pathname = `/${applicationId}/`;
    }
    if (url.hash !== `/${applicationHash}`) {
      url.hash = `/${applicationHash}`;
    }
    this.setURL(url.href);
  }
}

export default Application;
