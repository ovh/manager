function initIframeApplication(environment) {
  window.addEventListener('hashchange', () => {
    window.parent.postMessage({
      id: 'ovh-iframe-hashchange',
      environment,
      hash: window.location.hash,
      path: window.location.pathname,
    });
  });
}

export default initIframeApplication;
