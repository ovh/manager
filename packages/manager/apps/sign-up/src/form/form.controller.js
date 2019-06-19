import get from 'lodash/get';
import some from 'lodash/some';

export default class SignUpFormAppCtrl {
  constructor() {
    this.isActivityStepVisible = false;
  }

  onRulesUpdated(rules) {
    this.isActivityStepVisible = some([
      'organisation',
      'vat',
      'companyNationalIdentificationNumber',
      'corporationType',
    ], fieldName => get(rules, `${fieldName}`) !== undefined);
  }
}
