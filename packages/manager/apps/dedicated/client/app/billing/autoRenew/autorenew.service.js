import head from 'lodash/head';
import map from 'lodash/map';
import pick from 'lodash/pick';
import reduce from 'lodash/reduce';
import set from 'lodash/set';
import values from 'lodash/values';

import { BillingService } from '@ovh-ux/manager-models';
import {
  AUTORENEW_EVENT,
  CONTRACTS_IDS,
  SERVICE_EXPIRATION,
  SERVICE_STATES,
  SERVICE_STATUS,
} from './autorenew.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $window,
    constants,
    coreConfig,
    DucUserContractService,
    OvhApiBillingAutorenewServices,
    OvhApiEmailExchange,
    OvhApiMeAutorenew,
    OvhHttp,
    ovhPaymentMethod,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.$window = $window;
    this.constants = constants;
    this.coreConfig = coreConfig;
    this.DucUserContractService = DucUserContractService;
    this.OvhApiBillingAutorenewServices = OvhApiBillingAutorenewServices;
    this.OvhApiEmailExchange = OvhApiEmailExchange;
    this.OvhHttp = OvhHttp;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.OvhApiMeAutorenew = OvhApiMeAutorenew;

    this.events = {
      AUTORENEW_CHANGES: AUTORENEW_EVENT,
    };
  }

  getAllServices() {
    return this.OvhApiBillingAutorenewServices.Aapi().query().$promise;
  }

  getServices(
    count,
    offset,
    search,
    type,
    renewDateType,
    status,
    state,
    order,
    nicBilling,
  ) {
    return this.OvhApiBillingAutorenewServices.Aapi().query({
      count,
      offset,
      search,
      type,
      renewDateType,
      status,
      state,
      order: JSON.stringify(order),
      nicBilling,
    }).$promise;
  }

  getService(serviceId) {
    return this.OvhApiBillingAutorenewServices.Aapi()
      .query({
        search: serviceId,
      })
      .$promise.then(
        (services) => new BillingService(head(services.list.results)),
      );
  }

  getServicesTypes(services) {
    return reduce(
      services.servicesTypes,
      (serviceTypes, service) => ({
        ...serviceTypes,
        [service]: this.$translate.instant(
          `billing_autorenew_service_type_${service}`,
        ),
      }),
      {},
    );
  }

  getStatusTypes() {
    return reduce(
      SERVICE_STATUS,
      (translatedStatus, status) => ({
        ...translatedStatus,
        [status]: this.$translate.instant(
          `billing_autorenew_service_status_${status}`,
        ),
      }),
      {},
    );
  }

  getStatesTypes() {
    return reduce(
      SERVICE_STATES,
      (states, state) => ({
        ...states,
        [state]: this.$translate.instant(
          `billing_autorenew_service_state_${state}`,
        ),
      }),
      {},
    );
  }

  getExpirationFilterTypes() {
    return reduce(
      SERVICE_EXPIRATION,
      (expirations, expirationType) => ({
        ...expirations,
        [expirationType]: this.$translate.instant(
          `billing_autorenew_service_expiration_${expirationType}`,
        ),
      }),
      {},
    );
  }

  updateServices(updateList) {
    return this.OvhApiBillingAutorenewServices.Aapi()
      .put(
        {},
        {
          updateList,
        },
      )
      .$promise.then((result) => {
        if (result.state === 'OK') {
          return result;
        }
        set(result, 'state', 'ERROR');
        return this.$q.reject(result);
      });
  }

  updateService(service) {
    return this.OvhApiBillingAutorenewServices.Aapi()
      .put(
        {},
        {
          updateList: [service],
        },
      )
      .$promise.then((result) => {
        if (result.state === 'OK') {
          return result;
        }
        return this.$q.reject(result);
      });
  }

  getAutorenew() {
    return this.OvhApiMeAutorenew.v6()
      .query()
      .$promise.catch((err) => {
        if (err.status === 404) {
          return {
            active: false,
          };
        }
        throw err;
      });
  }

  putAutorenew(renewParam) {
    return this.OvhApiMeAutorenew.v6().update(renewParam).$promise;
  }

  enableAutorenew(renewDay) {
    return this.OvhApiMeAutorenew.v6().create({
      renewDay,
    }).$promise;
  }

  disableAutoRenewForDomains() {
    return this.OvhHttp.post('/me/manualDomainPayment', {
      rootPath: 'apiv6',
    });
  }

  terminateHosting(serviceName) {
    return this.OvhHttp.post('/hosting/web/{hosting}/terminate', {
      rootPath: 'apiv6',
      urlParams: {
        hosting: serviceName,
      },
    });
  }

  terminateEmail(serviceName) {
    return this.OvhHttp.post('/email/domain/{domain}/terminate', {
      rootPath: 'apiv6',
      urlParams: {
        domain: serviceName,
      },
    });
  }

  terminateHostingPrivateDatabase(serviceName) {
    return this.OvhHttp.post(
      '/hosting/privateDatabase/{serviceName}/terminate',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
      },
    );
  }

  getEmailInfos(serviceName) {
    return this.OvhHttp.get('/email/domain/{domain}', {
      rootPath: 'apiv6',
      urlParams: {
        domain: serviceName,
      },
    });
  }

  getUserCertificates() {
    return this.OvhHttp.get('/me/certificates', {
      rootPath: 'apiv6',
    });
  }

  getExchangeService(organization, exchange) {
    return this.OvhApiEmailExchange.service()
      .Aapi()
      .get({
        organization,
        exchange,
      }).$promise;
  }

  getAutorenewAgreements() {
    return this.DucUserContractService.getAgreementsToValidate(
      ({ contractId }) => values(CONTRACTS_IDS).includes(contractId),
    ).then((contracts) =>
      map(contracts, ({ code: name, pdf: url, id }) => ({ name, url, id })),
    );
  }

  updateRenew(service, agreements) {
    const agreementsPromise = service.hasAutomaticRenew()
      ? this.DucUserContractService.acceptAgreements(agreements)
      : Promise.resolve([]);
    return agreementsPromise.then(() =>
      this.updateServices([
        pick(service, ['serviceId', 'serviceType', 'renew']),
      ]),
    );
  }

  /* eslint-disable class-methods-use-this */
  userIsBillingOrAdmin(service, user) {
    return (
      service &&
      Boolean(
        user &&
          (service.contactBilling === user.nichandle ||
            service.contactAdmin === user.nichandle),
      )
    );
  }
  /* eslint-enable class-methods-use-this */

  hasRenewDay() {
    return this.ovhPaymentMethod
      .hasDefaultPaymentMethod()
      .then(
        (hasDefaultPaymentMethod) =>
          hasDefaultPaymentMethod && this.coreConfig.getRegion() === 'EU',
      );
  }

  setNicRenew(nicRenew) {
    const { active, renewDay, isMandatory } = nicRenew;
    return !isMandatory
      ? this.enableAutorenew(renewDay)
      : this.putAutorenew({ active, renewDay });
  }

  isAutomaticRenewV2Available() {
    return this.coreConfig.isRegion('EU');
  }
}
