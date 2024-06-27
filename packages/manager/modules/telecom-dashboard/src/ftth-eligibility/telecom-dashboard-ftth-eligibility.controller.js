import {
  ELIGIBILITY,
  ACCESS_TYPE,
  CLOSURE_DETAIL_URL,
} from './telecom-dashboard-ftth-eligibility.constant';

export default class FtthEligibilityCtrl {
  /* @ngInject */
  constructor($q, coreURLBuilder, FtthEligibilityService, TucToastError) {
    this.$q = $q;
    this.coreURLBuilder = coreURLBuilder;
    this.FtthEligibilityService = FtthEligibilityService;
    this.TucToastError = TucToastError;
    this.ELIGIBILITY = ELIGIBILITY;
    this.ACCESS_TYPE = ACCESS_TYPE;
  }

  $onInit() {
    this.links = {
      accessList: this.coreURLBuilder.buildURL('telecom', '#/xdsl-access-list'),
      copperClosureMore: CLOSURE_DETAIL_URL,
    };
    this.amountServicesDisplayed = 5;
    this.servicesLength = 0;

    this.getAllServices();
  }

  getAllServices() {
    this.FtthEligibilityService.getAllServices()
      .then((data) => {
        this.servicesLength = data.length;
        if (data.length <= this.amountServicesDisplayed) {
          this.createServiceList(data).then((services) => {
            this.services = services;
          });
        } else {
          // Get only this.amountServicesDisplayed elements from the list
          const limitedServices = data.slice(0, this.amountServicesDisplayed);
          this.createServiceList(limitedServices).then((services) => {
            this.services = services;
          });
        }
      })
      .catch(({ data }) => {
        this.TucToastError(data.message);
      });
  }

  createServiceList(services) {
    // Retrieve service info for each service
    const list = services.map((service) => {
      if (service.accessType !== this.ACCESS_TYPE.ftth) {
        return this.FtthEligibilityService.getFiberEligibilities(
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
    return this.$q.all(list);
  }

  createService(service, migrationAvailable, copperGridClosureTrajectory) {
    const { accessName, accessType, description, packName } = service;
    const createService = {
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
      createService.copperGridClosureTrajectory = copperGridClosureTrajectory;
    }
    return createService;
  }
}
