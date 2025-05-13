import angular from 'angular';
import wizardFormStepDirective from './wizardFormStep-directive';

const moduleName = 'ua.wizardFormStep';

angular
  .module(moduleName, [])
  .directive('wizardFormStep', wizardFormStepDirective);

export default moduleName;
