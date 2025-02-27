import clone from 'lodash/clone';
import debounce from 'lodash/debounce';
import filter from 'lodash/filter';
import get from 'lodash/get';
import head from 'lodash/head';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';

import punycode from 'punycode';
import {
  DOMAIN_ORDER_URL,
  CONFIGURATION_MODE,
  DEFAULT_OVH_TARGET_SERVER_URL,
  DOMAIN_MODE,
} from './domain.constants';

export default class ExchangeAddDomainController {
  /* @ngInject */
  constructor(
    $rootScope,
    $scope,
    wucExchange,
    ExchangeDomains,
    coreConfig,
    messaging,
    navigation,
    ovhUserPref,
    $translate,
    WucValidator,
    exchangeVersion,
    exchangeServiceInfrastructure,
    WucUser,
  ) {
    this.services = {
      $rootScope,
      $scope,
      wucExchange,
      ExchangeDomains,
      coreConfig,
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
    this.exchange = wucExchange.value;
    this.DOMAIN_ORDER_URL =
      DOMAIN_ORDER_URL[coreConfig.getUser().ovhSubsidiary] ||
      DOMAIN_ORDER_URL.FR;
    this.CONFIGURATION_MODE = CONFIGURATION_MODE;
    this.DEFAULT_OVH_TARGET_SERVER_URL = DEFAULT_OVH_TARGET_SERVER_URL;

    this.debouncedResetName = debounce(this.search, 300);

    this.$routerParams = wucExchange.getParams();
    this.noDomainAttached = get(
      navigation.currentActionData,
      'noDomainAttached',
      true,
    );
    this.loading = false;
    this.isOvhDomain = true;
    this.model = {
      name: '',
      displayName: '',
      isUTF8Domain: false,
      srvParam: true,
      mxParam: true,
      configureSPF: true,
      configureDKIM: true,
      domainType: this.OVH_DOMAIN,
      mxRelay: '',
      configMode: this.CONFIGURATION_MODE.RECOMMENDED,
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

    WucUser.getUser().then((currentUser) => {
      this.canOpenWizard = currentUser.ovhSubsidiary !== 'CA';
    });
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

    if (isEmpty(this.availableDomains)) {
      this.model.domainType = this.NON_OVH_DOMAIN;
      this.isOvhDomain = false;
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

  shouldConfigureRecord(value) {
    return (
      (!!value || this.model.configMode === CONFIGURATION_MODE.RECOMMENDED) &&
      this.isOvhDomain
    );
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
    this.model.srvParam = this.shouldConfigureRecord(this.model.srvParam);
    this.model.mxParam = this.shouldConfigureRecord(this.model.mxParam);
    this.model.configureDKIM = this.shouldConfigureRecord(
      this.model.configureDKIM,
    );
    this.model.configureSPF = this.shouldConfigureRecord(
      this.model.configureSPF,
    );
    this.model.autoEnableDKIM = this.model.configureDKIM;

    this.model.type = this.model.mxRelay
      ? DOMAIN_MODE.NON_AUTHORITATIVE
      : DOMAIN_MODE.AUTHORITATIVE;

    delete this.model.domainType;
    delete this.model.isUTF8Domain;
    delete this.model.displayName;
    delete this.model.configMode;
  }

  getDefaultLanguage() {
    return this.services.coreConfig.getUserLocale();
  }

  isFrenchLanguage() {
    return this.services.coreConfig.getUserLanguage() === 'fr';
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

  checkDomain() {
    this.loading = true;
    // check if domain has MxPlan already configured
    this.services.ExchangeDomains.checkMxPlan(this.model.name)
      .then(() => {
        this.model.mxRelay = DEFAULT_OVH_TARGET_SERVER_URL;
        this.loading = false;
      })
      .catch(() => {
        // check zimbra only if MxPlan not configured
        // because zimbra domain call is slow
        this.services.ExchangeDomains.checkZimbra(this.model.name)
          .then((found) => {
            if (found) {
              this.model.mxRelay = DEFAULT_OVH_TARGET_SERVER_URL;
            }
          })
          .finally(() => {
            this.loading = false;
          });
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

  onChangeDomainType() {
    this.resetName();
    this.isOvhDomain = this.model.domainType === this.OVH_DOMAIN;
    this.model.configMode = CONFIGURATION_MODE.RECOMMENDED;
    this.model.mxRelay = '';
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

  changeName() {
    this.model.name = punycode.toASCII(this.model.displayName);
    this.model.isUTF8Domain = this.model.displayName !== this.model.name;
  }

  isNonOvhDomainValid() {
    return (
      this.model.name &&
      (this.isOvhDomain ||
        this.services.WucValidator.isValidDomain(this.model.displayName))
    );
  }
}
