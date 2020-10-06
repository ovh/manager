export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('platform-sh.add', {
    url: '/new',
    component: 'platformShAdd',
    resolve: {
      catalog: /* @ngInject */ (
        PlatformSh,
        user,
      ) =>
        PlatformSh.getCatalog(
          user.ovhSubsidiary,
        ),
      plans: /* @ngInject */ (catalog) =>
        catalog.plans,
      goBack: /* @ngInject */ (goToPlatformSh) => goToPlatformSh,

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('platform_sh_add_project_title'),
    },
  });
};
