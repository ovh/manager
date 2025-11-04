export const name = 'iamResourceTypeService';

export default class IAMResourceTypeService {
  /* @ngInject */
  constructor($filter) {
    this.$filter = $filter;
  }

  /**
   * Post-process the list (translations, sorting, ...)
   * @param {Array} resourceTypes
   */
  transformResourceTypes(resourceTypes) {
    const resourceTypeFilter = this.$filter('iamResourceType');
    resourceTypes.forEach((resourceType, i) => {
      Object.assign(resourceTypes, {
        [i]: {
          label: resourceTypeFilter(resourceType),
          value: resourceTypes[i],
        },
      });
    });
    resourceTypes.sort(({ label: labelA }, { label: labelB }) =>
      labelA.toLowerCase() > labelB.toLowerCase() ? 1 : -1,
    );
  }
}
