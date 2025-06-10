import * as constants from '../../../iam.constants';
import { RESOURCE_GROUPS_TRACKING_HITS } from '../resourceGroups.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.policies.resourceGroups.create', {
    url: '/create',
    views: {
      '@iam': {
        component: 'iamCreateResourceGroup',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_resource_group_create'),
      policiesGuides: /* @ngInject */ (IAMService) => {
        return IAMService.formatGuides(constants.GUIDE.IAM);
      },
    },
    atInternet: {
      rename: RESOURCE_GROUPS_TRACKING_HITS.ADD_RESOURCE_GROUP_PAGE,
    },
  });
};
