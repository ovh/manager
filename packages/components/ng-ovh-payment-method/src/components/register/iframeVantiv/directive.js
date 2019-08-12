import controller from './controller';
import {
  VANTIV_IFRAME_CONFIGURATION,
  VANTIV_SCRIPT,
} from './constants';

const directiveName = 'ovhPaymentMethodRegisterIframeVantiv';

export default {
  name: directiveName,
  require: {
    vantivIframeCtrl: directiveName,
    registerCtrl: '^ovhPaymentMethodRegister',
  },
  controller,
  controllerAs: '$ctrl',
  bindToController: true,
  template: `<div id="${VANTIV_IFRAME_CONFIGURATION.div}"></div>`,
  link: (scope, iElement, iAttributes, iControllers) => {
    // add vantiv script to document body
    // first check if script has already been added
    if (!document.getElementById(VANTIV_SCRIPT.id)) {
      const script = document.createElement('script');

      script.setAttribute('src', VANTIV_SCRIPT.src);
      script.setAttribute('id', VANTIV_SCRIPT.id);
      script.setAttribute('type', 'text/javascript');
      script.onload = () => iControllers.vantivIframeCtrl.init();

      document.body.appendChild(script);
    } else {
      iControllers.vantivIframeCtrl.init();
    }
  },
};
