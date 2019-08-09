import controller from './controller';
import template from './template.html';

const controllerName = 'dedicatedCloudOptionsConfirmCtrl';
const templateName = 'dedicatedCloudOptionsConfirmTemplate.html';
const moduleName = 'confirm';

angular
  .module(moduleName, [])
  .controller(controllerName, controller)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngInject */ ($templateCache) => {
    $templateCache.put(templateName, template);
  });

export default moduleName;
