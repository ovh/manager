import get from 'lodash/get';
import head from 'lodash/head';
import map from 'lodash/map';
import pick from 'lodash/pick';
import reduce from 'lodash/reduce';
import values from 'lodash/values';

import { BillingService } from '@ovh-ux/manager-models';
import {
  AUTORENEW_EVENT,
  CONTRACTS_IDS,
  SERVICE_EXPIRATION,
  SERVICE_STATES,
  SERVICE_STATUS,
  SERVICE_RENEW_MODES,
  SERVICE_TYPES,
  SERVICE_INFOS_URLS_BY_TYPE,
  SERVICE_NAME_PLACEHOLDER,
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
    $http,
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
    this.$http = $http;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.OvhApiMeAutorenew = OvhApiMeAutorenew;
    this.queryParams = {};

    this.events = {
      AUTORENEW_CHANGES: AUTORENEW_EVENT,
    };
  }

  static getServiceInfosUrl(service) {
    if (service.route?.url) {
      return `${service.route.url}/serviceInfos`;
    }

    const pattern = SERVICE_INFOS_URLS_BY_TYPE[service.serviceType];
    if (!pattern) {
      return null;
    }

    return pattern.replace(SERVICE_NAME_PLACEHOLDER, service.serviceId);
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
    refresh,
  ) {
    const headers = refresh ? { Pragma: 'no-cache' } : {};
    return this.OvhHttp.get('/billing/services', {
      rootPath: '2api',
      params: {
        count,
        offset,
        search,
        type,
        renewDateType,
        status,
        state,
        order: JSON.stringify(order),
        nicBilling,
      },
      headers,
    });
  }

  findService({ resourceName, serviceType, serviceId }) {
    return this.OvhHttp.get('/billing/services', {
      rootPath: '2api',
      params: {
        resourceName,
        serviceId,
        serviceType,
        count: 1,
        offset: 0,
      },
    })
      .then((services) => head(services.list.results))
      .then((service) => new BillingService(service));
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
    return Object.values(SERVICE_STATUS).reduce(
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

  updateService(service) {
    const url = this.constructor.getServiceInfosUrl(service);

    if (!url) {
      return this.$q.reject({
        data: {
          message: 'Unsupported serviceType',
        },
      });
    }

    return this.OvhHttp.put(url, {
      rootPath: 'apiv6',
      data: {
        renew: service.renew,
      },
    }).catch((error) => {
      return this.$q.reject({
        data: {
          message: error.message,
        },
      });
    });
  }

  updateServices(updateList) {
    const updatePromises = updateList.map((service) =>
      this.updateService(service).catch((error) => ({
        id: service.serviceId,
        message: error?.data?.message || error.message || 'Unknown error',
        type: 'ERROR',
      })),
    );

    return this.$q.all(updatePromises).then((results) => {
      const errors = results.filter((result) => result?.type === 'ERROR');

      if (errors.length > 0) {
        return this.$q.reject({
          messages: errors,
          state: 'PARTIAL',
        });
      }

      return {
        messages: [],
        state: 'OK',
      };
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

  putServiceV6(service, data = {}) {
    return this.OvhHttp.put('/services/{id}', {
      rootPath: 'apiv6',
      urlParams: {
        id: service.id,
      },
      data,
    });
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

  terminateHostingSkipRetentionPeriod(serviceId) {
    return this.$http.post(
      `/services/${serviceId}/terminate/skipRetentionPeriod`,
    );
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
    const agreementsPromise =
      agreements && service.hasAutomaticRenew()
        ? this.DucUserContractService.acceptAgreements(agreements)
        : Promise.resolve([]);

    return agreementsPromise.then(() => {
      if (service?.serviceType === SERVICE_TYPES.ZIMBRA_SLOT) {
        const mode = service?.renew?.automatic
          ? SERVICE_RENEW_MODES.AUTOMATIC
          : SERVICE_RENEW_MODES.MANUAL;

        const period =
          Number.isInteger(service?.renew?.period) || !service?.renew?.period
            ? `P${service?.renew?.period || 1}M`
            : service?.renew?.period;

        return this.putServiceV6(service, {
          renew: {
            mode,
            ...(mode === SERVICE_RENEW_MODES.AUTOMATIC && {
              period,
            }),
          },
        });
      }

      const toUpdate = {
        ...pick(service, ['serviceId', 'serviceType', 'renew']),
        renew: {
          ...service.renew,
          period: service.renew.period,
        },
      };

      toUpdate.route = get(service, 'route.url');
      return this.updateServices([toUpdate]);
    });
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
          hasDefaultPaymentMethod && this.coreConfig.isRegion('EU'),
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

  setQueryParams(params) {
    this.queryParams = params;
  }

  getQueryParams() {
    return this.queryParams || {};
  }
}
