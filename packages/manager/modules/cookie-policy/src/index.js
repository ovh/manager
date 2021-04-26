import angular from 'angular';
import 'angular-ui-bootstrap';
import 'angular-translate';
import '@ovh-ux/manager-core';
import '@ovh-ux/ui-kit';

import service from './service';

import controller from './controller';
import template from './template.html';

import './style.scss';

const moduleName = 'ovhManagerCookiePolicy';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ovhManagerCore',
    'ui.bootstrap',
  ])
  .service('cookiePolicy', service)
  .run(
    /* @ngInject */ ($uibModal, cookiePolicy) => {
      cookiePolicy.checkConsent();

      if (cookiePolicy.shouldAskConsent()) {
        $uibModal
          .open({
            template,
            controller,
            controllerAs: '$ctrl',
            size: 'lg',
            keyboard: false,
            backdrop: 'static',
            backdropClass: 'manager-cookie-policy-banner-backdrop',
            windowClass: 'manager-cookie-policy-banner',
          })
          .result.then((consent) => {
            cookiePolicy.consent(consent);
          });
      }
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
