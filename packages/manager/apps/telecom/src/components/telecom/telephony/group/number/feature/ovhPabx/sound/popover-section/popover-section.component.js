import template from './popover-section.html';
import controller from './popover-section.controller';

export default {
  template,
  controller,
  require: {
    numberCtrl: '^^?telephonyNumber',
  },
  bindings: {
    ovhPabx: '=?',
    selectedSoundId: '=',
    onSoundChange: '&',
  },
};
