import template from './pack-resiliation.html';
import controller from './pack-resiliation.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.resiliation', {
    url: '/resiliation',
    template,
    controller,
    controllerAs: 'PackResiliation',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pack_resiliation_title'),
    },
  });
};
