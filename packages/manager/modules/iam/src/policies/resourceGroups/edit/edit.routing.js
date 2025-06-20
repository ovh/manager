import { GUIDE } from '../../../iam.constants';
import { RESOURCE_GROUPS_TRACKING_HITS } from '../resourceGroups.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policies.resourceGroups.edit', {
    url: '/edit/{resourceGroup:uuid}',
    views: {
      '@iam': {
        component: 'iamCreateResourceGroup',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate, resourceGroup) =>
        $translate.instant('iam_resource_group_edit', {
          resourceGroup: resourceGroup.name,
        }),

      /**
       * The resource group parameter based on the resourceGroup's id
       * @returns {Object|null}
       */
      resourceGroup: /* @ngInject */ ($transition$, IAMService) => {
        const { resourceGroup: uuid } = $transition$.params();
        return uuid ? IAMService.getDetailedResourceGroup(uuid) : null;
      },
      policiesGuides: /* @ngInject */ (IAMService) => {
        return IAMService.formatGuides(GUIDE.IAM);
      },
    },
    atInternet: {
      rename: RESOURCE_GROUPS_TRACKING_HITS.UPDATE_RESOURCE_GROUP_PAGE,
    },
  });
};
