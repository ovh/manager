import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';

import component from './telecom-sms-batches-create.component';
import routing from './routing';

import composeTips from './compose-tips';
import phonebookContacts from './phonebooks-contacts';
import receiversChoice from './receivers-choice';
import sizeTips from './size-tips';

const moduleName = 'ovhManagerSmsBatchesCreateModule';

angular
  .module(moduleName, [
    composeTips,
    'ngOvhTelecomUniverseComponents',
    'oui',
    phonebookContacts,
    receiversChoice,
    sizeTips,
    'ui.router',
  ])
  .component(component.name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
