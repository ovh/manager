import filter from 'lodash/filter';
import get from 'lodash/get';
import isString from 'lodash/isString';
import orderBy from 'lodash/orderBy';

const CATEGORY_ACCOUNT = 'account';

export default class SupportNewIssuesFormController {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $translate,
    atInternet,
    OvhApiService,
    OvhApiSupport,
    OvhApiMe,
    SupportNewTicketService,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.OvhApiService = OvhApiService;
    this.OvhApiSupport = OvhApiSupport;
    this.OvhApiMe = OvhApiMe;
    this.SupportNewTicketService = SupportNewTicketService;
    this.CATEGORY_ACCOUNT = CATEGORY_ACCOUNT;
  }

  $onInit() {
    this.defaultServiceTypeName = isString(this.serviceTypeName)
      ? this.serviceTypeName.toLowerCase()
      : null;

    this.currentServiceName = null;
    this.categories = null;
    this.category = null;
    this.issue = null;
    this.issueParams = {};
    this.isLoading = true;
    return this.$q.all({
      categories: this.SupportNewTicketService.getCategories(),
      serviceTypes: this.OvhApiSupport.v6().getServiceTypes().$promise,
    }).then(({ categories, serviceTypes }) => {
      this.categories = categories;
      this.serviceTypes = serviceTypes.map(({ name, route }) => ({
        name,
        route,
        label: this.$translate.instant(`ovhManagerSupport_new_serviceType_${name}`),
      }));
      this.serviceTypes = orderBy(this.serviceTypes, [type => (type.label || '').toLowerCase()]);

      if (this.serviceTypes && this.defaultServiceTypeName) {
        this.defaultServiceType = this.findServiceByName(this.defaultServiceTypeName);
        this.serviceType = this.defaultServiceType;

        this.updateIssueParamsPartially({
          serviceType: this.serviceType,
        });

        return this.fetchServices();
      }

      return null;
    })
      .finally(() => {
        this.isLoading = false;
      });
  }

  get guides() {
    return filter(get(this.issue, 'selfCareResources'), { type: 'guide' });
  }

  get tips() {
    return filter(get(this.issue, 'selfCareResources'), { type: 'tip' });
  }

  findServiceByName(name) {
    return this.serviceTypes
      .find(type => type.name.toLowerCase() === name);
  }

  onCategoryChange() {
    if (!this.defaultServiceType && !this.serviceName) {
      this.serviceType = null;
      this.currentServiceName = null;
      this.isUnknownService = false;
      this.issue = null;
    }

    this.updateIssueParamsPartially({
      category: this.category,
    });
  }

  onServiceTypeChange() {
    this.defaultServiceTypeName = null;
    this.defaultServiceType = null;
    this.serviceName = null;
    this.currentServiceName = null;
    this.isUnknownService = false;
    this.issue = null;
    this.updateIssueParamsPartially({
      serviceType: this.serviceType,
    });

    return this.fetchServices();
  }

  updateIssueParamsPartially({ category, serviceType }) {
    this.issueParams = {
      category: category
        || this.issueParams.category,
      serviceType: serviceType
        || this.issueParams.serviceType
        || this.defaultServiceType,
    };
  }

  onServiceChange() {
    this.serviceName = null;
    if (this.currentServiceName) {
      this.isUnknownService = false;
    }
  }

  onUnknownServiceChange() {
    const checked = !this.isUnknownService; // on change is triggered before changes
    if (checked) {
      this.currentServiceName = null;
    }
    this.issue = null;
  }

  fetchServices() {
    if (!this.serviceType) return this.$q.when();
    this.isUnknownService = false;
    this.services = null;
    this.issue = null;
    return this.OvhApiService.Aapi().query({
      type: this.serviceType.route,
      external: false,
    }).$promise.then((items) => {
      this.services = items;

      if (this.defaultServiceType != null) {
        const inputService = this.services
          .find(service => service.serviceName === this.serviceName
              || service.displayName === this.serviceName);

        if (inputService == null) {
          this.serviceName = null;
          this.currentServiceName = null;
        } else {
          this.currentServiceName = inputService.displayName;
        }
      }
    });
  }

  isIssuesSelectorReady() {
    return this.issueParams.category
      && this.category
      && (
        this.category.id === this.CATEGORY_ACCOUNT
        || (
          this.serviceType && (this.isUnknownService || this.currentServiceName)
        )
      );
  }

  submitForm(isSuccess) {
    this.atInternet.trackClick({
      name: `answer-finding-${isSuccess ? 'yes' : 'no'}`,
      type: 'action',
    });
    this.onSubmit({
      result: {
        isSuccess,
        issue: this.issue,
        category: this.category,
        serviceType: this.serviceType,
        service: this.currentServiceName,
      },
    });
  }
}
