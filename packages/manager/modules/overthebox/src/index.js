import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/manager-core';

import overTheBox from './overTheBox';

const moduleName = 'ovhManagerOverTheBoxes';

angular
  .module(moduleName, [
    'ui.router',
    'ovhManagerCore',
    'oc.lazyLoad',
    overTheBox,
  ]);
// .config(/* @ngInject */($stateProvider) => {
//   $stateProvider.state('overtheboxes', {
//     url: '/overThebox',
//     abstract: true,
//   });
// });

export default moduleName;
