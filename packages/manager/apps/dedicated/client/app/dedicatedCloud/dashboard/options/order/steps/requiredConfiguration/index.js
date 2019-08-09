import component from './component';
import service from './service';
import step from './step';

const componentName = 'dedicatedCloudCertificationActivationRequiredConfiguration';
const moduleName = 'dedicatedCloudCertificationActivationRequiredConfiguration';
const serviceName = 'requiredConfigurationService';

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
  step,
};
