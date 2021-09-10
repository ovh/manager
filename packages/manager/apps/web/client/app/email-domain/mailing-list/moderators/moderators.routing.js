import controller from './email-domain-mailing-list-moderators.controller';
import template from './email-domain-mailing-list-moderators-view.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain.mailing-list.dashboard.moderators', {
    url: '/moderators',
    template,
    controller,
    controllerAs: 'ctrlModerators',
    params: {
      mailingList: {},
    },
    resolve: {
      mailingList: /* @ngInject */ ($transition$) =>
        $transition$.params().mailingList,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('email_domain_mailing_list_moderators'),
    },
  });
};
