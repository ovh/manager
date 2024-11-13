import {
  INFO_PROPERTIES,
  INFO_PROPERTIES_ARRAY,
  LEGAL_FORM_INDIVIDUAL,
} from './dashboard.constants';

export default class DomainContactDashboardCtrl {
  /* @ngInject */
  constructor(coreConfig, Domain, Alerter, $translate) {
    this.coreConfig = coreConfig;
    this.DomainService = Domain;
    this.Alerter = Alerter;
    this.user = this.coreConfig.getUser();
    this.hideAdminDescription = true;
    this.$translate = $translate;
    this.loading = true;
    this.INFO_PROPERTIES = INFO_PROPERTIES;
    this.LEGAL_FORM_INDIVIDUAL = LEGAL_FORM_INDIVIDUAL;
    this.infoProperties = INFO_PROPERTIES_ARRAY;
  }

  $onInit() {
    this.DomainService.getServiceInfo(this.domainName)
      .then((data) => {
        this.domainInfos = data;
        this.isNicAdmin = this.user.nichandle === this.domainInfos.contactAdmin;
      })
      .catch((error) => {
        const errorMessage = error.data?.message || error.data;
        this.Alerter.error(
          [
            this.$translate.instant(
              'domain_tab_CONTACT_description_error_message',
            ),
            errorMessage ? `(${errorMessage})` : '',
          ].join(' '),
          'dashboardContact',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  toggleAdminDescription() {
    this.hideAdminDescription = !this.hideAdminDescription;
  }

  getDisplayedField(infoProperty) {
    const handleNestedProp = (user, value) => {
      return value === 'city.country'
        ? this.user.city.country
        : this.user[value];
    };
    return infoProperty.values
      .map((prop) => handleNestedProp(this.user, prop))
      .join(' ');
  }

  showContactInfo(infoProperty) {
    return (
      (infoProperty.name === this.INFO_PROPERTIES.ORGANISATION &&
        this.user.legalform !== this.LEGAL_FORM_INDIVIDUAL) ||
      infoProperty.name !== this.INFO_PROPERTIES.ORGANISATION
    );
  }
}
