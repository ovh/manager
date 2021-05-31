import head from 'lodash/head';
import isBoolean from 'lodash/isBoolean';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';

export default class SupportNewIssuesFormController {
  /* @ngInject */
  constructor($q, $timeout, atInternet, IssueForm, SupportNewTicketService) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.atInternet = atInternet;
    this.IssueForm = IssueForm;
    this.SupportNewTicketService = SupportNewTicketService;
  }

  $onInit() {
    this.props = {
      categoryName: this.categoryName,
      serviceName: this.serviceName,
      serviceTypeName: this.serviceTypeName,
    };

    this.bindings = {
      category: {
        isLoading: true,
      },
      serviceType: {
        exists: false,
        isLoading: true,
        showAll: false,
      },
      service: {
        exists: false,
      },
      issuesSelector: {
        exists: false,
      },
      resources: {},
      issue: {},
      buttons: {
        exists: false,
        choice: {},
      },
    };

    return this.getInitialData();
  }

  getInitialData() {
    return this.$q
      .all({
        categories: this.getCategories().then((categories) =>
          this.setCategory(categories),
        ),
        serviceTypes: this.getServiceTypes(),
      })
      .then(({ serviceTypes }) => {
        this.setServiceTypes(serviceTypes);

        if (this.bindings.serviceType.exists) {
          return this.onServiceTypeChange();
        }

        return null;
      });
  }

  getCategories() {
    this.bindings.category.isLoading = true;

    return this.SupportNewTicketService.getCategories().then((categories) => {
      this.bindings.category.isLoading = false;

      return categories;
    });
  }

  getServiceTypes() {
    this.bindings.serviceType.isLoading = true;

    return this.IssueForm.getServiceTypes()
      .then((serviceTypes) =>
        this.IssueForm.filterOwnServiceTypes(serviceTypes).then(
          (filteredServiceTypes) => ({
            serviceTypes,
            filteredServiceTypes,
          }),
        ),
      )
      .finally(() => {
        this.bindings.serviceType.isLoading = false;
      });
  }

  getServices() {
    this.bindings.service.exists = true;
    this.bindings.service.isLoading = true;

    return this.IssueForm.getServices(
      this.bindings.serviceType.value.route,
      this.bindings.serviceType.value.subType,
    ).then((services) => {
      this.bindings.service.isLoading = false;
      return services;
    });
  }

  onCategoryChange() {
    this.resetIssuesSelector();

    if (this.bindings.category.value.id === 'account') {
      this.resetServiceType();
    }

    this.updateServiceType();
  }

  resetIssuesSelector() {
    this.bindings.issuesSelector.exists = false;
    this.bindings.issue = {};

    this.setIssue();
  }

  resetServiceType() {
    this.bindings.serviceType.value = undefined;
    this.updateServiceType();
    this.resetService();
  }

  resetService() {
    this.bindings.service.value = undefined;
    this.updateService();
  }

  setCategory(categories) {
    this.bindings.category.values = categories;
    this.bindings.category.value =
      this.bindings.category.value ||
      (this.props.categoryName
        ? categories.find((category) =>
            isEqual(
              category.id.toLowerCase(),
              this.props.categoryName.toLowerCase(),
            ),
          )
        : undefined);

    if (this.bindings.category.value) {
      this.onCategoryChange();
    }
  }

  getServiceTypesList() {
    return this.bindings.serviceType.showAll
      ? this.bindings.serviceType.values
      : this.bindings.serviceType.valuesFiltered;
  }

  setServiceTypes({ serviceTypes, filteredServiceTypes }) {
    if (this.props.serviceTypeName) {
      this.bindings.serviceType.showAll = true;
    }
    this.bindings.serviceType.values = serviceTypes;
    this.bindings.serviceType.valuesFiltered = filteredServiceTypes;
    this.bindings.serviceType.value =
      this.bindings.serviceType.value ||
      (this.props.serviceTypeName
        ? serviceTypes.find((serviceType) =>
            isEqual(
              serviceType.name.toLowerCase(),
              this.props.serviceTypeName.toLowerCase(),
            ),
          )
        : undefined);

    this.updateServiceType();
  }

  updateServiceType() {
    this.bindings.serviceType.exists =
      (this.bindings.category.value &&
        this.bindings.category.value.id !== 'account') ||
      (this.bindings.serviceType.value &&
        this.props.serviceTypeName &&
        isEqual(
          this.bindings.serviceType.value.name.toLowerCase(),
          this.props.serviceTypeName.toLowerCase(),
        ));

    this.updateService();
  }

  updateService() {
    this.bindings.service.exists =
      this.bindings.serviceType.exists &&
      isObject(this.bindings.serviceType.value);

    if (this.bindings.service.exists) {
      this.bindings.service.isUnknown = isEmpty(this.bindings.service.values);

      if (this.bindings.service.values.length === 1) {
        this.bindings.service.value = head(this.bindings.service.values);
      }
    }

    this.updateIssuesSelector();
  }

  onServiceTypeChange() {
    this.resetIssuesSelector();

    if (this.bindings.serviceType.value) {
      return this.getServices().then((services) => {
        this.setService(services);
        this.updateIssuesSelector();
      });
    }

    return null;
  }

  onServiceTypeFilterChange({ modelValue }) {
    if (
      modelValue === false &&
      !this.bindings.serviceType.valuesFiltered.includes(
        this.bindings.serviceType.value,
      )
    ) {
      this.resetIssuesSelector();
      this.resetServiceType();
    }
    this.$timeout(() => {
      document.querySelector('#serviceTypeSelector button').click();
    });
  }

  setService(services) {
    this.bindings.service.values = services;
    this.bindings.service.value = services.find(
      (service) =>
        [service.serviceName, service.displayName].includes(
          this.props.serviceName,
        ) &&
        this.props.serviceTypeName &&
        isEqual(
          this.props.serviceTypeName.toLowerCase(),
          this.bindings.serviceType.value.name.toLowerCase(),
        ),
    );

    this.updateService();
  }

  onServiceChange({ modelValue }) {
    this.checkIfIssueSelectorShouldReset(
      isBoolean(modelValue) ? modelValue : undefined,
    );
  }

  checkIfIssueSelectorShouldReset(serviceIsUnknown) {
    this.bindings.service.isUnknown = isBoolean(serviceIsUnknown)
      ? serviceIsUnknown
      : this.bindings.service.isUnknown;

    const withAccountCategory =
      this.bindings.category.value &&
      this.bindings.category.value.id === 'account';
    const withoutAccountCategory =
      this.bindings.category.value &&
      this.bindings.category.value.id !== 'account' &&
      this.bindings.serviceType.value &&
      (this.bindings.service.value || this.bindings.service.isUnknown);

    this.bindings.issuesSelector.exists =
      withAccountCategory || withoutAccountCategory;

    if (!this.bindings.issuesSelector.exists) {
      this.resetIssuesSelector();
    }
  }

  updateIssuesSelector() {
    this.setIssue();

    this.$timeout(() => {
      this.checkIfIssueSelectorShouldReset();
    });
  }

  submitForm(isSuccess) {
    this.atInternet.trackClick({
      name: `answer-finding-${isSuccess ? 'yes' : 'no'}`,
      type: 'action',
    });

    this.onSubmit({
      result: {
        isSuccess,
        issue: this.bindings.issue.value,
        category: this.bindings.category.value,
        serviceType: this.bindings.serviceType.value,
        service: this.bindings.service.value,
      },
    });
  }

  setIssue(issue) {
    this.bindings.issue.value = issue;

    this.updateIssue();
  }

  updateIssue() {
    this.bindings.issue.exists =
      this.bindings.issue.value &&
      !this.bindings.issue.value.hasChildren &&
      this.bindings.issue.value.selfCareResources.length > 0;
    this.bindings.buttons.exists =
      this.bindings.issue.value &&
      !this.bindings.issue.value.readOnly &&
      !this.bindings.issue.value.hasChildren;
    this.bindings.buttons.choice.exists =
      this.bindings.buttons.exists &&
      this.bindings.issue.value.selfCareResources.length > 0;
  }

  onIssuesSelectorChange({ issue }) {
    this.setIssue();

    this.$timeout(() => {
      this.setIssue(issue);
    });
  }
}
