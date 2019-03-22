import OvhContactsHelper from './ovh-contacts.helpers';

export default class OvhContact {
  constructor(options = {}) {
    this.organisationName = options.organisationName || null;
    this.vat = options.vat || null;
    this.spareEmail = options.spareEmail || null;
    this.email = options.email || null;
    this.phone = OvhContactsHelper.normalizePhoneNumber(options.phone || null);
    this.cellPhone = OvhContactsHelper.normalizePhoneNumber(options.cellPhone || null);
    this.fax = options.fax || null;
    this.id = options.id || null;
    this.firstName = options.firstName || null;
    this.lastName = options.lastName || null;
    this.gender = options.gender || null;
    this.language = options.language || null;
    this.organisationType = options.organisationType || null;
    this.legalForm = options.legalForm || null;

    this.nationality = options.nationality || null;
    this.nationalIdentificationNumber = options.nationalIdentificationNumber || null;
    this.companyNationalIdentificationNumber = options.companyNationalIdentificationNumber || null;
    this.birthCity = options.birthCity || null;
    this.birthZip = options.birthZip || null;
    this.birthCountry = options.birthCountry || null;
    this.birthDay = OvhContactsHelper.normalizeDate(options.birthDay);

    if (options.address) {
      this.address = {
        country: options.address.country || null,
        line1: options.address.line1 || null,
        line2: options.address.line2 || null,
        line3: options.address.line3 || null,
        otherDetails: options.address.otherDetails || null,
        zip: options.address.zip || '',
        city: options.address.city || null,
        province: options.address.province || null,
      };
    } else {
      this.address = {
        country: null,
        line1: null,
        line2: null,
        line3: null,
        otherDetails: null,
        zip: null,
        city: null,
        province: null,
      };
    }
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
