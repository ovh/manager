import template from './slot.html';
import controller from './slot.controller';

export default {
  template,
  controller,
  bindings: {
    slot: '=timeConditionSlot',
    enableEdition: '<?slotEnableEdition',
    hasPopover: '<?',
    isScheduler: '<?',
  },
};
