import angular from 'angular';
import controller from './overTheBox-docs.controller';
import template from './overTheBox-docs.html';

const moduleName = 'ovhManagerOtbDocs';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.docs', {
    url: '/docs',
    views: {
      otbView: {
        template,
        controller,
        controllerAs: 'OverTheBoxDocs',
      },
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
});

export default moduleName;
