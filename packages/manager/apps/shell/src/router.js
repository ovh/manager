// remove trailing slashes from given string
function trimEndSlash(s) {
  return s && s.replace(/\/+$/, '');
}

// remove the hash prefix from a given hash string
function trimHashPrefix(s) {
  return s && s.replace(/^[^/]+/, '');
}

function pathCompare(a, b) {
  return trimEndSlash(a || '/') === trimEndSlash(b || '/');
}

function hashCompare(a, b) {
  return trimHashPrefix(a || '/') === trimHashPrefix(b || '/');
}

const initRouter = (iframe, hashPrefix = '#') => {
  // listen for incoming message from iframe
  window.addEventListener(
    'message',
    ({ data }) => {
      switch (data.id) {
        case 'ovh-iframe-hashchange': {
          if (!data.hash) return;
          if (!data.path) return;
          const hash = trimHashPrefix(data.hash);
          const appPath = trimEndSlash(data.path);
          window.location.replace(`${hashPrefix}${appPath}${hash}`);
          break;
        }
        default:
          break;
      }
    },
    true,
  );

  // when hash changes, update iframe url
  function onHashChange() {
    const { hash } = window.location;
    const iframeURL = new URL(iframe.contentWindow.location);

    // application's path extracted from shell's hash
    // const path = (hash.match(/#(\/[^/]+)/) || '')[1];
    const path = (hash.match(new RegExp(`${hashPrefix}(\\/[^/]+)`)) || '')[1];

    // application's hash extracted from shell's hash
    // const iframeHash = hash.replace(/#\/[^/]+/, '');
    const iframeHash = hash.replace(new RegExp(`${hashPrefix}\\/[^/]+`), '');

    // check if application's path needs to be updated
    if (pathCompare(iframeURL.pathname, path) === false) {
      iframeURL.pathname = path.replace(/([^/])$/, '$1/');
    }

    // check if application's hash needs to be updated
    if (hashCompare(iframeURL.hash, iframeHash) === false) {
      iframeURL.hash = iframeHash;
    }

    // update iframe's url
    iframe.contentWindow.location.replace(iframeURL);
  }

  window.addEventListener('hashchange', onHashChange);

  // initialize the hash to the starting application
  const url = new URL(window.location);
  if (hashCompare(url.hash, '')) {
    if (window.location.hostname === 'localhost') {
      url.hash = '/app';
    } else {
      url.hash = '/hub/';
    }
    window.location.replace(url);
  }

  // update iframe at startup
  onHashChange();
};

export default initRouter;
