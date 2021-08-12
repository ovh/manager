import filter from 'lodash/filter';
import map from 'lodash/map';
import uniq from 'lodash/uniq';
import sortBy from 'lodash/sortBy';

import { BillingService } from '@ovh-ux/manager-models';

import { AVAILABLE_SERVICES } from '../user-contacts.constants';

export default class {
  /* @ngInject */
  constructor(OvhApiOvhProduct, OvhHttp) {
    this.OvhApiOvhProduct = OvhApiOvhProduct;
    this.OvhHttp = OvhHttp;
  }

  // TODO: Find a way to inject ovh-api-services depending on the service category
  getServiceInfos(service) {
    return this.OvhHttp.get(
      `${service.path}/${window.encodeURIComponent(
        service.serviceName,
      )}/serviceInfos`,
      {
        rootPath: 'apiv6',
      },
    ).then(
      (serviceInfos) =>
        new BillingService({
          ...service,
          ...serviceInfos,
        }),
    );
  }

  changeContact(service) {
    return this.OvhHttp.post(
      `${service.path}/${window.encodeURIComponent(
        service.serviceName,
      )}/changeContact`,
      {
        rootPath: 'apiv6',
        data: {
          contactAdmin: service.contactAdmin,
          contactBilling: service.contactBilling,
          contactTech: service.contactTech,
        },
      },
    );
  }

  getServices() {
    return this.OvhApiOvhProduct.Aapi()
      .query()
      .$promise.then((services) => {
        const availableServices = filter(services, (service) =>
          AVAILABLE_SERVICES.includes(service.category),
        );
        return sortBy(availableServices, ['serviceName', 'category']);
      });
  }

  static getAvailableCategories(services) {
    return uniq(map(services, 'category'));
  }
}
