import get from 'lodash/get';
import set from 'lodash/set';

import controller from './controller';
import template from './index.html';

export default {
  name: 'ovhPaymentMethodIntegration',
  restrict: 'E',
  bindToController: true,
  controllerAs: '$ctrl',
  controller,
  template,
  scope: {
    callbackStatusParamUrlName: '@?',
    onInitialized: '&?',
    onSubmit: '&?',
    onSubmitError: '&?',
    onSubmitSuccess: '&?',
    paymentMethodType: '<',
  },
  link: (tScope, tElement, tAttributes, integrationCtrl) => {
    const ctrl = integrationCtrl;

    // declare a DOM element insertion method to controller
    ctrl.insertElement = (tagName, attributes = {}, events = {}, styles = {}, options = {}) => {
      const element = document.createElement(tagName);

      // set attributes of dom element
      Object.keys(attributes).forEach((key) => {
        element.setAttribute(key, get(attributes, key));
      });

      // set tyles of dom element
      Object.keys(styles).forEach((key) => {
        set(element.style, key, get(styles, key));
      });

      // set events of dom element
      Object.keys(events).forEach((key) => {
        set(element, key, get(events, key));
      });

      if (options.appendTo) {
        options.appendTo.appendChild(element);
      } else {
        document.body.appendChild(element);
      }

      return element;
    };
  },
};
