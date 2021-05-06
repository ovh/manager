import { addProjectResolves } from '../components/modify-plan/modify-plan.utils';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.add', {
    url: '/new',
    component: 'webPaasModifyPlan',
    resolve: {
      ...addProjectResolves,
      goBack: /* @ngInject */ (goToWebPaas) => goToWebPaas,
      catalog: /* @ngInject */ (WebPaas, user) =>
        WebPaas.getCatalog(user.ovhSubsidiary),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('web_paas_add_project_title'),
    },
  });
};
