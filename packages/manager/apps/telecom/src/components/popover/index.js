import popoverAutofocus from './popover-autofocus.directive';
import popoverOnOutsideClick from './popover-on-outside-click.directive';

const moduleName = 'TelecomPopoverUtils';

angular
  .module(moduleName, [])
  .directive('popoverAutofocus', popoverAutofocus)
  .directive('popoverOnOutsideClick', popoverOnOutsideClick);

export default moduleName;
