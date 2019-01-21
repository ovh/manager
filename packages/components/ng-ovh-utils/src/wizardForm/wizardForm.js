import angular from 'angular';

import uaWizardFormStep from './wizardFormStep/wizardFormStep';
import wizardFormDirective from './wizardForm-directive';

const moduleName = 'ua.wizardForm';

angular
  .module(moduleName, [uaWizardFormStep])
  .directive('wizardForm', wizardFormDirective)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
