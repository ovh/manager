import controller from './user-ssh.controller';
import template from './user-ssh.html';
import {
  TRACKING_SSH_PAGE_NAME,
  TRACKING_PAGE_CATEGORY,
} from '../autorenew.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.autorenew.ssh', {
    url: '/ssh',
    template,
    controller,
    controllerAs: 'ctrlSsh',
    atInternet: {
      ignore: true,
    },
    onEnter: /* @ngInject */ (atInternet) => {
      atInternet.trackPage({
        name: TRACKING_SSH_PAGE_NAME,
        page_category: TRACKING_PAGE_CATEGORY,
      });
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_ssh_title'),
    },
  });
};
