const resourceTypeFilter = /* @ngInject */ ($translate) => (resourceType) =>
  $translate.instant(`iam_resource_type_${resourceType}`);

export default {
  resourceTypeFilter,
};
