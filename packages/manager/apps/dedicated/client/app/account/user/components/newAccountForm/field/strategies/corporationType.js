import {
  CORPORATION_TYPES,
  FIELD_NAME_LIST,
} from '../../new-account-form-component.constants';

export default class CorporationTypeFieldTranslationStrategy {
  constructor($translate) {
    this.$translate = $translate;
  }

  translate(value) {
    return (
      CORPORATION_TYPES[value] ||
      this.$translate.instant(
        `signup_enum_${FIELD_NAME_LIST.corporationType}_${value}`,
      )
    );
  }
}
