export default class UserContactsServiceController {
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
            [category]: this.$translate.instant(
              `account_contacts_service_category_${category}`,
            ),
          }),
          {},
        ),
      hideOperators: true,
    };
  }

  getContactColumnFilter(type) {
    return {
      values: uniq(this.services.map((service) => service[type])).reduce(
        (contacts, contact) => ({
          ...contacts,
          [contact]: contact,
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
