import angular from 'angular';
import 'ovh-api-services';

import autoGenerateName from './auto-generate-name';
import regionsList from './regions-list';
import textAccordion from './text-accordion';

const moduleName = 'ovhManagerPciUniverseComponentsProject';

angular.module(moduleName, [
  'ovh-api-services',
  autoGenerateName,
  regionsList,
  textAccordion,
]);

export default moduleName;
