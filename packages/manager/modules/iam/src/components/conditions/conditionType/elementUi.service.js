import { DROPDOWN_SELECTOR } from './elementUi.contants';

export default class ElementUiService {
  static scrollOuiCalendarIntoView($element) {
    const calendarSelector = DROPDOWN_SELECTOR.calendar;
    const calendarDropdownElement = $element.find(calendarSelector)[0];
    if (calendarDropdownElement) {
      calendarDropdownElement.scrollIntoView();
    }
  }

  static scrollOuiSelectIntoView($element) {
    const dropdownSelector = DROPDOWN_SELECTOR.select;
    const dropdownElement = $element.find(dropdownSelector)[0];
    if (dropdownElement) {
      dropdownElement.scrollIntoView();
    }
  }
}
