import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { getVrackOrderUrl } from './vrack-order';
import { SURVEY_LANGUAGES, BASE_URL_SURVEY } from './vrack.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vrack.index', {
    url: `?${ListLayoutHelper.urlQueryParams}`,
    component: 'managerListLayout',
    params: ListLayoutHelper.stateParams,
    resolve: {
      ...ListLayoutHelper.stateResolves,
      apiPath: /* @ngInject */ () => '/vrack',
      dataModel: () => 'vrack.vrack',
      resources: /* @ngInject */ ($http) =>
        $http
          .get('/vracks', {
            serviceType: 'aapi',
          })
          .then(({ data }) => data),

      loadResource: /* @ngInject */ () => (service) => ({
        ...service,
        serviceName: service.id,
      }),
      staticResources: () => true,
      defaultFilterColumn: () => 'serviceName',
      header: /* @ngInject */ ($translate) => $translate.instant('vrack_title'),
      surveyUrl: /* @ngInject */ (coreConfig) => {
        const userLanguage = coreConfig.getUserLanguage();
        const languageToUse = SURVEY_LANGUAGES.ALLOWED.includes(userLanguage)
          ? userLanguage
          : SURVEY_LANGUAGES.DEFAULT;
        // Get user
        const user = coreConfig.getUser();

        // Build url for survey link
        return `${BASE_URL_SURVEY}${languageToUse}&nic=${user.nichandle}`;
      },
      customizableColumns: () => true,
      getServiceNameLink: /* @ngInject */ ($state) => ({
        serviceName: vrackId,
      }) =>
        $state.href('vrack.dashboard', {
          vrackId,
        }),
      topbarOptions: /* @ngInject */ (
        $translate,
        $window,
        coreConfig,
        atInternet,
      ) => ({
        cta: {
          type: 'button',
          displayed: true,
          disabled: false,
          label: $translate.instant('vrack_order'),
          value: $translate.instant('vrack_order'),
          onClick: () => {
            atInternet.trackClick({
              name: 'vrack::index::order',
              type: 'action',
            });
            $window.open(
              getVrackOrderUrl(coreConfig.getUser().ovhSubsidiary),
              '_blank',
            );
          },
        },
      }),
      hideBreadcrumb: () => true,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.length === 0 ? { state: 'vrack.onboarding' } : false,
        ),
  });
};
