import { map } from 'lodash-es';
import { Service } from '@ovh-ux/manager-models';
import {
  SERVICE_WITH_AGORA_TERMINATION,
  TERMINATION_FORM_NAME,
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

  confirmTermination(service, token) {
    const isAgoraService = SERVICE_WITH_AGORA_TERMINATION.includes(
      service.billing?.plan?.code || '',
    );
    return isAgoraService
      ? this.$http.post(`/services/${service.serviceId}/terminate/confirm`, {
          token,
        })
      : this.$http.post(`${service.path}/confirmTermination`, { token });
  }

  serviceTermination(serviceId) {
    return this.$http.post(`/services/${serviceId}/terminate`);
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
