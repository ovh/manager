import * as constants from '../../iam.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.resourceGroup.create', {
    url: '/create',
    component: 'iamCreateResourceGroup',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('iam_resource_group_create'),
      policiesGuides: /* @ngInject */ (IAMService) => {
        return IAMService.formatGuides(constants.GUIDE.IAM);
      },
    },
    atInternet: {
      rename: constants.TAG.ADD_RESOURCE_GROUP,
    },
  });
};
