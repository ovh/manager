import '@webcomponents/webcomponentsjs/webcomponents-loader';
import OvhMicroFrontend from './application/micro-frontend.class';
import OvhFragment from './application/fragment.web-component';

export default function registerApplication() {
  return new Promise((resolve, reject) => {
    window.WebComponents.waitFor(() => {
      if (!window.ovhMicroFrontend) {
        window.ovhMicroFrontend = new OvhMicroFrontend();
        window.ovhMicroFrontend
          .init()
          .then((config) => resolve(config))
          .catch(reject);
      }

      if (!window.customElements.get('ovh-fragment')) {
        window.customElements.define('ovh-fragment', OvhFragment);
      }
    });
  });
}
