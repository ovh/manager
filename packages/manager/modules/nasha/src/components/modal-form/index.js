import angular from 'angular';

import '@ovh-ux/ui-kit';

import component from './modal-form.component';

const moduleName = 'ovhManagerNashaComponentsModalForm';

angular
  .module(moduleName, ['oui'])
  .component('nashaComponentsModalForm', component);

export default moduleName;
