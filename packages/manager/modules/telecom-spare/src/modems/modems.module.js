import angular from 'angular';

import '@ovh-ux/manager-core';
import 'ovh-api-services';
import 'ovh-ui-angular';

import deleteModem from './delete/modems-delete.module';
import replaceModem from './replace/modems-replace.module';
import returnModem from './return/modems-return.module';

import component from './modems.component';
import routing from './modems.routing';

import '@ovh-ux/manager-telecom-styles';

const moduleName = 'ovhManagerTelecomSpareModems';

angular
  .module(moduleName, [
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    deleteModem,
    replaceModem,
    returnModem,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngTranslationsInject:json ./modal/translations */)
  .component('modemsComponent', component);

export default moduleName;
