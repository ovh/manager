import set from 'lodash/set';
import kebabCase from 'lodash/kebabCase';
import map from 'lodash/map';
import filter from 'lodash/filter';
import { BillingService } from '@ovh-ux/manager-models';

const DOMAIN_SERVICE_TYPE = 'DOMAIN';
export default class {
  /* @ngInject */
  constructor($translate, $http, $q, atInternet, BillingAutoRenew) {
    this.$translate = $translate;
    this.$http = $http;
    this.$q = $q;
    this.atInternet = atInternet;
    this.BillingAutoRenew = BillingAutoRenew;
  }

  $onInit() {
    this.isLoading = false;
    this.cancelAllDom = true;
    this.allDomainsSelected = false;
  }

  toggleSelectAllDomains(selectAll) {
    if (selectAll) {
      this.domains.forEach((domain) => set(domain, 'selected', true));
      this.allDomainsSelected = true;
    } else {
      this.domains.forEach((domain) => set(domain, 'selected', false));
      this.allDomainsSelected = false;
    }
  }

  getSelectedDomains() {
    return this.domains.filter((domain) => domain.selected);
  }

  toggleSelectDomain(select) {
    if (this.allDomainsSelected || !select) {
      this.allDomainsSelected = false;
    } else if (
      select &&
      this.getSelectedDomains().length + 1 === this.domains.length
    ) {
      this.allDomainsSelected = true;
    }
  }

  cancelServices() {
    const domainsSelected = filter(this.domains, (domain) => domain.selected);
    if (this.cancelAllDom || domainsSelected.length > 0) {
      this.isLoading = true;
      const servicesToTerminate = [];
      if (this.cancelAllDom) {
        servicesToTerminate.push(
          this.$http.get(`/allDom/${this.serviceId}/serviceInfos`).then(
            ({ data }) =>
              new BillingService({
                ...data,
                serviceId: data.id,
                serviceType: this.serviceType,
              }),
          ),
        );
        this.trackCancel(this.serviceType);
      }
      domainsSelected.forEach((domain) => {
        servicesToTerminate.push(
          this.$http
            .get(`/domain/${domain.name}/serviceInfos`)
            .then(({ data }) => {
              return new BillingService({
                ...data,
                serviceId: data.id,
                serviceType: DOMAIN_SERVICE_TYPE,
              });
            }),
        );
        this.trackCancel(DOMAIN_SERVICE_TYPE);
      });
      this.$q
        .all(servicesToTerminate)
        .then((services) =>
          map(services, (service) => {
            service.setForResiliation();
            return {
              serviceId: service.domain,
              serviceType: service.serviceType,
              renew: service.renew,
            };
          }),
        )
        .then((services) => this.BillingAutoRenew.updateServices(services))
        .then(() => this.onSuccess())
        .catch((errorPromise) => {
          this.$q.when(errorPromise).then((error) => {
            if (error.messages) {
              this.onPartialSuccess(error.messages);
            } else {
              this.onError(error);
            }
          });
        });
    } else {
      this.goBack();
    }
  }

  getService(serviceId, serviceType) {
    return this.BillingAutoRenew.findService({
      resourceName: serviceId,
      serviceType,
    }).then(
      (service) =>
        new BillingService({
          ...service,
          serviceId: service.id,
        }),
    );
  }

  trackCancel(serviceType) {
    this.atInternet.trackClick({
      name: `autorenew::${kebabCase(serviceType)}::delete::confirm`,
      type: 'action',
      chapter1: 'dedicated',
      chapter2: 'account',
      chapter3: 'billing',
    });
  }

  onSuccess() {
    this.goBack(this.$translate.instant('autorenew_all_dom_terminate_success'));
  }

  onPartialSuccess(errors) {
    const messages = [
      this.$translate.instant('autorenew_all_dom_terminate_error'),
      ...errors.map(
        (message) => `<strong>${message.id}</strong>: ${message.message}`,
      ),
    ];
    this.goBack(messages.join('</br>'), 'danger');
  }

  onError(error) {
    this.goBack(
      this.$translate.instant('autorenew_all_dom_terminate_error', {
        message: error.data?.message || error.message,
      }),
      'danger',
    );
  }
}
