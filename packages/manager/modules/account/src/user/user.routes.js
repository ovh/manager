import { SupportLevel } from '@ovh-ux/manager-models';
import { API_MODEL_SUPPORT_LEVEL } from './support-level/support-level.constants';
import { GUIDES_LIST } from './user.constants';

import template from './user.html';
import controller from './user.controller';
import { GDPR_FEATURES_FEATURE } from '../account.constants';

const GDPR_REQUEST_MANAGEMENT_ACTIONS = [
  'account:apiovh:me/privacy/requests/get',
  'account:apiovh:me/privacy/requests/capabilities/get',
];

export default /* @ngInject */ ($stateProvider) => {
  const name = 'account.user';

  $stateProvider.state(name, {
    url: '/useraccount',
    static: true,
    template,
    controller,
    controllerAs: '$ctrl',
    redirectTo: `${name}.dashboard`,
    resolve: {
      angularQr: /* @ngInject */ ($ocLazyLoad) =>
        import('angular-qr').then((module) =>
          $ocLazyLoad.inject(module.default || module),
        ),
      schema: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().schema().$promise,
      supportLevel: /* @ngInject */ (OvhApiMe, schema) =>
        schema.models[API_MODEL_SUPPORT_LEVEL]
          ? OvhApiMe.v6()
              .supportLevel()
              .$promise.then((supportLevel) => new SupportLevel(supportLevel))
          : Promise.resolve(null),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_account'),

      guides: /* @ngInject */ (currentUser) => {
        return Object.values(GUIDES_LIST).map((value) => {
          return {
            ...value,
            url: value.url[currentUser.ovhSubsidiary] || value.url.DEFAULT,
          };
        });
      },
      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        return atInternet.trackClick({
          name: hit,
          type: 'action',
        });
      },
      areGdprFeaturesAvailable: /* @ngInject */ (featureAvailability) =>
        featureAvailability[GDPR_FEATURES_FEATURE] || false,
      canManageGdprRequests: /* @ngInject */ (
        areGdprFeaturesAvailable,
        Apiv2Service,
      ) => {
        if (!areGdprFeaturesAvailable) {
          return false;
        }
        return Apiv2Service.httpApiv2({
          method: 'get',
          url: '/engine/api/v2/iam/resource?resourceType=account',
        }).then(({ data }) => {
          if (!data[0]?.urn) {
            return false;
          }
          return Apiv2Service.httpApiv2({
            method: 'post',
            url: `/engine/api/v2/iam/resource/${encodeURIComponent(
              data[0].urn,
            )}/authorization/check`,
            data: {
              actions: GDPR_REQUEST_MANAGEMENT_ACTIONS,
            },
          })
            .then(({ data: actions }) =>
              GDPR_REQUEST_MANAGEMENT_ACTIONS.every((action) =>
                actions.authorizedActions.includes(action),
              ),
            )
            .catch(() => false);
        });
      },
    },
  });
};
