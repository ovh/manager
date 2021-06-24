import template from './license-spla-add.html';
import controller from './license-spla-add.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.license.dashboard.spla-add', {
    url: '/spla/add',
    views: {
      modal: {
        template,
        controller,
      },
    },
    layout: 'modal',
    resolve: {
      hideBreadcrumb: () => true,
    },
  });
};
