import { CONDITION_TYPES } from '../conditionType.constants';
import ElementUiService from '../elementUi.service';

const dateKeyTemplate = `date({{timezone}}).${CONDITION_TYPES.DATE}`;

export default class IAMConditionDateController {
  /* @ngInject */
  constructor($element) {
    this.$element = $element;
  }

  $onInit() {
    this.initForm();
  }

  initForm() {
    this.dates = this.condition?.value?.replaceAll(',', ', ');
  }

  updateConditionValues() {
    const fullKey = `${dateKeyTemplate.replace(
      '{{timezone}}',
      this.timezone?.timeZone,
    )}.${this.criterion?.value}`;
    this.condition.values = {
      [fullKey]: this.dates.replaceAll(' ', ''),
    };
  }

  $onChanges({ criterion }) {
    if (criterion && this.dates) {
      this.updateConditionValues();
    }
  }

  scrollCalendarIntoView() {
    ElementUiService.scrollOuiCalendarIntoView(this.$element);
  }
}
