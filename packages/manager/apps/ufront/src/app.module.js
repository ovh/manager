import 'script-loader!moment/min/moment.min.js'; //eslint-disable-line

import { Environment } from '@ovh-ux/manager-config';
import angular from 'angular';
import 'angular-translate';

import isString from 'lodash/isString';

import 'ovh-ui-angular';
import ovhManagerCore from '@ovh-ux/manager-core';
import ovhManagerNavbar from '@ovh-ux/manager-navbar';
import ngOvhSsoAuthModalPlugin from '@ovh-ux/ng-ovh-sso-auth-modal-plugin';

import get from 'lodash/get';

import { BILLING_REDIRECTIONS } from './constants';

import controller from './controller';
import 'ovh-ui-kit/dist/oui.css';
import './index.less';
import './index.scss';

Environment.setVersion(__VERSION__);

const moduleName = 'managerUFrontApp';

angular
  .module(
    moduleName,
    [
      ngOvhSsoAuthModalPlugin,
      'oui',
      ovhManagerCore,
      ovhManagerNavbar,
      'pascalprecht.translate',
      ...get(__NG_APP_INJECTIONS__, Environment.getRegion(), []),
    ].filter(isString),
  )
  .controller('HubController', controller)
  .run(
    /* @ngInject */ ($translate) => {
      let lang = $translate.use();

      if (['en_GB', 'es_US', 'fr_CA'].includes(lang)) {
        lang = lang.toLowerCase().replace('_', '-');
      } else {
        [lang] = lang.split('_');
      }

      return import(`script-loader!moment/locale/${lang}.js`).then(() =>
        moment.locale(lang),
      );
    },
  )
  .run(
    /* @ngInject */ (ssoAuthentication) => {
      if (!BILLING_REDIRECTIONS.includes(window.location.href)) {
        ssoAuthentication.login();
      }
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
