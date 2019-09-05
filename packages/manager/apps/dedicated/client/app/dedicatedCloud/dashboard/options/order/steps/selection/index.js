import './style.less';

import component from './component';
import service from './service';
import step from './step';

const componentName = 'dedicatedCloudServicePackSelection';
const moduleName = 'dedicatedCloudServicePackSelection';
const serviceName = 'selectionService';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(componentName, component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service(serviceName, service);

export default moduleName;

export {
  moduleName,
  step,
};
