import { map } from 'lodash-es';
import { Service } from '@ovh-ux/manager-models';
import {
  SERVICE_GROUP_WITH_AGORA_TERMINATION_REGEX,
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

  static hasAgoraTermination(planCode) {
    return (
      SERVICE_WITH_AGORA_TERMINATION.includes(planCode) ||
      SERVICE_GROUP_WITH_AGORA_TERMINATION_REGEX.test(planCode)
    );
  }

  confirmTermination(service, token) {
    const planCode = service.billing?.plan?.code || '';
    return BillingTerminate.hasAgoraTermination(planCode)
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

  /* eslint-disable class-methods-use-this */
  getTerminationForm(serviceId) {
    console.warn(serviceId);
    return new Promise((resolve) => {
      resolve({
        name: 'termination',
        questions: [
          {
            answers: [
              {
                key: 'TOO_EXPENSIVE',
              },
              {
                key: 'WRONG_ORDER',
              },
              {
                key: 'PRODUCT_TOOLS_DONT_SUIT_ME',
              },
              {
                key: 'NOT_NEEDED_ANYMORE',
              },
              {
                key: 'LACK_OF_PERFORMANCES',
              },
              {
                key: 'OTHER',
              },
            ],
            question: 'reason',
            type: 'enum',
            mandatory: true,
          },
          {
            question: 'commentary_reason',
            type: 'text',
            mandatory: false,
          },
          {
            answers: [
              {
                key: 'NOT_REPLACING_SERVICE',
              },
              {
                key: 'SUBSCRIBE_AN_OTHER_SERVICE',
              },
              {
                key: 'SUBSCRIBE_OTHER_KIND_SERVICE_WITH_COMPETITOR',
              },
              {
                key: 'OTHER',
              },
            ],
            question: 'future_use',
            type: 'enum',
            mandatory: true,
          },
          {
            question: 'commentary_future_use',
            type: 'text',
            mandatory: false,
          },
        ],
      });
    });
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
