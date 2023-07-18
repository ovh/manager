// import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vrack-services', {
    url: '/vrack-services',
    template: `<div>
             <div data-ui-view></div>
        </div>`,
    // redirectTo: 'vrack-services.index',
    resolve: {
      breadcrumb: () => 'vrack-services',
    },
  });

  $stateProvider.state('vrack-services.index', {
    // url: `?${ListLayoutHelper.urlQueryParams}`,
    // component: 'managerListLayout',
    // params: ListLayoutHelper.stateParams,
    // redirectTo: (transition) =>
    //   transition
    //     .injector()
    //     .getAsync('resources')
    //     .then((services) =>
    //       services.length === 0
    //         ? {
    //             state: 'vrack-services.onboarding',
    //           }
    //         : false,
    //     ),
    resolve: {
      //  ...ListLayoutHelper.stateResolves,
      //   apiPath: () => '/vrackServices',
      //   dataModel: () => 'vrackServices.vrackServices',
      //   defaultFilterColumn: () => 'serviceName',
      header: () => 'vrack-services',
      //   customizableColumns: () => true,
      //   getServiceNameLink: /* @ngInject */ ($state) => ({
      //     serviceName,
      //   }) =>
      //     $state.href('vrack-services.dashboard', {
      //       serviceName: serviceName,
      //     }),
      hideBreadcrumb: () => true,
    },
  });
};
