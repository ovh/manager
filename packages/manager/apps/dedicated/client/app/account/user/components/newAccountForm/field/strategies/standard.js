import { FIELD_NAME_LIST } from '../../new-account-form-component.constants';

export default class StandardFieldTranslationStrategy {
  constructor($translate, fieldName) {
    this.$translate = $translate;
    this.fieldName = fieldName;
  }

  translate(value, country) {
    return this.$translate.instant(
      `signup_enum_${
        this.fieldName === FIELD_NAME_LIST.area && country ? `${country}_` : ''
      }${this.fieldName}_${value}`,
    );
  }
}
