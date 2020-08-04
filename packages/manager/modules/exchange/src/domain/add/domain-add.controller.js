import clone from 'lodash/clone';
import debounce from 'lodash/debounce';
import filter from 'lodash/filter';
import get from 'lodash/get';
import head from 'lodash/head';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';

import { Environment } from '@ovh-ux/manager-config';

export default class ExchangeAddDomainController {
  /* @ngInject */
  constructor(
    $rootScope,
    $scope,
    Exchange,
    ExchangeDomains,
    messaging,
    navigation,
    ovhUserPref,
    $translate,
    WucValidator,
    exchangeVersion,
    exchangeServiceInfrastructure,
    User,
  ) {
    this.services = {
      $rootScope,
      $scope,
      Exchange,
      ExchangeDomains,
      messaging,
      navigation,
      ovhUserPref,
      $translate,
      WucValidator,
      exchangeVersion,
      exchangeServiceInfrastructure,
    };

    this.OVH_DOMAIN = 'ovh-domain';
    this.NON_OVH_DOMAIN = 'non-ovh-domain';
    this.exchange = Exchange.value;

    this.debouncedResetName = debounce(this.search, 300);

    this.$routerParams = Exchange.getParams();
    this.noDomainAttached = get(
      navigation.currentActionData,
      'noDomainAttached',
      true,
    );
    this.loading = false;
    this.model = {
      name: '',
      displayName: '',
      isUTF8Domain: false,
      srvParam: true,
      mxParam: false,
      domainType: this.OVH_DOMAIN,
    };

    this.search = {
      value: null,
    };

    this.ovhDomain = this.OVH_DOMAIN;
    this.nonOvhDomain = this.NON_OVH_DOMAIN;

    $scope.loadDomainData = () => this.loadDomainData();
    $scope.addDomain = () => this.addDomain();
    $scope.isNonOvhDomainValid = () => this.isNonOvhDomainValid();
    $scope.checkDomain = () => this.checkDomain();
    $scope.isStep2Valid = () => this.isStep2Valid();
    $scope.checkDomainType = () => this.checkDomainType();
    $scope.isStep3Valid = () => this.isStep3Valid();

    User.getUser().then((currentUser) => {
      this.canOpenWizard = currentUser.ovhSubsidiary !== 'CA';
    });
  }

  isStep3Valid() {
    return this.model.type;
  }

  onSearchValueChange() {
    this.debouncedResetName();
  }

  prepareData(data) {
    this.loading = false;
    this.availableDomains = data.availableDomains;
    this.availableDomainsBuffer = data.availableDomains;
    this.availableTypes = data.types;
    this.availableMainDomains = data.mainDomains;
    this.model.type = head(this.availableTypes);

    if (isEmpty(this.availableDomains)) {
      this.model.domainType = this.NON_OVH_DOMAIN;
      this.model.srvParam = false;
      this.model.mxParam = false;
    }
  }

  check2010Provider() {
    if (this.exchange == null) {
      return;
    }

    const isProviderAccount = this.services.exchangeServiceInfrastructure.isProvider();

    if (
      this.availableMainDomains != null &&
      isProviderAccount &&
      this.services.exchangeVersion.isVersion(2010)
    ) {
      this.setOrganization2010 = true;

      if (isEmpty(this.availableMainDomains)) {
        this.model.main = true;
        this.model.organization2010 = null;
      } else {
        this.model.main = false;
        this.model.attachOrganization2010 = head(this.availableMainDomains);
      }
    }
  }

  openingWizard() {
    return this.services.ovhUserPref
      .assign('WIZARD_HOSTED_CREATION_OPENING_PREFERENCE', {
        shouldOpenWizard: true,
      })
      .finally(() => {
        this.services.$rootScope.$broadcast(
          'exchange.wizard_hosted_creation.display',
        );
        this.services.navigation.resetAction();
      });
  }

  prepareModel() {
    if (this.setOrganization2010) {
      if (this.model.main) {
        delete this.model.organization2010;
      } else {
        this.model.organization2010 = this.model.attachOrganization2010.name;
      }

      delete this.model.attachOrganization2010;
    }

    delete this.model.domainType;
    delete this.model.isUTF8Domain;
    delete this.model.displayName;
  }

  // eslint-disable-next-line class-methods-use-this
  getDefaultLanguage() {
    return Environment.getUserLocale();
  }

  // eslint-disable-next-line class-methods-use-this
  isFrenchLanguage() {
    return Environment.getUserLanguage() === 'fr';
  }

  loadDomainData() {
    this.loading = true;

    this.services.ExchangeDomains.retrievingDataToCreateDomains(
      this.$routerParams.organization,
      this.$routerParams.productId,
    )
      .then((data) => {
        this.loading = false;
        this.prepareData(data);
        this.check2010Provider();
      })
      .catch((failure) => {
        this.services.navigation.resetAction();
        this.services.messaging.writeError(
          this.services.$translate.instant('exchange_tab_domain_add_failure'),
          failure,
        );
      });
  }

  resetSearchValue() {
    this.search.value = null;
    this.availableDomains = clone(this.availableDomainsBuffer);
  }

  addDomain() {
    this.prepareModel();

    this.services.ExchangeDomains.addingDomain(this.model)
      .then(() => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant('exchange_tab_domain_add_success'),
        );
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant('exchange_tab_domain_add_failure'),
          failure,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }

  resetName() {
    this.model.displayName = '';
    this.model.name = '';
  }

  search() {
    this.resetName();

    if (!isEmpty(this.search.value)) {
      this.availableDomains = filter(
        this.availableDomainsBuffer,
        (currentItem) => includes(currentItem.displayName, this.search.value),
      );
    }

    this.services.$scope.$apply();
  }

  checkDomain() {
    if (this.model.domainType === this.NON_OVH_DOMAIN) {
      this.model.srvParam = false;
      this.services.$rootScope.$broadcast('wizard-goToStep', 3);
    }
  }

  checkDomainType() {
    if (this.model.domainType === this.NON_OVH_DOMAIN) {
      this.services.$rootScope.$broadcast('wizard-goToStep', 1);
    }
  }

  changeName() {
    this.model.name = punycode.toASCII(this.model.displayName);
    this.model.isUTF8Domain = this.model.displayName !== this.model.name;
  }

  isStep2Valid() {
    return (
      this.model.type === 'AUTHORITATIVE' ||
      (this.model.mxRelay != null && this.model.type === 'NON_AUTHORITATIVE')
    );
  }

  isNonOvhDomainValid() {
    return (
      this.model.name &&
      (this.model.domainType !== this.NON_OVH_DOMAIN ||
        this.services.WucValidator.isValidDomain(this.model.displayName))
    );
  }
}
