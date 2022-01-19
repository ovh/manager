import { merge } from 'lodash-es';

import controller from './controller';

import { PAYPAL_SCRIPT, PAYPAL_BUTTON_OPTIONS } from './constants';

const name = 'ovhPaymentMethodIntegrationInContextPaypal';

export default {
  name,
  controller,
  restrict: 'E',
  bindToController: true,
  controllerAs: '$ctrl',
  require: {
    inContextCtrl: '^ovhPaymentMethodIntegrationInContext',
    paypalCtrl: name,
  },
  link: (tScope, tElement, tAttributes, tControllers) => {
    const { integrationCtrl } = tControllers.inContextCtrl;
    const { paypalCtrl } = tControllers;

    // define render method to paypal controller
    paypalCtrl.render = (renderOptions = {}) => {
      paypal.Button.render(
        merge(
          {
            payment: paypalCtrl.submit.bind(paypalCtrl),
            onAuthorize: paypalCtrl.onAuthorize.bind(paypalCtrl),
          },
          PAYPAL_BUTTON_OPTIONS,
          renderOptions,
        ),
        tElement[0],
      );
    };

    // set integrationCtrl to init state
    integrationCtrl.loading.init = true;

    // insert paypal checkout.js script if not yet loaded
    if (typeof paypal === 'undefined') {
      integrationCtrl.insertElement(
        'script',
        merge(
          {
            type: 'text/javascript',
          },
          PAYPAL_SCRIPT,
        ),
        {
          onload: paypalCtrl.init.bind(paypalCtrl),
        },
      );
    } else {
      paypalCtrl.init();
    }
  },
};
