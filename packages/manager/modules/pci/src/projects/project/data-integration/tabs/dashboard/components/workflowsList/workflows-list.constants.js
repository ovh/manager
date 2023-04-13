export const WORKFLOW_TABLE_COLUMNS = [
  {
    name: 'name',
    sort: {
      property: 'name',
      type: 'string',
    },
  },
  {
    name: 'source',
    sort: {
      property: 'sourceName',
      type: 'string',
    },
  },
  {
    name: 'destination',
    sort: {
      property: 'destinationName',
      type: 'string',
    },
  },
  {
    name: 'schedule',
    sort: {
      property: 'schedule',
      type: 'string',
    },
  },
  {
    name: 'status',
    sort: {
      property: 'status',
      type: 'string',
    },
  },
  {
    name: 'last_job',
    sort: {
      property: 'lastExecutionDate',
      type: 'date',
    },
  },
  {
    name: 'activated',
    sort: {
      property: 'enabled',
      type: 'boolean',
    },
  },
];
export const WORKFLOW_STATUSES = {
  SUCCESS: ['READY'],
  WARNING: ['CREATING'],
  ERROR: ['ERROR'],
};
export const MAX_THRESHOLD_MODE = {
  button: 10,
  select: 100,
};
export const ITEMS_PER_PAGE = 5;

export default {
  WORKFLOW_TABLE_COLUMNS,
  WORKFLOW_STATUSES,
  MAX_THRESHOLD_MODE,
  ITEMS_PER_PAGE,
};
