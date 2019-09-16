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
    this.categories = null;
    this.serviceTypes = null;
    this.services = [];
    this.issues = null;
  }

  $onInit() {
    this.loading = true;
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
    }).finally(() => {
      this.loading = false;
    });
  }

  get guides() {
    const result = [];
    (this.issues || []).forEach((issue) => {
      issue.selfCareResources.forEach((resource) => {
        if (resource.type === 'guide') {
          result.push(resource);
        }
      });
    });
    return result;
  }

  get tips() {
    const result = [];
    (this.issues || []).forEach((issue) => {
      issue.selfCareResources.forEach((resource) => {
        if (resource.type === 'tip') {
          result.push(resource);
        }
      });
    });
    return result;
  }

  onCategoryChange() {
    this.issues = null;
    this.serviceType = null;
    this.fetchServices();
  }

  onServiceTypeChange() {
    this.issues = null;
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
  }

  onIssues(issues) {
    this.issues = issues;
  }

  fetchServices() {
    if (!this.serviceType) return this.$q.when();
    this.service = null;
    this.isUnknownService = false;
    this.services = null;
    return this.OvhApiService.Aapi().query({
      type: this.serviceType.route,
      external: false,
    }).$promise.then((items) => {
      this.services = items;
      if (!items.length) {
        this.isUnknownService = true;
      }
    });
  }

  submitForm(isSuccess) {
    this.onSubmit({
      result: {
        isSuccess,
        issues: this.issues,
        category: this.category,
        serviceType: this.serviceType,
        service: this.service,
      },
    });
  }
}
