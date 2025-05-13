import angular from 'angular';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ovhManagerListLayoutComponentsTopbarCta';

angular.module(moduleName, ['oui']).component('topbarCta', component);

export default moduleName;
