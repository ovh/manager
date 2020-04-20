export default class {
  /* @ngInject */
  constructor($translate, AccountContactsService) {
    this.$translate = $translate;
    this.AccountContactsService = AccountContactsService;
  }

  getCategoryColumnFilter() {
    return {
      values: this.AccountContactsService.constructor
        .getAvailableCategories(this.services)
        .reduce(
          (categories, category) => ({
            ...categories,
            [category]: category,
          }),
          {},
        ),
      hideOperators: true,
    };
  }

  onCriteriaChange(criteria) {
    this.updateCriteria(criteria);
  }
}
