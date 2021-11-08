export const LANGUAGES = {
  NODE: 'Node.js',
  PHP: 'PHP',
};

export const TASK_MAPPING = {
  'cron/create': 'createCron',
  'cron/update': 'editCron',
  'cron/delete': 'deleteCron',
};

export const POLLING_EVENTS_ERROR = {
  delete: 'hostingDomain.deleteCron.error',
  edit: 'hostingDomain.editCron.error',
  create: 'hostingDomain.createCron.error',
};

export const POLLING_EVENTS_DONE = {
  delete: 'hostingDomain.deleteCron.done',
  edit: 'hostingDomain.editCron.done',
  create: 'hostingDomain.createCron.done',
};

export const POLLING_EVENTS_MESSAGE_DISPLAY = {
  [POLLING_EVENTS_ERROR.delete]: 'hosting_tab_CRON_configuration_delete_fail',
  [POLLING_EVENTS_ERROR.edit]: 'hosting_tab_CRON_edit_error',
  [POLLING_EVENTS_ERROR.create]: 'hosting_tab_CRON_save_error',
};

export const PATTERN = /\d+(_\d)?/;

export const OTHER = 'other';

export const STATUS_CREATED = 'created';

export default {
  LANGUAGES,
  POLLING_EVENTS_ERROR,
  POLLING_EVENTS_DONE,
  POLLING_EVENTS_MESSAGE_DISPLAY,
  PATTERN,
  OTHER,
  STATUS_CREATED,
};
