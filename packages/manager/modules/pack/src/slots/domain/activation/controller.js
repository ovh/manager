import forEach from 'lodash/forEach';
import get from 'lodash/get';
import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';

export default class {
  /* @ngInject */
  constructor(
    $stateParams,
    $translate,
    $q,
    $state,
    $timeout,
    OvhApiPackXdslDomainActivation,
    OvhApiMe,
    OvhSimpleCountryList,
    TucToast,
  ) {
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$q = $q;
    this.$state = $state;
    this.$timeout = $timeout;
    this.OvhApiPackXdslDomainActivation = OvhApiPackXdslDomainActivation;
    this.OvhApiMe = OvhApiMe;
    this.OvhSimpleCountryList = OvhSimpleCountryList;
    this.TucToast = TucToast;
  }

  $onInit() {
    /* Only for submitted data */
    this.model = {
      action: null, // Enum: [create | transfert | trade]
      authInfo: null,
      domain: null,
      tld: null,
    };

    /* All data who should not be in the model (not submitted) */
    this.locker = {
      packName: null,
      tldList: [],
      activatedDomains: null,
      fqdn: null, // Fully Qualified Domain Name (domain.tld)
    };

    /* State machine used to manipulate the view */
    this.toggles = {
      domainStatus: null,
      domainLoading: false,
      domainIsActivable: false,
      transfertWanted: false,
      authMethod: null,
    };

    if (isEmpty(this.$stateParams.packName)) {
      this.TucToast.error(this.$translate.instant('domain_activation_total_error'));
      return this.$q.when(null);
    }

    this.locker.packName = this.$stateParams.packName;
    this.locker.activatedDomains = [];

    this.countries = this.OvhSimpleCountryList.asDataForSelect;

    this.checkDomainResponsibilityTimeout = null;
    this.scheduleCheckDomainDisponibility();

    this.isLoading = true;

    return this.$q.all([
      this.getUser(),
      this.loadActivatedDomains(),
      this.loadAvailableTlds(),
    ])
      .catch((error) => {
        this.TucToast.error([this.$translate.instant('domain_activation_total_error'), get(error, 'data.message')].join(' '));
        return this.$q.reject(error);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  scheduleCheckDomainDisponibility() {
    if (this.checkDomainResponsibilityTimeout) {
      this.$timeout.cancel(this.checkDomainResponsibilityTimeout);
    }
    this.checkDomainResponsibilityTimeout = this.$timeout(
      () => this.checkDomainDisponibility(),
      800,
    );
  }

  getUser() {
    return this.OvhApiMe
      .v6()
      .get()
      .$promise;
  }

  loadAvailableTlds() {
    return this.OvhApiPackXdslDomainActivation
      .v6()
      .getTlds({
        packId: this.locker.packName,
      }, (data) => {
        this.locker.tldList = [];
        forEach(data, (elt) => {
          this.locker.tldList.push({
            value: elt,
            label: `.${elt}`,
          });
        });
        this.model.tld = head(data);
      })
      .$promise;
  }

  loadActivatedDomains() {
    return this.OvhApiPackXdslDomainActivation
      .v6()
      .getServices({
        packId: this.locker.packName,
      }, (data) => {
        this.locker.activatedDomains = data;
      })
      .$promise;
  }

  setDomainIsAvailable() {
    this.toggles.domainStatus = 'available';
    this.model.action = 'create';
  }

  setDomainIsNotAvailable() {
    this.toggles.domainStatus = 'unavailable';
    this.model.action = 'transfer';
  }

  checkDomainDisponibility() {
    /* we have to reset some previous setting to avoid some strange… things */
    this.toggles.transfertWanted = false;
    this.toggles.domainStatus = null;
    this.toggles.authMethod = null;
    this.toggles.domainLoading = false;

    if (!this.model.domain) {
      this.locker.fqdn = null;
      return;
    }

    this.locker.fqdn = [this.model.domain, this.model.tld].join('.');

    if (~this.locker.activatedDomains.indexOf(this.locker.fqdn)) { // eslint-disable-line
      this.toggles.domainStatus = 'alreadyActivated';
    } else {
      this.toggles.domainLoading = true;

      this.OvhApiPackXdslDomainActivation
        .Aapi()
        .checkDisponibility({
          packId: this.$stateParams.packName,
          domain: this.model.domain,
          language: 'fr',
        })
        .$promise
        .then((data) => {
          // if the model still match the request
          if (data && data.domain === this.model.domain) {
            if (!data.search) {
              this.TucToast.error(this.$translate.instant('domain_activation_error_on_check_disponibility'));
              return;
            }

            this.setDomainIsNotAvailable();
            forEach(data.search, (search) => {
              if (search.available && search.tld === this.model.tld) {
                this.setDomainIsAvailable();
              }
            });

            // TODO: IF NOT this.toggles.domainStatus THEN ERROR !!
          }
        })
        .catch((err) => {
          this.TucToast.error([this.$translate.instant('domain_activation_error_on_check_disponibility'), get(err, 'data.message')].join(' '));
          return this.$q.reject(err);
        })
        .finally(() => {
          this.toggles.domainLoading = false;
        });
    }
  }

  toggleTransfertWanted() {
    this.toggles.transfertWanted = !this.toggles.transfertWanted;
  }

  submit() {
    const data = pick(
      this.model,
      [
        'packName',
        'action',
        'authInfo',
        'domain',
        'tld',
      ],
    );

    this.isActivating = true;
    this.OvhApiPackXdslDomainActivation
      .v6()
      .postServices({
        packId: this.locker.packName,
      }, data)
      .$promise
      .then(() => {
        this.TucToast.success(this.$translate.instant('domain_activation_domain_is_saved'));

        this.$timeout(() => {
          // this.$state.go('pack', {
          //   packName: this.$stateParams.packName,
          // });
        }, 2000);
      })
      .catch((err) => {
        this.TucToast.error([this.$translate.instant('domain_activation_unable_to_save_domain'), get(err, 'data.message')].join(' '));
        return this.$q.reject(err);
      })
      .finally(() => {
        this.isActivating = false;
      });
  }
}
