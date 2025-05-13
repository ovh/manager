export const VOIP_TIME_CONDITION = {
  slotTypesCount: {
    sip: 3,
    easyHunting: 3,
    ovhPabx: 0,
  },
};

export const VOIP_TIME_CONDITION_DEFAULT_SLOTS = [
  {
    name: 'available',
    noConfig: true,
    inEdition: false,
  },
  {
    name: 'slot1',
    noConfig: true,
    inEdition: false,
  },
  {
    name: 'slot2',
    noConfig: true,
    inEdition: false,
  },
  {
    name: 'slot3',
    noConfig: true,
    inEdition: false,
  },
  {
    name: 'unavailable',
    noConfig: true,
    inEdition: false,
  },
];

export const VOIP_TIMECONDITION_ORDERED_DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export default {
  VOIP_TIME_CONDITION,
  VOIP_TIME_CONDITION_DEFAULT_SLOTS,
  VOIP_TIMECONDITION_ORDERED_DAYS,
};
