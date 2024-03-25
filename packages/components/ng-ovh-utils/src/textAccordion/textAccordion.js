import angular from 'angular';
import '@ovh-ux/ui-kit';

import directive from './directive';
import controller from './controller';

import './styles.less';

const moduleName = 'ua.textAccordion';

angular
  .module(moduleName, ['oui'])
  .controller('textAccordionController', controller)
  .directive('textAccordion', directive);

export default moduleName;
