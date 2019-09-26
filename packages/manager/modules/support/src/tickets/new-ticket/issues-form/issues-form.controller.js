import filter from 'lodash/filter';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';

const CATEGORY_ACCOUNT = 'account';

export default class SupportNewIssuesFormController {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $translate,
    OvhApiService,
    OvhApiSupport,
    OvhApiMe,
    SupportNewTicketService,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;
    this.OvhApiService = OvhApiService;
    this.OvhApiSupport = OvhApiSupport;
    this.OvhApiMe = OvhApiMe;
    this.SupportNewTicketService = SupportNewTicketService;
    this.CATEGORY_ACCOUNT = CATEGORY_ACCOUNT;
  }

  $onInit() {
    this.categories = null;
    this.serviceTypes = null;
    this.services = [];
    this.category = null;
    this.serviceType = null;
    this.issue = null;
    this.issueParams = null;
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
    }).finally(() => {
      this.isLoading = false;
    });
  }

  get guides() {
    return filter(get(this.issue, 'selfCareResources'), { type: 'guide' });
  }

  get tips() {
    return filter(get(this.issue, 'selfCareResources'), { type: 'tip' });
  }

  onCategoryChange() {
    this.serviceType = null;
    this.service = null;
    this.isUnknownService = false;
    this.issue = null;
    if (this.category.id === CATEGORY_ACCOUNT) {
      this.issueParams = {
        category: this.category,
        serviceType: undefined,
      };
    } else {
      this.issueParams = null;
    }
  }

  onServiceTypeChange() {
    this.service = null;
    this.isUnknownService = false;
    this.issue = null;
    this.issueParams = {
      category: this.category,
      serviceType: this.serviceType,
    };
    this.fetchServices();
  }

  onServiceChange() {
    if (this.service) {
      this.isUnknownService = false;
    }
  }

  onUnknownServiceChange() {
    const checked = !this.isUnknownService; // on change is triggered before changes
    if (checked) {
      this.service = null;
    }
    this.issue = null;
  }

  fetchServices() {
    if (!this.serviceType) return this.$q.when();
    this.service = null;
    this.isUnknownService = false;
    this.services = null;
    this.issue = null;
    return this.OvhApiService.Aapi().query({
      type: this.serviceType.route,
      external: false,
    }).$promise.then((items) => {
      this.services = items;
    });
  }

  submitForm(isSuccess) {
    this.onSubmit({
      result: {
        isSuccess,
        issue: this.issue,
        category: this.category,
        serviceType: this.serviceType,
        service: this.service,
      },
    });
  }
}
