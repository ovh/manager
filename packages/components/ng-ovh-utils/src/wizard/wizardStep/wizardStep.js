import angular from 'angular';
import wizardStepDirective from './wizardStep-directive';

import './wizardStep.css';

const moduleName = 'ua.wizardStep';

angular
  .module(moduleName, [])
  .directive('wizardStep', wizardStepDirective);

export default moduleName;
