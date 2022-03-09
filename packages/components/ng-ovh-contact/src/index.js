import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';
import 'ui-select';
import 'angular-ui-bootstrap';

import editComponent from './edit/component';
import component from './component';
import choiceComponent from './choice/component';
import factory from './factory';
import provider from './provider';

import choiceMatchTemplate from './choice/templates/match.tpl.html';
import choiceSelectTemplate from './choice/templates/select.tpl.html';

import { EDITION, PROTOTYPE_PATH, EMAIL_REGEX } from './constants';

import './index.less';

const moduleName = 'ngOvhContact';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.select',
    'ui.bootstrap',
  ])
  .constant('CONTACT_EDITION', EDITION)
  .constant('CONTACT_PROTOTYPE_PATH', PROTOTYPE_PATH)
  .constant('CONTACT_EMAIL_REGEX', EMAIL_REGEX)
  .component('ovhContactChoice', choiceComponent)
  .component('ovhContact', component)
  .component('ovhContactEdit', editComponent)
  .factory('OvhContact', factory)
  .provider('ovhContact', provider)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'ngOvhContacts/choice/templates/match.tpl.html',
        choiceMatchTemplate,
      );
      $templateCache.put(
        'ngOvhContacts/choice/templates/select.tpl.html',
        choiceSelectTemplate,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
