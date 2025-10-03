import { map } from 'lodash-es';
import { Service } from '@ovh-ux/manager-models';
import {
  SERVICE_GROUP_WITH_AGORA_TERMINATION_REGEX,
  SERVICE_WITH_AGORA_TERMINATION,
  TERMINATION_FORM_NAME,
  SERVICE_TYPES_WITH_AGORA_TERMINATION,
} from './confirm-terminate.constants';

export default class BillingTerminate {
  /* @ngInject */
  constructor(coreConfig, OvhApiServices, OvhHttp, $http) {
    this.coreConfig = coreConfig;
    this.OvhApiServices = OvhApiServices;
    this.OvhHttp = OvhHttp;
    this.$http = $http;
  }

  getServiceApi(serviceId, forceRefresh) {
    const params = {
      rootPath: 'apiv6',
      cache: 'billingTerminateService',
    };
    if (forceRefresh) {
      delete params.cache;
    }
    return this.OvhHttp.get(`/services/${serviceId}`, params).then(
      (service) =>
        new Service(
          {
            serviceId,
            ...service,
          },
          this.coreConfig.getUserLocale(),
        ),
    );
  }

  static hasAgoraTermination(planCode, serviceType) {
    return (
      SERVICE_WITH_AGORA_TERMINATION.includes(planCode) ||
      SERVICE_GROUP_WITH_AGORA_TERMINATION_REGEX.test(planCode) ||
      (serviceType &&
        SERVICE_TYPES_WITH_AGORA_TERMINATION.includes(serviceType))
    );
  }

  confirmTermination(service, token) {
    const planCode = service.billing?.plan?.code || '';
    return BillingTerminate.hasAgoraTermination(planCode, service.productType)
      ? this.$http.post(`/services/${service.serviceId}/terminate/confirm`, {
          token,
        })
      : this.$http.post(`${service.path}/confirmTermination`, { token });
  }

  serviceTermination(serviceId, hasMailConfirmation = true) {
    return hasMailConfirmation
      ? this.$http.post(`/services/${serviceId}/terminate`)
      : this.$http.delete(`/services/${serviceId}`);
  }

  serviceTerminationForVrack(serviceId) {
    return this.$http.post(`/vrack/${serviceId}/terminate`);
  }

  getTerminationForm(serviceId) {
    return this.OvhApiServices.Form()
      .v6()
      .get({
        serviceId,
        formName: TERMINATION_FORM_NAME,
      }).$promise;
  }

  answerForm({ serviceId }, answers) {
    return this.OvhApiServices.Form()
      .v6()
      .answer(
        {
          serviceId,
          formName: TERMINATION_FORM_NAME,
        },
        {
          answers: map(answers, (value, question) => ({ question, value })),
        },
      ).$promise;
  }
}
