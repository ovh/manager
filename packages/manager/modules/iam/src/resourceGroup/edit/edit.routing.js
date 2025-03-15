import { TAG, GUIDE } from '../../iam.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam.resourceGroup.edit', {
    url: '/edit/{resourceGroup:uuid}',
    component: 'iamCreateResourceGroup',
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
      rename: TAG.EDIT_RESOURCE_GROUP,
    },
  });
};
