import header from './components/header';

import component from './stepper.component';
import navigationButton from './components/button/navigation-button.component';

const moduleName = 'ovhManagerComponentStepperModule';

angular
  .module(moduleName, [header, 'oui', 'pascalprecht.translate', 'ui.router'])
  .component(component.name, component)
  .component(navigationButton.name, navigationButton)
  .run(/* @ngTranslationsInject:json ./components/button/translations */);

export default moduleName;
