import { FIELD_NAME_LIST } from '../../new-account-form-component.constants';
import TimezoneFieldTranslationStrategy from './timezone';
import CorporationTypeFieldTranslationStrategy from './corporationType';
import StandardFieldTranslationStrategy from './standard';

export default class FieldTranslationStrategyFactory {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  build(fieldName) {
    if (fieldName === FIELD_NAME_LIST.timezone) {
      return new TimezoneFieldTranslationStrategy();
    }
    if (fieldName === FIELD_NAME_LIST.corporationType) {
      return new CorporationTypeFieldTranslationStrategy(this.$translate);
    }
    return new StandardFieldTranslationStrategy(this.$translate, fieldName);
  }
}
