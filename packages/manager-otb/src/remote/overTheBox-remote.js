import angular from 'angular';
import constant from './overTheBox-remote.constant';
import controller from './overTheBox-remote.controller';
import template from './overTheBox-remote.html';

const moduleName = 'ovhManagerOtbRemote';

angular.module(moduleName, [])
  .constants('OVERTHEBOX_REMOTE_STATUS', constant)
  .config(($stateProvider) => {
    $stateProvider.state('telecom.overTheBox.remote', {
      url: '/remote',
      views: {
        'otbView@telecom.overTheBox': {
          template,
          controller,
          controllerAs: 'OverTheBoxRemote',
        },
      },
      translations: ['.'],
    });
  });

export default moduleName;
