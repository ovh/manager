import {
  INFO_PROPERTIES,
  INFO_PROPERTIES_ARRAY,
  LEGAL_FORM_INDIVIDUAL,
  GUIDE_URLS,
  INFO_PROPERTIES_ORGANISATION_ARRAY,
  OWNER_INFO_PROPERTIES,
  OWNER_INFO_PROPERTIES_ORGANISATION_ARRAY,
  OWNER_INFO_PROPERTIES_ARRAY,
  CONTACT_MANAGEMENT_TRACKING,
} from './contact.constants';

export default class DomainContactDashboardCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    atInternet,
    ContactService,
    coreConfig,
    coreURLBuilder,
    Domain,
    Alerter,
    $translate,
  ) {
    this.$q = $q;
    this.ContactService = ContactService;
    this.DomainService = Domain;
    this.$state = $state;
    this.atInternet = atInternet;
    this.coreURLBuilder = coreURLBuilder;
    this.Alerter = Alerter;
    this.user = coreConfig.getUser();
    this.isRegionCA = coreConfig.isRegion('CA');
    this.$translate = $translate;
    this.loading = true;
    this.ovhSubsidiary = this.user.ovhSubsidiary;
    this.GUIDE_URL = GUIDE_URLS[this.ovhSubsidiary] || GUIDE_URLS.DEFAULT;
    this.USER_ACCOUNT_INFOS_LINK = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/useraccount/infos',
    );
  }

  $onInit() {
    this.$q
      .all({
        domainInfos: this.DomainService.getServiceInfo(this.domainName),
        ownerInfos: this.domain.whoisOwner?.id
          ? this.ContactService.getDomainContactInformations(
              this.domain.whoisOwner.id,
            )
          : null,
      })
      .then(({ domainInfos, ownerInfos }) => {
        this.domainInfos = domainInfos;
        this.isNicAdmin = this.user.nichandle === this.domainInfos.contactAdmin;
        this.ownerInfos = ownerInfos;
        this.infoProperties =
          this.user.legalform !== LEGAL_FORM_INDIVIDUAL
            ? INFO_PROPERTIES_ORGANISATION_ARRAY
            : INFO_PROPERTIES_ARRAY;
        this.ownerInfoProperties =
          this.ownerInfos?.legalForm !== LEGAL_FORM_INDIVIDUAL
            ? OWNER_INFO_PROPERTIES_ORGANISATION_ARRAY
            : OWNER_INFO_PROPERTIES_ARRAY;
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

  editContact(contactType) {
    this.trackClick({
      ...CONTACT_MANAGEMENT_TRACKING.EDIT_CONTACT,
      name: CONTACT_MANAGEMENT_TRACKING.EDIT_CONTACT.name.replace(
        '{{contactType}}',
        contactType,
      ),
    });
    if (contactType !== 'holder') {
      return window.open(this.USER_ACCOUNT_INFOS_LINK, '_blank');
    }
    return this.$state.go('app.domain.product.contact.edit', {
      contactId: this.domain.whoisOwner.id,
    });
  }

  showContactInfo(infoProperty) {
    return (
      (infoProperty.name === INFO_PROPERTIES.ORGANISATION &&
        this.user.legalform !== LEGAL_FORM_INDIVIDUAL) ||
      (!this.isRegionCA && INFO_PROPERTIES.EMAIL) ||
      ![INFO_PROPERTIES.ORGANISATION, INFO_PROPERTIES.EMAIL].includes(
        infoProperty.name,
      )
    );
  }

  getDisplayedOwnerField(infoProperty) {
    const handleNestedProp = (user, value) => {
      if (value.includes('.')) {
        const obj = this.ownerInfos[value.split('.')[0]];
        return obj[value.split('.')[1]];
      }
      return this.ownerInfos[value];
    };
    return infoProperty.values
      .map((prop) => handleNestedProp(this.ownerInfos, prop))
      .join(' ');
  }

  showOwnerInfo(infoProperty) {
    return (
      (infoProperty.name === OWNER_INFO_PROPERTIES.ORGANISATION &&
        this.ownerInfos.legalForm !== LEGAL_FORM_INDIVIDUAL) ||
      infoProperty.name !== OWNER_INFO_PROPERTIES.ORGANISATION
    );
  }

  openReassignContacts() {
    this.trackClick(CONTACT_MANAGEMENT_TRACKING.REASSIGN_CONTACT);
    window.open(this.contactsManagementUrl, '_blank');
  }

  trackClick(hit) {
    this.atInternet.trackClick({
      ...hit,
      type: 'action',
    });
  }
}
