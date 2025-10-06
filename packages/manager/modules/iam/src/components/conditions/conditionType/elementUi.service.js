import { DROPDOWN_SELECTOR } from './elementUi.contants';

export default class ElementUiService {
  static scrollOuiCalendarIntoView($element) {
    // NOTE: We use querySelector() instead of $element.find() because JQuery
    // isn't available in staging, in which case AngularJS's JqLite is used instead,
    // and JqLite search method doesn't support class selector.
    const calendarSelector = DROPDOWN_SELECTOR.calendar;
    const element = $element[0];
    const calendarDropdownElement = element?.querySelector(calendarSelector);
    if (calendarDropdownElement) {
      calendarDropdownElement.scrollIntoView();
    }
  }

  static scrollOuiSelectIntoView($element) {
    // NOTE: See `scrollOuiCalendarIntoView` comment about $element.find().
    const dropdownSelector = DROPDOWN_SELECTOR.select;
    const element = $element[0];
    const dropdownElement = element?.querySelector(dropdownSelector);
    if (dropdownElement) {
      dropdownElement.scrollIntoView();
    }
  }
}
