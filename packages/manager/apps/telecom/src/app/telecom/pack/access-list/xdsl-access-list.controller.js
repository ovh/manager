import {
  ELIGIBILITY,
  PAGE_SIZE,
  ACCESS_TYPE,
  URL_CLOSURE_INFO,
} from './xdsl-access-list.constant';

export default class XdslAccessListCtrl {
  /* @ngInject */
  constructor($q, coreURLBuilder, XdslAccessListService, TucToastError) {
    this.$q = $q;
    this.coreURLBuilder = coreURLBuilder;
    this.XdslAccessListService = XdslAccessListService;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.ELIGIBILITY = ELIGIBILITY;
    this.pageSize = PAGE_SIZE;
    this.ACCESS_TYPE = ACCESS_TYPE;

    this.links = {
      copperClosureMore: URL_CLOSURE_INFO,
    };

    this.getServices();
  }

  getServices() {
    this.XdslAccessListService.getServices()
      .then((data) =>
        this.buildServicesList(data || []).then((services) => {
          this.services = services;
        }),
      )
      .catch(({ data }) => {
        this.TucToastError(data.message);
      });
  }

  buildServicesList(services) {
    // Retrieve service info for each service
    const serviceList = services.map((service) => {
      if (service.accessType !== this.ACCESS_TYPE.ftth) {
        return this.XdslAccessListService.getFiberEligibilityList(
          service.accessName,
        ).then((data) =>
          this.createService(
            service,
            data[0].status,
            data[0].copperGridClosureTrajectory,
          ),
        );
      }
      return this.createService(service, this.ELIGIBILITY.not_concerned);
    });
    return this.$q.all(serviceList);
  }

  createService(service, migrationAvailable, copperGridClosureTrajectory) {
    const { accessName, accessType, description, packName } = service;
    const newService = {
      accessName,
      accessType,
      description,
      packName,
      migrationAvailable: migrationAvailable || this.ELIGIBILITY.not_eligible,
      accessLink: this.coreURLBuilder.buildURL(
        'telecom',
        `#/pack/${packName}/xdsl/${accessName}`,
      ),
      migrationLink: this.coreURLBuilder.buildURL(
        'telecom',
        `#/pack/${packName}/migration`,
      ),
    };
    if (copperGridClosureTrajectory) {
      newService.copperGridClosureTrajectory = copperGridClosureTrajectory;
    }
    return newService;
  }
}
