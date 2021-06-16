import { map } from 'lodash-es';
import { Service } from '@ovh-ux/manager-models';
import { TERMINATION_FORM_NAME } from './confirm-terminate.constants';

export default class BillingTerminate {
  /* @ngInject */
  constructor(coreConfig, OvhApiServices, OvhHttp) {
    this.coreConfig = coreConfig;
    this.OvhApiServices = OvhApiServices;
    this.OvhHttp = OvhHttp;
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
    return this.OvhHttp.post(`${service.path}/confirmTermination`, {
      rootPath: 'apiv6',
      data: {
        token,
      },
    });
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
