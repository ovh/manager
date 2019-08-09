import component from './component';

const componentName = 'stepperHeader';
const moduleName = 'stepperHeader';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
  ])
  .component(componentName, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
