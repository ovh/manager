import angular from 'angular';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ovhManagerPciProjectQuotaExceedErrorModal';

angular
  .module(moduleName, ['oui'])
  .component('pciProjectQuotaExceedErrorModal', component);

export default moduleName;
