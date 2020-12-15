import { merge } from 'lodash-es';

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
    const { iframeVantivCtrl, integrationCtrl } = iControllers;

    /* ----------  Controller method declaration  ---------- */

    /**
     *  Insert ThreatMetrix tags into dom.
     *  Set this method available from controller.
     *  @return {Promise} That is resolved when script AND iframe are loaded.
     */
    iframeVantivCtrl.insertThreatMetrix = ({ formSessionId, organizationId }) =>
      new Promise((resolve) => {
        // call the profile function with the proper parameters.
        // this is what will now deal with all the tag calling / obfuscation /
        // checks boilerplate, the rest of the code is not necessary anymore
        resolve(
          threatmetrix.profile(
            THREAT_METRIX.PROFILING_DOMAIN,
            organizationId,
            formSessionId,
            THREAT_METRIX.PAGE_ID,
          ),
        );
      });

    /* ----------  Directive instanciation  ---------- */

    // add vantiv script to document body
    // first check if script has already been added
    if (!document.getElementById(VANTIV_SCRIPT.id)) {
      integrationCtrl.insertElement(
        'script',
        merge(
          {
            type: 'text/javascript',
          },
          VANTIV_SCRIPT,
        ),
        {
          onload: iframeVantivCtrl.init.bind(iframeVantivCtrl),
        },
      );
    } else {
      iframeVantivCtrl.init();
    }
  },
};
