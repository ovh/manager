export const TRACKING = {
  EU: {
    config: {
      level2: '126',
    },
  },
  CA: {
    config: {
      level2: '126',
    },
  },
  US: {
    config: {
      level2: '126',
    },
  },
};

export const CHAPTER_1 = 'Authentication';
const CHAPTER_2 = 'account-creation';
const CHAPTER_3 = 'step3';

const BUTTON_TRACKING_SUFFIX = 'page::button';
export const BUTTON_TRACKING_PREFIX = `${CHAPTER_1}::${CHAPTER_2}::${CHAPTER_3}::${BUTTON_TRACKING_SUFFIX}`;

const DISPLAY_ROOT_PAGE_TRACKING_SUFFIX =
  'account-creation-step3::fill-in_contact_details';
export const DISPLAY_ROOT_PAGE_TRACKING = `${CHAPTER_1}::${CHAPTER_2}::${CHAPTER_3}::${DISPLAY_ROOT_PAGE_TRACKING_SUFFIX}`;

const ERROR_TRACKING_SUFFIX = 'create_account_step::banner-error';
export const ERROR_TRACKING_PREFIX = `${CHAPTER_1}::${CHAPTER_2}::${CHAPTER_3}::${ERROR_TRACKING_SUFFIX}`;

const SUBMIT_FORM_TRACKING_SUFFIX =
  'page::button::create_account_finalstep::confirmation';
export const SUBMIT_FORM_GOAL_TYPE = 'account-creation-finalstep';
export const SUBMIT_FORM_TRACKING_PREFIX = `${CHAPTER_1}::${CHAPTER_2}::${CHAPTER_3}::${SUBMIT_FORM_TRACKING_SUFFIX}`;

const REQUEST_RESULT_TRACKING_SUFFIX =
  'account-creation-finalstep::banner-success';
export const REQUEST_RESULT_TRACKING_PREFIX = `${CHAPTER_1}::${CHAPTER_2}::validation::${REQUEST_RESULT_TRACKING_SUFFIX}`;

export default {
  CHAPTER_1,
  BUTTON_TRACKING_PREFIX,
  DISPLAY_ROOT_PAGE_TRACKING,
  ERROR_TRACKING_PREFIX,
  REQUEST_RESULT_TRACKING_PREFIX,
  SUBMIT_FORM_GOAL_TYPE,
  SUBMIT_FORM_TRACKING_PREFIX,
  TRACKING,
};
