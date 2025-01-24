import { SupportLevel } from '@ovh-ux/manager-models';
import { API_MODEL_SUPPORT_LEVEL } from './support-level/support-level.constants';
import { GUIDES_LIST } from './user.constants';

import template from './user.html';
import controller from './user.controller';

const GDPR_REQUEST_MANAGEMENT_ACTION = 'account:apiovh:me/privacy/requests/get';

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
      canManageGdprRequests: /* @ngInject */ (Apiv2Service) =>
        Apiv2Service.httpApiv2({
          method: 'get',
          url: '/engine/api/v2/iam/resource?resourceType=account',
        }).then(({ data }) => {
          if (!data[0]?.urn) {
            return false;
          }
          return (
            Apiv2Service.httpApiv2({
              method: 'post',
              url: `/engine/api/v2/iam/resource/${encodeURIComponent(
                data[0].urn,
              )}/authorization/check`,
              data: {
                actions: [GDPR_REQUEST_MANAGEMENT_ACTION],
              },
            })
              .then(({ data: actions }) =>
                actions.authorizedActions.includes(
                  GDPR_REQUEST_MANAGEMENT_ACTION,
                ),
              )
              // TODO: cleanup this comment once the action GDPR_REQUEST_MANAGEMENT_ACTION is available in IAM
              // In order to be able to see the page, since the GDPR_REQUEST_MANAGEMENT_ACTION does not exist yet on
              // IAM, replace the next line with `.catch(() => true)`
              .catch(() => false)
          );
        }),
    },
  });
};
