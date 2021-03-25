import autoScrollOnToggle from './autoscroll-on-toggle.provider';

const moduleName = 'TelecomUibDropdownHelper';

angular
  .module(moduleName, [])
  .provider('autoScrollOnToggle', autoScrollOnToggle);

export default moduleName;
