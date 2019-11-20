import angular from 'angular';

import ovhManagerOtbWarning from '../warning';

import constant from './overTheBox-details.constant';
import controller from './overTheBox-details.controller';
import overTheBoxGraphService from './overTheBox-details.service';
import template from './overTheBox-details.html';

const moduleName = 'ovhManagerOtbDetails';

angular
  .module(moduleName, [
    ovhManagerOtbWarning,
  ])
  .constant('OVERTHEBOX_DETAILS', constant)
  .config(($stateProvider) => {
    $stateProvider.state('overTheBox.details', {
      url: '/details',
      views: {
        otbView: {
          template,
          controller,
          controllerAs: 'OverTheBoxDetails',
        },
      },
      translations: {
        value: ['.', '../remote'],
        format: 'json',
      },
    });
  })
  .service('OverTheBoxGraphService', overTheBoxGraphService);

export default moduleName;
