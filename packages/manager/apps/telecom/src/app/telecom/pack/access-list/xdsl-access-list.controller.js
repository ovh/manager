import {
  ELIGIBILITY,
  PAGE_SIZE,
  ACCESS_TYPE,
  URL_CLOSURE_INFO,
} from './xdsl-access-list.constant';

export default class XdslAccessListCtrl {
  /* @ngInject */
  constructor(
    $filter,
    $q,
    $translate,
    coreURLBuilder,
    XdslAccessListService,
    TucToastError,
  ) {
    this.$filter = $filter;
    this.$q = $q;
    this.$translate = $translate;
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
    return this.XdslAccessListService.getServices()
      .then((data) =>
        this.buildServicesList(data || []).then((services) => {
          this.services = services;
        }),
      )
      .catch(({ data }) => {
        this.TucToastError(data.message);
      });
  }

  static sortList(list) {
    const sorted = list.sort((a, b) => {
      if (a.accessType < b.accessType) {
        return -1;
      }
      if (a.accessType > b.accessType) {
        return 1;
      }

      return 0;
    });
    return sorted;
  }

  static getSortedServiceList(services) {
    // First group by ADSL and VDSL then others access type
    const accessTypeGroupBy = Object.groupBy(services, ({ accessType }) => {
      return [ACCESS_TYPE.adsl, ACCESS_TYPE.vdsl].includes(accessType)
        ? ELIGIBILITY.eligible
        : ELIGIBILITY.not_eligible;
    });

    // Order each group and add them to the sorted services list
    const sortedServicesList = [
      ...this.sortList(accessTypeGroupBy.eligible),
      ...this.sortList(accessTypeGroupBy.not_eligible),
    ];
    return sortedServicesList;
  }

  buildServicesList(services) {
    // Sort services to have ADSL and VDSL services in first positions
    const sortedServices = this.constructor.getSortedServiceList(services);

    // Retrieve service info for each service
    const serviceList = sortedServices.map((service) => {
      if (
        ![this.ACCESS_TYPE.ftth, this.ACCESS_TYPE.sdsl].includes(
          service.accessType,
        )
      ) {
        return this.XdslAccessListService.getFiberEligibilityList(
          service.accessName,
        )
          .then((data) =>
            this.createService(
              service,
              data[0].status,
              data[0].copperGridClosureTrajectory,
            ),
          )
          .catch(() =>
            this.createService(service, this.ELIGIBILITY.not_concerned),
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
    // Set closure date
    newService.closureDate = this.$translate.instant(
      'xdsl_access_list_not_concerned',
    );
    if (copperGridClosureTrajectory) {
      newService.copperGridClosureTrajectory = copperGridClosureTrajectory;
      if (migrationAvailable) {
        if (copperGridClosureTrajectory.technicalClosureDate) {
          newService.closureDate = this.$filter('date')(
            copperGridClosureTrajectory.technicalClosureDate,
            'shortDate',
          );
        } else {
          newService.closureDate = this.$translate.instant(
            'xdsl_access_list_not_available',
          );
        }
      }
    }
    return newService;
  }
}
