import map from 'lodash/map';
import uniq from 'lodash/uniq';

import { BillingService } from '@ovh-ux/manager-models';


export default class {
  /* @ngInject */
  constructor(OvhHttp) {
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
      `${service.path}/${service.serviceName}/changeContact`,
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
    return this.OvhHttp.get(`/contacts/services`, {
      rootPath: '2api',
    }).then((services) =>
      services.map((service) => new BillingService(service)),
    );
  }

  static getAvailableCategories(services) {
    return uniq(map(services, 'serviceType'));
  }
}
