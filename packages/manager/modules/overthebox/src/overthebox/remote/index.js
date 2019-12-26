import angular from 'angular';
import constant from './overTheBox-remote.constant';
import controller from './overTheBox-remote.controller';
import template from './overTheBox-remote.html';

const moduleName = 'ovhManagerOtbRemote';

angular
  .module(moduleName, [])
  .constant('OVERTHEBOX_REMOTE_STATUS', constant)
  .config(($stateProvider) => {
    $stateProvider.state('overTheBoxes.overTheBox.remote', {
      url: '/remote',
      views: {
        otbView: {
          template,
          controller,
          controllerAs: 'OverTheBoxRemote',
        },
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
    });
  });

export default moduleName;
