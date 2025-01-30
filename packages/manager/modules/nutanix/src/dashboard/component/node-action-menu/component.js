import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    possibleActions: '<',
    onClickPowerOn: '&',
    onClickPowerOff: '&',
    onClickInstall: '&',
    onClickReinstall: '&',
    onClickUninstall: '&',
    onClickTerminate: '&',
  },
  template,
  controller,
};
