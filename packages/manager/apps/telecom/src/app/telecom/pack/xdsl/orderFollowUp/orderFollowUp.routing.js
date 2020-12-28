import controller from './orderFollowUp.controller';
import template from './orderFollowUp.html';
import mainViewTemplate from './orderFollowUp-main.view.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.line.access-order', {
    url: '/order',
    views: {
      'accessView@telecom.packs.pack.xdsl.line': {
        template,
      },
      'followUp@telecom.packs.pack.xdsl.line.access-order': {
        template: mainViewTemplate,
        controller,
        controllerAs: 'OrderFollowUpCtrl',
      },
    },
  });
};
