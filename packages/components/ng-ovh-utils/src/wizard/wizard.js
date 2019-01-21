import angular from 'angular';

import uaWizardStep from './wizardStep/wizardStep';
import wizardDirective from './wizard-directive';

const moduleName = 'ua.wizard';

angular
  .module(moduleName, [uaWizardStep])
  .directive('wizard', wizardDirective)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
