import OvhMicroFrontend from './application/micro-frontend.class';
import OvhFragment from './application/fragment.web-component';

export default () => {
  if (!window.ovhMicroFrontend) {
    window.ovhMicroFrontend = new OvhMicroFrontend();
    window.ovhMicroFrontend.init();
  }

  if (!window.customElements.get('ovh-fragment')) {
    window.customElements.define('ovh-fragment', OvhFragment);
  }
};
