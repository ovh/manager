angular.module('managerApp').constant('VOIP_TIME_CONDITION', {
  slotTypesCount: {
    sip: 3,
    easyHunting: 3,
    ovhPabx: 0,
  },
}).constant('VOIP_TIME_CONDITION_DEFAULT_SLOTS', [{
  name: 'available',
  noConfig: true,
  inEdition: false,
}, {
  name: 'slot1',
  noConfig: true,
  inEdition: false,
}, {
  name: 'slot2',
  noConfig: true,
  inEdition: false,
}, {
  name: 'slot3',
  noConfig: true,
  inEdition: false,
}, {
  name: 'unavailable',
  noConfig: true,
  inEdition: false,
}]).constant('VOIP_TIMECONDITION_ORDERED_DAYS', [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]);
