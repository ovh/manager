import get from 'lodash/get';
import { GUIDELINK } from './web-paas.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas', {
    url: '/paas/webpaas',
    component: 'webPaas',
    redirectTo: 'web-paas.projects',
    resolve: {
      user: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().get().$promise,
      guideUrl: /* @ngInject */ (user) => get(GUIDELINK, user.ovhSubsidiary),
      goToDetails: /* @ngInject */ ($state, atInternet) => (
        projectId,
        trackText,
      ) => {
        atInternet.trackClick({
          name: trackText,
          type: 'action',
        });
        return $state.go('web-paas.dashboard', {
          projectId,
        });
      },
      openPartnerConsole: /* @ngInject */ ($window, atInternet) => (
        project,
        trackText,
      ) => {
        atInternet.trackClick({
          name: trackText,
          type: 'action',
        });
        return $window.open(
          project.metadata.partnerConsole,
          '_blank',
          'noopener',
        );
      },
      goToWebPaas: ($state, Alerter) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go('web-paas', {
          reload,
        });

        if (message) {
          Alerter.alertFromSWS(message, type, 'web_paas_dashboard_list');
        }

        return promise;
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('web_paas_title'),
      hideBreadcrumb: () => true,
    },
  });
};
