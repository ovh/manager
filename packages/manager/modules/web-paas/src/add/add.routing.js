import { commonResolves } from './add.utils';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.add', {
    url: '/new',
    component: 'webPaasAddComponent',
    resolve: {
      ...commonResolves,
      goBack: /* @ngInject */ (goToWebPaas) => goToWebPaas,
      catalog: /* @ngInject */ (WebPaas, user) =>
        WebPaas.getCatalog(user.ovhSubsidiary),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('web_paas_add_project_title'),
    },
  });
};
