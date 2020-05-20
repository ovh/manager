import 'script-loader!jquery'; // eslint-disable-line
import 'whatwg-fetch';
import Postmate from 'postmate';
import {
  attach as attachPreloader,
  detach as detachPreloader,
} from '@ovh-ux/manager-preloader';
import { bootstrapApplication } from '@ovh-ux/manager-core';
import { messages } from '@ovh-ux/ovh-uapp';

attachPreloader();

/**
 * Async load the application
 */
const deferredApplication = new Promise((resolve) => {
  bootstrapApplication().then(({ region }) => {
    import(`./config-${region}`)
      .catch(() => {})
      .then(() => import('./app.module'))
      .then(({ default: application }) => {
        resolve(
          angular.bootstrap(document.body, [application], {
            strictDi: true,
          }),
        );
        detachPreloader();
      });
  });
});

/**
 * Construct micro application URL
 */
const uappURL =
  __DEV_ROOT__ === 'undefined'
    ? new URL(`${window.location.origin}${__APP_ROOT__}`)
    : new URL(__DEV_ROOT__);

uappURL.hash =
  __DEV_ROOT__ === 'undefined' ? window.location.hash : uappURL.hash;

/**
 * Initialize the micro-application iframe
 */
const handshake = new Postmate({
  container: document.getElementsByClassName('hub-main-view')[0],
  url: uappURL.href,
  name: 'manager',
  classListArray: ['w-100', 'h-100', 'd-block', 'border-0'],
});

/**
 * Once iframe is ready, implements callbacks for micro-application events
 */
handshake.then((child) => {
  window.addEventListener('hashchange', () => {
    child.call('updateHash', window.location.hash);
  });

  child.on(messages.hashChange, (hash) => {
    window.history.replaceState(null, '', hash);
  });

  child.on(messages.sessionSwitch, () =>
    deferredApplication.then((app) =>
      app.get('ssoAuthentication').handleSwitchSession(),
    ),
  );

  child.on(messages.login, (url) =>
    deferredApplication.then((app) =>
      app.get('ssoAuthentication').goToLoginPage(url),
    ),
  );

  child.on(messages.logout, () =>
    deferredApplication.then((app) => app.get('ssoAuthentication').logout()),
  );
});
