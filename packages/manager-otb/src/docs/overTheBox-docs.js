import angular from 'angular';
import controller from './overTheBox-docs.controller';
import template from './overTheBox-docs.html';

const moduleName = 'ovhManagerOtbDocs';

angular.module(moduleName, [])
  .config(($stateProvider) => {
    $stateProvider.state('telecom.overTheBox.docs', {
      url: '/docs',
      views: {
        'otbView@telecom.overTheBox': {
          template,
          controller,
          controllerAs: 'OverTheBoxDocs',
        },
      },
      translations: ['.'],
    });
  });

export default moduleName;
