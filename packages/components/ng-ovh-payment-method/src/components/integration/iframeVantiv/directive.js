import merge from 'lodash/merge';

import controller from './controller';
import {
  THREAT_METRIX,
  VANTIV_IFRAME_CONFIGURATION,
  VANTIV_SCRIPT,
} from './constants';

const directiveName = 'ovhPaymentMethodIntegrationIframeVantiv';

export default {
  name: directiveName,
  restrict: 'E',
  require: {
    iframeVantivCtrl: directiveName,
    integrationCtrl: '^ovhPaymentMethodIntegration',
  },
  controller,
  controllerAs: '$ctrl',
  bindToController: true,
  template: `<div id="${VANTIV_IFRAME_CONFIGURATION.div}"></div>`,
  link: (scope, iElement, iAttributes, iControllers) => {
    // separate controllers
    const {
      iframeVantivCtrl,
      integrationCtrl,
    } = iControllers;

    /* ----------  Controller method declaration  ---------- */

    /**
     *  Insert ThreatMetrix tags into dom.
     *  Set this method available from controller.
     *  @return {Promise} That is resolved when script AND iframe are loaded.
     */
    iframeVantivCtrl.insertThreatMetrix = ({
      formSessionId,
      organizationId,
    }) => new Promise((resolve) => {
      const threatMetricParams = `?org_id=${organizationId}&session_id=${formSessionId}&pageid=${THREAT_METRIX.PAGE_ID}`;

      // insert ThreatMetrix script
      integrationCtrl.insertElement('script', {
        src: `${THREAT_METRIX.SCRIPT.src}${threatMetricParams}`,
        id: THREAT_METRIX.SCRIPT.id,
        type: 'text/javascript',
      }, {
        onload: () => {
          // when script is loaded - add the invisble iframe of ThreatMetrix into noscript tag
          const tmNoscriptTag = integrationCtrl.insertElement('noscript', {
            id: `${THREAT_METRIX.IFRAME.id}_noscript`,
          });
          integrationCtrl.insertElement('iframe', {
            id: THREAT_METRIX.IFRAME.id,
            src: `${THREAT_METRIX.IFRAME.src}${threatMetricParams}`,
          }, {
            onload: () => resolve(),
          }, THREAT_METRIX.CSS, {
            tmNoscriptTag,
          });
        },
      });
    });

    /**
     *  Remove ThreatMetrix tags from dom.
     */
    iframeVantivCtrl.removeThreatMetrix = () => {
      const tmScript = document.getElementById(THREAT_METRIX.SCRIPT.id);
      const tmNoScript = document.getElementById(`${THREAT_METRIX.IFRAME.id}_noscript`);

      if (tmScript) {
        document.body.removeChild(tmScript);
      }

      if (tmNoScript) {
        document.body.removeChild(tmNoScript);
      }
    };

    /* ----------  Directive instanciation  ---------- */

    // add vantiv script to document body
    // first check if script has already been added
    if (!document.getElementById(VANTIV_SCRIPT.id)) {
      integrationCtrl.insertElement('script', merge({
        type: 'text/javascript',
      }, VANTIV_SCRIPT), {
        onload: iframeVantivCtrl.init.bind(iframeVantivCtrl),
      });
    } else {
      iframeVantivCtrl.init();
    }
  },
};
