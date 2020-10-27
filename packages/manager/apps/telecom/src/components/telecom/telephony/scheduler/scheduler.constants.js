export const CATEGORY_TO_TIME_CONDITION_SLOT_TYPE = {
  holidays: 'unavailable',
  scheduler1: 'slot1',
  scheduler2: 'slot2',
  scheduler3: 'slot3',
};

export const CATEGORY_TO_ICS_VEVENT_CATEGORY = {
  holidays: 'holidays',
  scheduler1: 'genericScreenListIndex1',
  scheduler2: 'genericScreenListIndex2',
  scheduler3: 'genericScreenListIndex3',
};

export const SCHEDULER_BANK_HOLIDAYS = {
  FR: [
    {
      name: 'new_year',
      date: '01-01',
    },
    {
      name: 'easter_monday',
      date: null,
    },
    {
      name: 'labor_day',
      date: '05-01',
    },
    {
      name: 'armistice_1945',
      date: '05-08',
    },
    {
      name: 'ascension_day',
      date: null,
    },
    {
      name: 'whit_monday',
      date: null,
    },
    {
      name: 'national_holiday',
      date: '07-14',
    },
    {
      name: 'assumption_day',
      date: '08-15',
    },
    {
      name: 'all_saints_day',
      date: '11-01',
    },
    {
      name: 'armistice_1918',
      date: '11-11',
    },
    {
      name: 'christmas',
      date: '12-25',
    },
  ],
  BE: [
    {
      name: 'new_year',
      date: '01-01',
    },
    {
      name: 'easter_monday',
      date: null,
    },
    {
      name: 'labor_day',
      date: '05-01',
    },
    {
      name: 'ascension_day',
      date: null,
    },
    {
      name: 'whit_monday',
      date: null,
    },
    {
      name: 'national_holiday',
      date: '07-21',
    },
    {
      name: 'assumption_day',
      date: '08-15',
    },
    {
      name: 'all_saints_day',
      date: '11-01',
    },
    {
      name: 'armistice_1918',
      date: '11-11',
    },
    {
      name: 'christmas',
      date: '12-25',
    },
  ],
  DE: [
    {
      name: 'new_year',
      date: '01-01',
    },
    {
      name: 'good_friday',
      date: null,
    },
    {
      name: 'easter_monday',
      date: null,
    },
    {
      name: 'labor_day',
      date: '05-01',
    },
    {
      name: 'ascension_day',
      date: null,
    },
    {
      name: 'whit_monday',
      date: null,
    },
    {
      name: 'national_holiday',
      date: '10-03',
    },
    {
      name: 'christmas',
      date: '12-25',
    },
    {
      name: 'after_christmas',
      date: '12-26',
    },
  ],
  ES: [
    {
      name: 'new_year',
      date: '01-01',
    },
    {
      name: 'epiphany',
      date: '01-06',
    },
    {
      name: 'good_friday',
      date: null,
    },
    {
      name: 'labor_day',
      date: '05-01',
    },
    {
      name: 'assumption_day',
      date: '08-15',
    },
    {
      name: 'national_holiday',
      date: '10-12',
    },
    {
      name: 'all_saints_day',
      date: '11-01',
    },
    {
      name: 'constitution_day',
      date: '12-06',
    },
    {
      name: 'immaculate_conception',
      date: '12-08',
    },
    {
      name: 'christmas',
      date: '12-25',
    },
  ],
  GB: [
    {
      name: 'new_year',
      date: '01-01',
    },
    {
      name: 'good_friday',
      date: null,
    },
    {
      name: 'whit_monday',
      date: null,
    },
    {
      name: 'may_day',
      date: null,
    },
    {
      name: 'spring_bank_holiday',
      date: null,
    },
    {
      name: 'summer_bank_holiday',
      date: null,
    },
    {
      name: 'christmas',
      date: '12-25',
    },
    {
      name: 'boxing_day',
      date: '12-26',
    },
  ],
  CH: [
    {
      name: 'new_year',
      date: '01-01',
    },
    {
      name: 'easter_monday',
      date: null,
    },
    {
      name: 'ascension_day',
      date: null,
    },
    {
      name: 'whit_monday',
      date: null,
    },
    {
      name: 'national_holiday',
      date: '08-01',
    },
    {
      name: 'christmas',
      date: '12-25',
    },
  ],
};

export default {
  CATEGORY_TO_TIME_CONDITION_SLOT_TYPE,
  CATEGORY_TO_ICS_VEVENT_CATEGORY,
  SCHEDULER_BANK_HOLIDAYS,
};
