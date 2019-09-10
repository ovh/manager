import get from 'lodash/get';
import set from 'lodash/set';

import controller from './controller';
import {
  THREAT_METRIC,
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
    const { vantivIframeCtrl } = iControllers;

    /**
     *  Insert a script with given attributes
     */
    const insertElement = (tagName, attributes = {}, events = {}, styles = {}, options = {}) => {
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

    // declare insertThreatMetric method that will load the script and iframe
    // that will handle Vantiv ThreatMetric mechanism
    vantivIframeCtrl.insertThreatMetric = ({
      formSessionId,
      organizationId,
    }) => new Promise((resolve) => {
      const threatMetricParams = `?org_id=${organizationId}&session_id=${formSessionId}&pageid=${THREAT_METRIC.PAGE_ID}`;

      // insert ThreatMetric script
      insertElement('script', {
        src: `${THREAT_METRIC.SCRIPT.src}${threatMetricParams}`,
        id: `${THREAT_METRIC.SCRIPT.id}_${new Date().getTime()}`,
        type: 'text/javascript',
      }, {
        onload: () => {
          // when script is loaded - add the invisble iframe of ThreatMetric into noscript tag
          const noScriptTag = insertElement('noscript');
          insertElement('iframe', {
            id: THREAT_METRIC.IFRAME.id,
            src: `${THREAT_METRIC.IFRAME.src}${threatMetricParams}`,
          }, {
            onload: () => resolve(),
          }, {
            with: '100px',
            height: '100px',
            border: '0',
            position: 'absolute',
            top: '-5000px',
          }, {
            appendTo: noScriptTag,
          });
        },
      });
    });

    // add vantiv script to document body
    // first check if script has already been added
    if (!document.getElementById(VANTIV_SCRIPT.id)) {
      insertElement('script', {
        src: VANTIV_SCRIPT.src,
        id: VANTIV_SCRIPT.id,
      }, {
        onload: iControllers.vantivIframeCtrl.init.bind(iControllers.vantivIframeCtrl),
      });
    } else {
      iControllers.vantivIframeCtrl.init();
    }
  },
};
