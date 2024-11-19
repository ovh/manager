import {
  INFO_PROPERTIES,
  INFO_PROPERTIES_ARRAY,
  LEGAL_FORM_INDIVIDUAL,
  GUIDE_URLS, OWNER_NOT_FOUND, INFO_PROPERTIES_ORGANISATION_ARRAY,
} from './dashboard.constants';

export default class DomainContactDashboardCtrl {
  /* @ngInject */
  constructor($state, coreConfig, coreURLBuilder, Domain, Alerter, $translate) {
    this.coreConfig = coreConfig;
    this.DomainService = Domain;
    this.$state = $state;
    this.coreURLBuilder = coreURLBuilder;
    this.Alerter = Alerter;
    this.user = this.coreConfig.getUser();
    this.hideOrganisationFields = true;
    this.$translate = $translate;
    this.loading = true;
    this.INFO_PROPERTIES = INFO_PROPERTIES;
    this.LEGAL_FORM_INDIVIDUAL = LEGAL_FORM_INDIVIDUAL;
    this.infoProperties = INFO_PROPERTIES_ARRAY;
    this.infoPropertiesOrganisation = INFO_PROPERTIES_ORGANISATION_ARRAY;
    this.ovhSubsidiary = this.user.ovhSubsidiary;
    this.GUIDE_URL = GUIDE_URLS[this.ovhSubsidiary] || GUIDE_URLS.DEFAULT;
    this.USER_ACCOUNT_INFOS_LINK = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/useraccount/infos',
    );
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
    this.hideOrganisationFields = !this.hideOrganisationFields;
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

  editContact(owner=false) {
    if (!owner){
      return window.open(this.USER_ACCOUNT_INFOS_LINK,'_blank');
    }
    this.$state.go('app.domain.edit-contact',
      {
        domainName: this.domainName,
        contactId: this.domain.whoisOwner.id,
      },
    );
  }

  showContactInfo(infoProperty) {
    return (
      (infoProperty.name === this.INFO_PROPERTIES.ORGANISATION &&
        this.user.legalform !== this.LEGAL_FORM_INDIVIDUAL) ||
      infoProperty.name !== this.INFO_PROPERTIES.ORGANISATION
    );
  }
}
