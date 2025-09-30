import { SUPPORT_URLS } from '../../../../apps/telecom/src/app/app.constants';
import {
  ELIGIBILITY,
  ACCESS_TYPE,
  CLOSURE_DETAIL_URL,
} from './telecom-dashboard-ftth-eligibility.constant';

export default class FtthEligibilityCtrl {
  /* @ngInject */
  constructor(
    $q,
    coreConfig,
    coreURLBuilder,
    FtthEligibilityService,
    TucToastError,
  ) {
    this.$q = $q;
    this.coreConfig = coreConfig;
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

    this.user = this.coreConfig.getUser();
    this.supportUrl = SUPPORT_URLS.createTicket + this.user.ovhSubsidiary;

    this.getAllServices();
  }

  static sortList(listToSort) {
    const sorted = listToSort.sort((a, b) => {
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

  static getAccessSorted(services) {
    // Group by access type to display first ADSL and VDSL access
    const groupBy = Object.groupBy(services, ({ accessType }) => {
      return [ACCESS_TYPE.adsl, ACCESS_TYPE.vdsl].includes(accessType)
        ? ELIGIBILITY.eligible
        : ELIGIBILITY.not_eligible;
    });
    const eligible = groupBy.eligible ? this.sortList(groupBy.eligible) : [];
    const notEligible = groupBy.not_eligible
      ? this.sortList(groupBy.not_eligible)
      : [];

    const sorted = [...eligible, ...notEligible];
    return sorted;
  }

  getAllServices() {
    this.FtthEligibilityService.getAllServices()
      .then((data) => {
        this.servicesLength = data.length;

        const sorted = this.constructor.getAccessSorted(data);
        if (sorted.length <= this.amountServicesDisplayed) {
          this.createServiceList(sorted).then((services) => {
            this.services = services;
          });
        } else {
          // Get only this.amountServicesDisplayed elements from the list
          const limitedServices = sorted.slice(0, this.amountServicesDisplayed);
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
            data[0].firstCopperClosure,
          ),
        );
      }
      return this.createService(service, this.ELIGIBILITY.not_concerned);
    });
    return this.$q.all(list);
  }

  createService(service, migrationAvailable, firstCopperClosure) {
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
    if (firstCopperClosure) {
      createService.firstCopperClosure = firstCopperClosure;
    }
    return createService;
  }
}
